import { Router, type IRouter } from "express";
import { db, studentsTable, internshipsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateStudentBody,
  UpdateStudentBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/students", async (req, res) => {
  const students = await db.select().from(studentsTable).orderBy(studentsTable.createdAt);
  res.json(students.map(s => ({ ...s, skills: s.skills ?? [], domains: s.domains ?? [] })));
});

router.post("/students", async (req, res) => {
  const body = CreateStudentBody.parse(req.body);
  const [result] = await db.insert(studentsTable).values({
    name: body.name,
    email: body.email,
    skills: body.skills,
    domains: body.domains,
    experienceLevel: body.experienceLevel,
    location: body.location,
    bio: body.bio ?? null,
    careerGoals: body.careerGoals ?? null,
    education: (body as any).education ?? [],
    projects: (body as any).projects ?? [],
    experience: (body as any).experience ?? [],
  });
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, result.insertId));
  res.status(201).json(student);
});

router.get("/students/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, id));
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  res.json(student);
});

router.put("/students/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = UpdateStudentBody.parse(req.body);
  const updateData: Partial<typeof studentsTable.$inferInsert> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.email !== undefined) updateData.email = body.email;
  if (body.skills !== undefined) updateData.skills = body.skills;
  if (body.domains !== undefined) updateData.domains = body.domains;
  if (body.experienceLevel !== undefined) updateData.experienceLevel = body.experienceLevel;
  if (body.location !== undefined) updateData.location = body.location;
  if (body.bio !== undefined) updateData.bio = body.bio;
  if (body.careerGoals !== undefined) updateData.careerGoals = body.careerGoals;
  if ((body as any).education !== undefined) updateData.education = (body as any).education;
  if ((body as any).projects !== undefined) updateData.projects = (body as any).projects;
  if ((body as any).experience !== undefined) updateData.experience = (body as any).experience;
  
  await db.update(studentsTable).set(updateData).where(eq(studentsTable.id, id));
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, id));
  
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  res.json(student);
});

router.get("/students/:id/verify-for-job", async (req, res) => {
  const studentId = parseInt(req.params.id);
  const jobId = req.query.jobId as string;
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

  try {
    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
    if (!student) return res.status(404).json({ error: "Student not found" });

    // For simplicity in this demo, if jobId is > 20000 it's AI generated, otherwise check local
    let jobTitle = "Software Developer";
    if (jobId && parseInt(jobId) < 20000) {
      const [localJob] = await db.select().from(internshipsTable).where(eq(internshipsTable.id, parseInt(jobId)));
      if (localJob) jobTitle = localJob.title;
    }

    if (NVIDIA_API_KEY) {
      const prompt = `Analyze this student's profile for a "${jobTitle}" role:
      Profile:
      - Skills: ${student.skills?.join(", ") || "None"}
      - Bio: ${student.bio || "None"}
      - Experience Level: ${student.experienceLevel || "None"}
      
      Identify 3 specific missing pieces of information or skills that would make this profile perfect for this role.
      Return ONLY a JSON array of 3 strings (recommendations). Example: ["Add a portfolio link", "Mention React Hooks experience", "Highlight your problem-solving skills"].`;

      const aiResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
        }),
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json() as any;
        const aiText = data.choices[0]?.message?.content?.trim() ?? "[]";
        const jsonMatch = aiText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const recommendations = JSON.parse(jsonMatch[0]);
          return res.json({ recommendations });
        }
      }
    }
    
    // Fallback recommendations
    return res.json({ recommendations: ["Add a detailed project link", "Update your skill set", "Expand your professional bio"] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Verification failed" });
  }
});

router.get("/students/:id/interview-prep", async (req, res) => {
  const studentId = parseInt(req.params.id);
  const jobId = req.query.jobId as string;
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

  try {
    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
    if (!student) return res.status(404).json({ error: "Student not found" });

    let jobTitle = "Software Developer";
    if (jobId && parseInt(jobId) < 20000) {
      const [localJob] = await db.select().from(internshipsTable).where(eq(internshipsTable.id, parseInt(jobId)));
      if (localJob) jobTitle = localJob.title;
    }

    if (NVIDIA_API_KEY) {
      const prompt = `Generate 5 technical interview questions for a "${jobTitle}" internship role.
      The candidate has these skills: ${student.skills?.join(", ") || "None"}.
      Return ONLY a JSON array of 5 strings (the questions).`;

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
        const data = await aiResponse.json() as any;
        const aiText = data.choices[0]?.message?.content?.trim() ?? "[]";
        const jsonMatch = aiText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          return res.json({ questions });
        }
      }
    }
    return res.json({ questions: ["Tell us about your most challenging project.", "How do you handle technical debt?", "Explain a complex concept simply.", "What is your favorite programming language?", "Where do you see yourself in 5 years?"] });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate prep questions" });
  }
});

export default router;
