import { Router } from "express";
import { db, studentsTable, feedbackTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import multer from "multer";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Function to parse PDF safely
async function parsePDF(buffer: Buffer) {
  console.log(`Attempting to parse PDF. Buffer size: ${buffer.length} bytes.`);
  try {
    const pdf = require("pdf-parse");
    const options = {
      pagerender: (pageData: any) => {
        return pageData.getTextContent().then((textContent: any) => {
          return textContent.items.map((item: any) => item.str).join(' ');
        });
      }
    };
    const data = await pdf(buffer);
    const text = data?.text || "";
    console.log(`Primary PDF parsing successful. Extracted ${text.length} characters.`);
    
    if (text.trim().length < 10) {
      console.log("Extracted text too short, trying alternative rendering...");
      const dataAlt = await pdf(buffer, options);
      console.log(`Alternative PDF parsing extracted ${dataAlt?.text?.length || 0} characters.`);
      return dataAlt?.text || text;
    }
    
    return text;
  } catch (err) {
    console.error("PDF Parse Critical Error:", err);
    return "";
  }
}

// Real Extract Route
router.post("/extract-skills", upload.single("resume"), async (req, res) => {
  const file = req.file;
  let studentId: number | null = null;
  if (req.body.studentId) {
    const parsed = parseInt(req.body.studentId);
    if (!isNaN(parsed)) studentId = parsed;
  }
  let resumeText = "";
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

  try {
    if (file) {
      // 1. Try to parse file content
      try {
        console.log(`Incoming file: ${file.originalname}, MimeType: ${file.mimetype}, Size: ${file.size} bytes`);

        if (file.mimetype.includes("pdf") || file.originalname.toLowerCase().endsWith(".pdf")) {
          resumeText = await parsePDF(file.buffer);
        } else if (file.mimetype.includes("word") || file.mimetype.includes("officedocument") || file.originalname.toLowerCase().endsWith(".docx")) {
          const data = await mammoth.extractRawText({ buffer: file.buffer });
          resumeText = data.value;
        } else {
          // Fallback for text files or unknown types
          resumeText = file.buffer.toString('utf8');
        }
      } catch (e) {
        console.error("Parsing failed, falling back to filename");
      }

      const contextText = `${resumeText} ${file.originalname}`;
      console.log(`Parsed resume text length: ${resumeText.length} characters. StudentID: ${studentId}`);

      if (!resumeText || resumeText.trim().length < 10) {
        return res.status(400).json({ 
          error: "No readable text found in the file. If this is an image-based PDF, please upload a text-based PDF or a Word document.",
          _debug: { textLength: resumeText?.length || 0 }
        });
      }

      let dbSaveStatus = "skipped";
      let dbErrorMsg = null;

      // Ensure we have a valid update
      if (studentId && resumeText && resumeText.trim().length > 10) {
        try {
          console.log(`[DB Debug] Attempting to update student ${studentId} with ${resumeText.length} chars...`);
          await db.execute(sql`UPDATE students SET resume_text = ${resumeText.trim()} WHERE id = ${studentId}`);
          console.log(`[DB Success] Update completed for student ${studentId}`);
          dbSaveStatus = "success";
        } catch (dbErr: any) {
          console.error("[DB Error] Drizzle update failed:", dbErr);
          dbSaveStatus = "failed";
          dbErrorMsg = dbErr?.message || String(dbErr);
        }
      }

      // 2. Use AI if available for high-precision extraction
      if (NVIDIA_API_KEY && (resumeText.trim().length > 10 || file.originalname.toLowerCase().includes("resume"))) {
        try {
          const prompt = `You are an elite ATS (Applicant Tracking System) Analyzer.
          Task: Scan the provided resume text and calculate a professional ATS compatibility score (0-100) based on the presence and quality of these specific sections:
          1. Header / Contact Information
          2. Career Objective / Professional Summary
          3. Technical Skills
          4. Education
          5. Projects
          6. Internship Experience
          7. Certifications
          8. Achievements
          9. Positions of Responsibility / Leadership
          10. Extracurricular Activities
          11. Languages Known
          12. Interests / Hobbies
          13. GitHub Profile
          14. LinkedIn Profile
          15. Portfolio / Personal Website
          16. Relevant Coursework
          17. Training / Workshops
          18. Hackathons / Coding Competitions
          19. Open Source Contributions
          20. Publications / Research Papers
          
          Scoring Criteria:
          - 0-20: NOT a resume or extremely low quality (missing almost all sections).
          - 21-50: Weak resume, missing many core sections like Projects or Experience.
          - 51-75: Decent resume, has most core sections but missing social links or certifications.
          - 76-90: Strong professional resume with all core sections and good formatting.
          - 91-100: Outstanding resume with all 20 sections or high-impact achievements.
          
          Resume Text: "${resumeText.substring(0, 6000)}"
          
          Return ONLY a valid JSON object: { "skills": ["skill1", "skill2"], "score": number, "isResume": boolean, "analysis": "brief summary of missing sections" }`;

          console.log("Sending Prompt to NVIDIA AI...");
          const aiResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${NVIDIA_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "meta/llama-3.1-8b-instruct",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.1,
            }),
          });

          if (aiResponse.ok) {
            const data = await aiResponse.json() as any;
            const content = data.choices[0].message.content;
            console.log("AI Raw Content:", content);
            
            const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
            const result = JSON.parse(jsonStr);
            console.log("Parsed AI Result:", result);
            
            return res.json({ 
              skills: result.skills || [],
              score: result.isResume ? result.score : Math.min(15, result.score || 0),
              isResume: result.isResume,
              analysis: result.analysis
            });
          } else {
            const errorText = await aiResponse.text();
            console.error("AI Response Error:", errorText);
          }
        } catch (aiErr) {
          console.error("AI Analysis failed, using fallback:", aiErr);
        }
      }
      
      // 3. Fallback to strict keyword extraction if AI fails or no key
      // If content is too thin, don't give a high score
      if (resumeText.trim().length < 50) {
        return res.json({ skills: [], score: 5, analysis: "Resume content too short to analyze." });
      }

      const possibleSkills = [
        "React", "TypeScript", "Node.js", "Python", "SQL", "TailwindCSS", 
        "AWS", "Docker", "Java", "C++", "JavaScript", "HTML", "CSS", 
        "Spring Boot", "Express", "MongoDB", "PostgreSQL", "Flutter", 
        "React Native", "Android", "Machine Learning", "Data Analysis",
        "PowerBI", "Tableau", "Git", "Kubernetes", "Redis", "GraphQL",
        "Communication", "Leadership", "Project Management", "Problem Solving"
      ];
      
      const extracted = possibleSkills.filter(s => 
        contextText.toLowerCase().includes(s.toLowerCase())
      );

      // Heuristic score if AI fails
      const baseScore = 30;
      const lengthBonus = Math.min(20, Math.floor(resumeText.length / 500));
      const skillBonus = Math.min(30, extracted.length * 5);
      const totalScore = baseScore + lengthBonus + skillBonus;

      return res.json({ 
        skills: extracted,
        score: Math.min(95, totalScore),
        analysis: "Processed with heuristic analysis (AI Offline/Failed)."
      });
    }

    return res.status(400).json({ error: "No file uploaded" });
  } catch (error) {
    console.error("Extraction error:", error);
    return res.json({ 
      skills: ["JavaScript", "HTML"],
      score: 65,
      error: "Detailed analysis failed, showing basic results."
    });
  }
});

// AI Career Chat Assistant (Restored with Full Professional Instructions)
router.post("/career-chat", async (req, res) => {
  const { message } = req.body;
  const studentId = req.body.studentId ? parseInt(req.body.studentId) : null;
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

  try {
    const [student] = studentId ? await db.select().from(studentsTable).where(eq(studentsTable.id, studentId)) : [null];
    console.log(`[Chat Debug] StudentID: ${studentId}, Name: ${student?.name}, HasResume: ${!!student?.resumeText}, Length: ${student?.resumeText?.length || 0}`);

    if (!NVIDIA_API_KEY) {
      return res.json({ 
        response: "AI Assistant is currently in offline mode. But based on your profile, you're doing great! Try adding more projects to your portfolio." 
      });
    }

    let studentSkills: string[] = [];
    try {
      studentSkills = typeof student?.skills === 'string' ? JSON.parse(student.skills) : (student?.skills as string[] || []);
    } catch (e) { studentSkills = (student?.skills as string[] || []); }

    let studentDomains: string[] = [];
    try {
      studentDomains = typeof student?.domains === 'string' ? JSON.parse(student.domains) : (student?.domains as string[] || []);
    } catch (e) { studentDomains = (student?.domains as string[] || []); }

    const prompt = `You are an expert career counselor specializing in the Indian technology market. 
    A student is asking: "${message}"
    
    Student Profile:
    - Name: ${student?.name || "Student"}
    - Location: ${student?.location || "India"}
    - Skills: ${studentSkills.join(", ") || "None"}
    - Target Domains: ${studentDomains.join(", ") || "None"}
    - Experience Level: ${student?.experienceLevel || "None"}
    
    ${student?.resumeText ? `RESUME CONTEXT (EXTRACTED FROM STUDENT'S FILE):
    """
    ${student.resumeText.replace(/"/g, "'").substring(0, 5000)}
    """` : "NO RESUME UPLOADED YET."}
    
    Instructions:
    1. Provide a professional and encouraging response (max 4-5 sentences).
    2. Focus on the Indian tech ecosystem (MERN Stack, Data Science, etc.).
    3. Use realistic salary ranges for India (e.g., 4-12 LPA for freshers).
    4. Mention specific Indian job portals like Naukri, LinkedIn India, or Hired.
    5. CRITICAL: Use the "RESUME CONTEXT" provided above to answer. If the student asks "what projects are in my resume?" or "summarize my skills", you MUST answer based ONLY on the RESUME CONTEXT provided above.
    6. If the RESUME CONTEXT says "NO RESUME UPLOADED YET", advise the student to upload their resume in the AI Career Hub first.
    7. Always stay polite and career-focused.`;
    
    console.log(`[Chat Prompt] Using ${student?.resumeText ? "FULL RESUME" : "PROFILE ONLY"} for student ${student?.name}`);

    const aiResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (aiResponse.ok) {
      const aiData = await aiResponse.json() as any;
      const response = aiData.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
      
      // Add a hint if resume context was used
      const finalResponse = student?.resumeText 
        ? response 
        : response + "\n\n(Note: I'm answering based on your profile skills because no resume has been scanned yet.)";

      return res.json({ response: finalResponse });
    }

    throw new Error("AI API failed");
  } catch (error) {
    console.error("Chat Error:", error);
    return res.json({ response: "I'm having trouble connecting right now. But stay focused on your career goals!" });
  }
});

// Dedicated Resume Analysis Chat (New Request)
router.post("/resume-chat", async (req, res) => {
  const { message } = req.body;
  const studentId = req.body.studentId ? parseInt(req.body.studentId) : null;
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

  try {
    const [student] = studentId ? await db.select().from(studentsTable).where(eq(studentsTable.id, studentId)) : [null];
    
    if (!studentId) {
      return res.json({ response: "Debug Error: No Student ID was sent in the request." });
    }
    
    if (!student) {
      return res.json({ response: `Debug Error: Student with ID ${studentId} not found in database.` });
    }

    if (!student.resumeText || student.resumeText.trim().length === 0) {
      return res.json({ response: `I can see your profile (ID: ${studentId}), but your resume text is empty in my database. Please try uploading your resume again in the AI Career Hub.` });
    }

    if (!NVIDIA_API_KEY) {
      return res.json({ response: "AI Resume Analyzer is offline. Please check back later." });
    }

    const prompt = `You are an Advanced AI Resume Analyzer. Your ONLY job is to analyze the student's resume and answer questions about it.
    
    RESUME CONTEXT:
    """
    ${student.resumeText.replace(/"/g, "'").substring(0, 6000)}
    """
    
    Student Name: ${student.name}
    
    Instructions:
    1. Answer ONLY based on the provided RESUME CONTEXT.
    2. If the student asks something NOT in the resume, politely say: "I couldn't find that information in your current resume. Would you like me to suggest how to add it?"
    3. Be critical but constructive. Identify gaps, highlight strengths, and suggest better wording.
    4. Keep responses professional, technical, and concise.
    5. User Question: "${message}"`;

    const aiResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3, // Lower temperature for more factual analysis
      }),
    });

    if (aiResponse.ok) {
      const data = await aiResponse.json() as any;
      return res.json({ response: data.choices[0]?.message?.content || "Analysis failed." });
    }
    throw new Error("AI API failed");
  } catch (error) {
    console.error("Resume chat error:", error);
    return res.json({ response: "I'm having trouble analyzing your resume right now." });
  }
});

// AI Sentiment Analysis for Feedback
router.post("/analyze-sentiment", async (req, res) => {
  const { feedback, studentId } = req.body;
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

  try {
    let result;
    if (!NVIDIA_API_KEY) {
      result = { sentiment: "Positive", score: 85, emoji: "😊", summary: "Feedback received (Offline Mode)." };
    } else {
      const prompt = `Analyze the sentiment of this student feedback: "${feedback}". 
      Return ONLY a JSON object with: 
      1. "sentiment" (Positive, Negative, or Neutral)
      2. "score" (0-100)
      3. "emoji" (a relevant emoji)
      4. "summary" (1 sentence summary)`;

      const aiResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
        }),
      });

      const data = await aiResponse.json() as any;
      const content = data.choices[0].message.content;
      const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
      result = JSON.parse(jsonStr);
    }

    // Save to Database
    try {
      await db.insert(feedbackTable).values({
        studentId: studentId ? parseInt(studentId) : null,
        content: feedback,
        sentiment: result.sentiment,
        score: result.score,
        emoji: result.emoji,
        summary: result.summary
      });
      console.log("Feedback saved to database successfully.");
    } catch (dbErr) {
      console.error("Failed to save feedback to database:", dbErr);
    }

    return res.json(result);
  } catch (error) {
    console.error("Sentiment Error:", error);
    return res.json({ sentiment: "Neutral", score: 50, emoji: "😐", summary: "Processed with basic analysis." });
  }
});

// Advanced Roadmap Generator
router.post("/generate-roadmap", async (req, res) => {
  const { studentId, targetRole } = req.body;
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

  try {
    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));

    if (!NVIDIA_API_KEY) {
      return res.json({ 
        roadmap: [
          { week: 1, title: "Fundamentals", tasks: ["Review core concepts", "Set up environment"] },
          { week: 2, title: "Advanced Topics", tasks: ["Project building", "Deep dive into APIs"] },
          { week: 3, title: "Optimization", tasks: ["Performance tuning", "Testing"] },
          { week: 4, title: "Deployment", tasks: ["Cloud hosting", "Final review"] }
        ]
      });
    }

    let studentSkills: string[] = [];
    try {
      studentSkills = typeof student?.skills === 'string' ? JSON.parse(student.skills) : (student?.skills as string[] || []);
    } catch (e) { studentSkills = (student?.skills as string[] || []); }

    let studentDomains: string[] = [];
    try {
      studentDomains = typeof student?.domains === 'string' ? JSON.parse(student.domains) : (student?.domains as string[] || []);
    } catch (e) { studentDomains = (student?.domains as string[] || []); }

    const prompt = `Generate a high-precision, 4-week learning roadmap for a student to bridge the gap from their current skills to becoming a "${targetRole}".
    
    Current Profile:
    - Name: ${student?.name || "Student"}
    - Current Skills: ${studentSkills.join(", ") || "None"}
    - Target Domains: ${studentDomains.join(", ") || "None"}
    - Experience Level: ${student?.experienceLevel || "Beginner"}

    CRITICAL INSTRUCTION:
    1. DO NOT include skills the student ALREADY possesses in the roadmap.
    2. Focus ONLY on the missing technologies and advanced concepts needed for the "${targetRole}".
    3. The roadmap must be a sequential bridge starting from their current knowledge level.
    4. Tasks must be actionable and highly specific.

    Return ONLY a JSON array of 4 objects. Each object must have:
    - "week" (number 1-4)
    - "title" (string)
    - "tasks" (array of 3 specific strings)
    
    Format: [{ "week": 1, "title": "...", "tasks": ["...", "...", "..."] }, ...]`;

    const aiResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    });

    const data = await aiResponse.json() as any;
    const content = data.choices[0].message.content;
    const jsonStr = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
    const roadmap = JSON.parse(jsonStr);
    
    return res.json({ roadmap });
  } catch (error) {
    console.error("Roadmap Error:", error);
    return res.status(500).json({ error: "Failed to generate roadmap" });
  }
});

export default router;
