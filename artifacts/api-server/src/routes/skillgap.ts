import { Router, type IRouter } from "express";
import { db, studentsTable, internshipsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

const router: IRouter = Router();

const DOMAIN_SKILL_MAP: Record<string, string[]> = {
  "Web Development": ["JavaScript", "React", "Node.js", "CSS", "HTML", "REST APIs", "Git"],
  "AI/ML": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Statistics", "NumPy", "Pandas"],
  "Data Science": ["Python", "SQL", "Statistics", "Data Visualization", "Pandas", "Tableau", "R"],
  "Mobile Development": ["React Native", "Swift", "Kotlin", "Flutter", "Android", "iOS"],
  "Cloud/DevOps": ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Azure"],
  "Cybersecurity": ["Network Security", "Ethical Hacking", "SIEM", "Cryptography", "Penetration Testing"],
  "Blockchain": ["Solidity", "Ethereum", "Smart Contracts", "Web3.js", "DeFi"],
  "Game Development": ["Unity", "C#", "Unreal Engine", "C++", "3D Modeling", "Game Design"],
};

router.get("/skillgap/:studentId", async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
  console.log(`[SKILL GAP] Checking for Student ID: ${studentId}`);
  if (!student) {
    console.error(`[SKILL GAP] Student NOT FOUND: ${studentId}`);
    res.status(404).json({ error: "Student not found" });
    return;
  }
  console.log(`[SKILL GAP] Skills to analyze: ${JSON.stringify(student.skills)}`);

  const studentSkills = (student.skills as string[]).map(s => s.toLowerCase());
  const studentDomains = (student.domains as string[]);

  const targetRoles = studentDomains.length > 0 ? studentDomains : ["Web Development"];

  const allRequiredSkills = new Set<string>();
  for (const domain of targetRoles) {
    const skills = DOMAIN_SKILL_MAP[domain] ?? [];
    skills.forEach(s => allRequiredSkills.add(s));
  }

  const internships = await db.select().from(internshipsTable);
  for (const internship of internships) {
    if (targetRoles.some(d => d.toLowerCase() === internship.domain.toLowerCase())) {
      const skills = internship.requiredSkills as string[];
      skills.forEach(s => allRequiredSkills.add(s));
    }
  }

  const skillGaps = Array.from(allRequiredSkills)
    .filter(skill => !studentSkills.some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s)))
    .map(skill => {
      const priority: "high" | "medium" | "low" =
        ["Python", "JavaScript", "React", "SQL", "Node.js", "Java", "Git"].some(s => s.toLowerCase() === skill.toLowerCase())
          ? "high"
          : ["Docker", "AWS", "TensorFlow", "Machine Learning"].some(s => s.toLowerCase() === skill.toLowerCase())
          ? "medium"
          : "low";

      return {
        skill,
        priority,
        resources: getResources(skill),
      };
    })
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });

  const recommendations = [
    `Focus on ${skillGaps.filter(s => s.priority === "high").slice(0, 2).map(s => s.skill).join(" and ")} as your top priorities`,
    `Build 2-3 portfolio projects showcasing your ${studentDomains[0] ?? "target domain"} skills`,
    "Contribute to open-source projects to gain practical experience",
    "Complete online certifications to validate your skill development",
    `Network with professionals in ${studentDomains[0] ?? "your target"} communities`,
  ];

  res.json({
    studentId,
    currentSkills: student.skills as string[],
    targetRoles,
    skillGaps: skillGaps.slice(0, 10),
    recommendations,
  });
});

function getResources(skill: string): string[] {
  const resourceMap: Record<string, string[]> = {
    python: ["Python.org Official Docs", "Codecademy Python Course", "CS50P - Python"],
    javascript: ["MDN Web Docs", "JavaScript.info", "Eloquent JavaScript"],
    react: ["React Official Docs", "Scrimba React Course", "Full Stack Open"],
    sql: ["SQLZoo", "Mode Analytics SQL Tutorial", "PostgreSQL Tutorial"],
    "node.js": ["Node.js Docs", "The Odin Project", "NodeSchool"],
    tensorflow: ["TensorFlow Tutorials", "Coursera Deep Learning", "Fast.ai"],
    docker: ["Docker Official Docs", "Play With Docker", "Docker Mastery Udemy"],
    aws: ["AWS Free Tier", "AWS Skill Builder", "Cloud Practitioner Essentials"],
    git: ["Pro Git Book", "GitHub Learning Lab", "Atlassian Git Tutorial"],
  };
  const key = skill.toLowerCase();
  return resourceMap[key] ?? [`Search "${skill} tutorial" on Coursera`, `"${skill} for beginners" on YouTube`, "Check official documentation"];
}

export default router;
