import { Router, type IRouter } from "express";
import { db, studentsTable, internshipsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

const router: IRouter = Router();

function computeScore(
  student: typeof studentsTable.$inferSelect,
  internship: typeof internshipsTable.$inferSelect
): {
  score: number;
  skillMatchScore: number;
  interestScore: number;
  locationScore: number;
  popularityScore: number;
  matchedSkills: string[];
  missingSkills: string[];
} {
  const studentSkills = (student.skills as string[] || []).map(s => s.toLowerCase().trim());
  const studentDomains = (student.domains as string[] || []).map(d => d.toLowerCase().trim());
  const requiredSkills = (internship.requiredSkills as string[] || []).map(s => s.toLowerCase().trim());

  // Fuzzy matching for skills
  const matchedSkills = requiredSkills.filter(req => 
    studentSkills.some(stud => stud.includes(req) || req.includes(stud))
  );
  
  const missingSkills = requiredSkills.filter(req => 
    !studentSkills.some(stud => stud.includes(req) || req.includes(stud))
  );

  const skillMatchScore = requiredSkills.length > 0
    ? (matchedSkills.length / requiredSkills.length) * 50
    : 25;

  // IMPROVED: Fuzzy matching for domains
  const interestScore = studentDomains.some(d => 
    internship.domain.toLowerCase().includes(d) || d.includes(internship.domain.toLowerCase())
  ) ? 30 : 0;

  const locationScore =
    internship.location.toLowerCase() === "remote" ||
    internship.location.toLowerCase().includes(student.location.toLowerCase()) ||
    student.location.toLowerCase().includes(internship.location.toLowerCase())
      ? 15
      : 5;

  const popularityScore = Math.min((internship.popularity / 100) * 5, 5);

  const score = skillMatchScore + interestScore + locationScore + popularityScore;

  return {
    score: Math.round(score),
    skillMatchScore: Math.round(skillMatchScore),
    interestScore: Math.round(interestScore),
    locationScore: Math.round(locationScore),
    popularityScore: Math.round(popularityScore),
    matchedSkills: matchedSkills.map(s => s.toUpperCase()),
    missingSkills: missingSkills.map(s => s.toUpperCase()),
  };
}

async function getAIInsight(
  studentName: string,
  internshipTitle: string,
  company: string,
  matchedSkills: string[],
  missingSkills: string[]
): Promise<string> {
  if (!NVIDIA_API_KEY) {
    return `${studentName} is a good fit for the ${internshipTitle} role at ${company} based on skill alignment.`;
  }

  try {
    const prompt = `In 1-2 sentences, explain why a student with skills [${matchedSkills.join(", ")}] would be a good candidate for a ${internshipTitle} internship at ${company}. ${missingSkills.length > 0 ? `They should also consider learning: ${missingSkills.slice(0, 2).join(", ")}.` : ""} Be encouraging and specific.`;

    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error("NVIDIA API error");
    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message?.content?.trim() ?? "Strong match based on your profile.";
  } catch {
    return `Your ${matchedSkills.slice(0, 2).join(" and ")} skills make you a competitive candidate for ${internshipTitle} at ${company}.`;
  }
}

router.get("/recommendations/:studentId", async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const limit = parseInt((req.query.limit as string) ?? "10");

  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  let currentSkills: string[] = [];
  try {
    currentSkills = typeof student.skills === 'string' ? JSON.parse(student.skills) : (student.skills as string[] || []);
  } catch (e) { currentSkills = (student.skills as string[] || []); }

  let studentDomains: string[] = [];
  try {
    studentDomains = typeof student.domains === 'string' ? JSON.parse(student.domains) : (student.domains as string[] || []);
  } catch (e) { studentDomains = (student.domains as string[] || []); }

  console.log(`[AI MATCH] Precision Matching for ${student.name} | Domains: ${studentDomains.join(", ")}`);

  let internships = await db.select().from(internshipsTable).limit(20);
  
  // High-precision AI generation
  if (NVIDIA_API_KEY) {
    try {
      const prompt = `Generate 6 high-precision internship opportunities that strictly bridge these technical skills: [${currentSkills.join(", ")}] with these career domains: [${studentDomains.join(", ")}].
      Example: If skills are Java and domain is QA, generate 'Automation QA Engineer'. If skills are JS and domain is Product, generate 'Technical Product Associate'.
      Return ONLY a JSON array of objects with: title, company, domain, location, requiredSkills (array), description, duration, stipend, salaryRange, applicationDeadline, experienceRange (must be "0-1 Yrs").`;
      
      const aiResponse = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${NVIDIA_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6, // Lower temperature for more focused results
        }),
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json() as any;
        const aiText = data.choices[0]?.message?.content?.trim() ?? "[]";
        const jsonMatch = aiText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const aiJobs = JSON.parse(jsonMatch[0]);
          for (const job of aiJobs) {
            // Check if this job already exists to avoid duplicates
            const [exists] = await db.select().from(internshipsTable).where(eq(internshipsTable.title, job.title));
            if (!exists) {
              await db.insert(internshipsTable).values({ ...job, popularity: 90 });
            }
          }
          internships = await db.select().from(internshipsTable);
        }
      }
    } catch (error) { console.error("[AI PRECISION] Error:", error); }
  }

  const scored = internships.map(internship => {
    const scores = computeScore({ ...student, skills: currentSkills }, internship);
    return { internship, ...scores };
  });

  scored.sort((a, b) => b.score - a.score);
  const results = await Promise.all(
    scored.slice(0, limit).map(async item => ({
      ...item,
      internship: { ...item.internship, requiredSkills: item.internship.requiredSkills ?? [] },
      aiInsight: await getAIInsight(student.name, item.internship.title, item.internship.company, item.matchedSkills, item.missingSkills),
    }))
  );

  return res.json(results);
});

router.get("/recommendations/:studentId/career-paths", async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  const skills = (student.skills as string[]);
  const domains = (student.domains as string[]);

  const careerPaths = [
    {
      title: "Full-Stack Developer",
      description: "Build complete web applications from frontend to backend, working across the entire technology stack.",
      requiredSkills: ["JavaScript", "React", "Node.js", "SQL", "Git"],
      timelineMonths: 12,
      matchScore: computeCareerMatchScore(skills, ["javascript", "react", "node.js", "sql", "git"]),
      steps: ["Master JavaScript fundamentals", "Learn React & state management", "Build REST APIs with Node.js", "Learn SQL & database design", "Deploy full-stack apps"],
    },
    {
      title: "Data Science Analyst",
      description: "Extract insights from data using statistical methods, machine learning, and data visualization.",
      requiredSkills: ["Python", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
      timelineMonths: 18,
      matchScore: computeCareerMatchScore(skills, ["python", "sql", "machine learning", "statistics", "data visualization"]),
      steps: ["Learn Python & NumPy/Pandas", "Study statistics & probability", "Practice SQL for data analysis", "Learn ML with scikit-learn", "Build data visualization skills"],
    },
    {
      title: "AI/ML Engineer",
      description: "Design, build and deploy machine learning models and AI systems at scale.",
      requiredSkills: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "MLOps"],
      timelineMonths: 24,
      matchScore: computeCareerMatchScore(skills, ["python", "tensorflow", "pytorch", "deep learning", "mlops"]),
      steps: ["Strong Python programming", "Mathematics for ML", "Deep learning frameworks", "Model training & evaluation", "MLOps & deployment"],
    },
    {
      title: "Cloud/DevOps Engineer",
      description: "Build and maintain cloud infrastructure, CI/CD pipelines, and automated deployment systems.",
      requiredSkills: ["AWS/GCP/Azure", "Docker", "Kubernetes", "CI/CD", "Linux"],
      timelineMonths: 12,
      matchScore: computeCareerMatchScore(skills, ["aws", "docker", "kubernetes", "ci/cd", "linux"]),
      steps: ["Learn Linux & shell scripting", "Containerization with Docker", "Container orchestration (Kubernetes)", "Cloud platform fundamentals", "Implement CI/CD pipelines"],
    },
    {
      title: "Cybersecurity Specialist",
      description: "Protect systems, networks, and data from digital attacks and ensure security compliance.",
      requiredSkills: ["Network Security", "Ethical Hacking", "Cryptography", "Security Auditing", "Firewalls"],
      timelineMonths: 15,
      matchScore: computeCareerMatchScore(skills, ["security", "hacking", "cryptography", "audit", "linux"]),
      steps: ["Learn Networking fundamentals", "Master Linux & Command line", "Study Ethical Hacking & Pen testing", "Learn Cryptography basics", "Obtain Security certifications"],
    },
    {
      title: "UI/UX Designer",
      description: "Create intuitive and beautiful user interfaces and optimize the overall user experience of products.",
      requiredSkills: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping"],
      timelineMonths: 9,
      matchScore: computeCareerMatchScore(skills, ["figma", "design", "research", "ui", "ux"]),
      steps: ["Learn Design principles", "Master Figma or Sketch", "Study User Psychology & Research", "Practice Wireframing & Prototyping", "Build a strong Portfolio"],
    },
    {
      title: "Mobile App Developer",
      description: "Design and build applications specifically for mobile platforms like iOS and Android.",
      requiredSkills: ["React Native", "Flutter", "Swift", "Kotlin", "Mobile UI"],
      timelineMonths: 10,
      matchScore: computeCareerMatchScore(skills, ["react native", "flutter", "swift", "kotlin", "mobile"]),
      steps: ["Learn Mobile UX design", "Master a Cross-platform framework", "Study Native development basics", "Learn API integration", "Publish apps to App Stores"],
    },
    {
      title: "Blockchain Developer",
      description: "Build decentralized applications and smart contracts using blockchain technology.",
      requiredSkills: ["Solidity", "Ethereum", "Smart Contracts", "Web3.js", "Rust"],
      timelineMonths: 14,
      matchScore: computeCareerMatchScore(skills, ["solidity", "blockchain", "web3", "ethereum", "rust"]),
      steps: ["Understand Blockchain fundamentals", "Learn Solidity & Smart Contracts", "Study Web3.js or Ethers.js", "Practice DApp development", "Learn about L2 solutions"],
    },
    {
      title: "Technical Product Manager",
      description: "Bridge the gap between business goals and technical execution for software products.",
      requiredSkills: ["Product Strategy", "Agile/Scrum", "Data Analytics", "Roadmapping", "Communication"],
      timelineMonths: 18,
      matchScore: computeCareerMatchScore(skills, ["strategy", "agile", "analytics", "communication", "product"]),
      steps: ["Master Agile methodologies", "Study Market & User Research", "Learn Data-driven decision making", "Develop Stakeholder management skills", "Create Product Roadmaps"],
    },
  ];

  careerPaths.sort((a, b) => b.matchScore - a.matchScore);
  res.json(careerPaths);
});

router.get("/recommendations/generate-application/:internshipId", async (req, res) => {
  const internshipId = parseInt(req.params.internshipId);
  const studentId = parseInt(req.query.studentId as string);

  if (!studentId) {
    res.status(400).json({ error: "studentId query parameter is required" });
    return;
  }

  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  const [internship] = await db.select().from(internshipsTable).where(eq(internshipsTable.id, internshipId));
  if (!internship) {
    res.status(404).json({ error: "Internship not found" });
    return;
  }

  if (!NVIDIA_API_KEY) {
    res.json({
      applicationDraft: `Dear Hiring Manager at ${internship.company},\n\nI am writing to express my interest in the ${internship.title} position. With my background in ${student.skills.slice(0, 3).join(", ")}, I am confident I can contribute effectively to your team.\n\nBest regards,\n${student.name}`,
    });
    return;
  }

  try {
    const prompt = `Write a professional and personalized 3-paragraph internship application letter for a student named ${student.name} applying for the "${internship.title}" role at ${internship.company}. 
    
    Student Profile:
    - Skills: ${student.skills.join(", ")}
    - Domains of interest: ${student.domains.join(", ")}
    - Location: ${student.location}
    - Bio: ${student.bio || "Enthusiastic student looking for opportunities"}
    
    Internship Details:
    - Title: ${internship.title}
    - Company: ${internship.company}
    - Description: ${internship.description}
    - Required Skills: ${internship.requiredSkills?.join(", ") || "General skills"}
    
    The letter should be professional, highlight matching skills, and sound enthusiastic. Keep it under 250 words. Return only the letter text.`;

    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error("NVIDIA API error");
    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const draft = data.choices[0]?.message?.content?.trim() ?? "Error generating draft.";
    
    res.json({ applicationDraft: draft });
  } catch (error) {
    console.error("AI Generation error:", error);
    res.status(500).json({ error: "Failed to generate application draft" });
  }
});

function computeCareerMatchScore(studentSkills: string[], requiredSkills: string[]): number {
  const lower = studentSkills.map(s => s.toLowerCase());
  const matched = requiredSkills.filter(s => lower.some(sk => sk.includes(s) || s.includes(sk)));
  return Math.round((matched.length / requiredSkills.length) * 100);
}

export default router;
