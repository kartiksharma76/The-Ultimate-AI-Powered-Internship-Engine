import { Router, type IRouter } from "express";
import { db, internshipsTable } from "@workspace/db";
import { eq, ilike, or, sql, notInArray } from "drizzle-orm";
import {
  CreateInternshipBody,
  ListInternshipsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/internships", async (req, res) => {
  const query = req.query;
  let internships = await db.select().from(internshipsTable).orderBy(internshipsTable.popularity).limit(20);

  if (query.domain && query.domain !== "All") {
    internships = internships.filter(i => i.domain.toLowerCase() === (query.domain as string).toLowerCase());
  }
  if (query.location) {
    internships = internships.filter(i =>
      i.location.toLowerCase().includes((query.location as string).toLowerCase()) ||
      (query.location as string).toLowerCase() === "remote"
    );
  }
  if (query.search) {
    const s = (query.search as string).toLowerCase();
    internships = internships.filter(i =>
      i.title.toLowerCase().includes(s) ||
      i.company.toLowerCase().includes(s) ||
      i.description.toLowerCase().includes(s)
    );
  }
  if (query.experience) {
    internships = internships.filter(i => i.experienceRange.includes(query.experience as string));
  }
  if (query.salary) {
    internships = internships.filter(i => i.salaryRange.includes(query.salary as string));
  }

  res.json(internships.map(i => ({ ...i, requiredSkills: i.requiredSkills ?? [] })));
});

router.get("/internships/global-search", async (req, res) => {
  const query = (req.query.q as string || "").trim();
  const location = (req.query.location as string || "").trim();
  const experience = (req.query.experience as string || "").trim();
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
  const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

  console.log(`[Global Search] Query: "${query}", Location: "${location}", Exp: "${experience}"`);

  const results: any[] = [];

  // 1. Get AI results if key exists
  if (NVIDIA_API_KEY && (query.length > 0 || location.length > 0 || experience.length > 0)) {
    try {
      const roleContext = query ? `focused on "${query}"` : "for technology and software engineering internships";
      const locationContext = location ? `specifically located in or offering remote work for candidates near "${location}"` : "available globally or remotely";
      const experienceContext = experience ? `tailored for "${experience}" experience level (students/juniors)` : "suitable for entry-level applicants";
      
      const prompt = `Generate exactly 8 diverse, high-quality internship opportunities.
      CONTEXT:
      - Primary Interest: ${roleContext}
      - Target Location: ${locationContext}
      - Experience Requirement: ${experienceContext}
      
      OUTPUT REQUIREMENTS:
      - Return ONLY a valid JSON array of objects.
      - Each object MUST include: title, company, domain, location (must include "${location || "Global"}"), experienceRange (must match "${experience || "0-1 Yrs"}"), requiredSkills (array of strings), description, duration, stipend, salaryRange, applicationDeadline (YYYY-MM-DD).
      - Ensure the "location" field is realistic for ${location || "a global search"}.
      - The "experienceRange" field MUST strictly be "${experience || "0-1 Yrs"}".
      - DO NOT include any markdown code blocks or extra text.`;

      const aiResponse = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct", // Lighter model to avoid 429 errors
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2500,
          temperature: 0.7,
        }),
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json() as any;
        const aiText = data.choices[0]?.message?.content?.trim() ?? "[]";
        
        // Robust JSON extraction
        const jsonMatch = aiText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const aiJobs = JSON.parse(jsonMatch[0]);
          const processedAiJobs = aiJobs.map((job: any, index: number) => ({
            ...job,
            id: 20000 + index + Math.floor(Math.random() * 5000),
            popularity: Math.floor(Math.random() * 30) + 70,
            isAiGenerated: true,
            companyLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.company)}&backgroundColor=003366,006699,336699`,
            createdAt: new Date().toISOString()
          }));
          results.push(...processedAiJobs);
          console.log(`[Global Search] Successfully generated ${results.length} AI jobs.`);
        } else {
          console.warn("[Global Search] AI returned non-JSON content:", aiText.substring(0, 100));
        }
      } else {
        const errorText = await aiResponse.text();
        console.error(`[Global Search] NVIDIA API Error (${aiResponse.status}):`, errorText);
      }
    } catch (error) {
      console.error("[Global Search] Internal AI processing error:", error);
    }
  }

  // 2. Fallback to local if AI failed or returned nothing
  if (results.length === 0) {
    console.log("[Global Search] Falling back to local database search.");
    let localInternships = await db.select().from(internshipsTable);
    if (query || location || experience) {
      const s = query.toLowerCase();
      const loc = location.toLowerCase();
      const exp = experience.toLowerCase();
      localInternships = localInternships.filter(i => {
        const matchesQuery = !s || i.title.toLowerCase().includes(s) || (i.requiredSkills && i.requiredSkills.some(sk => sk.toLowerCase().includes(s)));
        const matchesLocation = !loc || i.location.toLowerCase().includes(loc) || loc.includes(i.location.toLowerCase());
        const matchesExp = !exp || i.experienceRange.toLowerCase().includes(exp) || exp.includes(i.experienceRange.toLowerCase());
        
        // More fuzzy: match either query OR location/exp if provided
        return matchesQuery && (matchesLocation || !location) && (matchesExp || !experience);
      });
    }
    results.push(...localInternships.map(i => ({ 
      ...i, 
      requiredSkills: i.requiredSkills ?? [],
      isAiGenerated: false,
      companyLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(i.company)}&backgroundColor=003366,006699,336699`,
    })));
  }

  res.json(results);
});

router.post("/internships", async (req, res) => {
  const body = CreateInternshipBody.parse(req.body);
  const [result] = await db.insert(internshipsTable).values({
    title: body.title,
    company: body.company,
    domain: body.domain,
    location: body.location,
    requiredSkills: body.requiredSkills,
    description: body.description,
    duration: body.duration,
    stipend: body.stipend,
    applicationDeadline: body.applicationDeadline,
    popularity: body.popularity ?? 0,
  });
  const [internship] = await db.select().from(internshipsTable).where(eq(internshipsTable.id, result.insertId));
  res.status(201).json(internship);
});

router.get("/internships/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [internship] = await db.select().from(internshipsTable).where(eq(internshipsTable.id, id));
  if (!internship) {
    res.status(404).json({ error: "Internship not found" });
    return;
  }
  res.json({ ...internship, requiredSkills: internship.requiredSkills ?? [] });
});

router.put("/internships/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = CreateInternshipBody.parse(req.body);
  await db.update(internshipsTable).set({
    title: body.title,
    company: body.company,
    domain: body.domain,
    location: body.location,
    requiredSkills: body.requiredSkills,
    description: body.description,
    duration: body.duration,
    stipend: body.stipend,
    applicationDeadline: body.applicationDeadline,
    popularity: body.popularity ?? 0,
  }).where(eq(internshipsTable.id, id));
  
  const [internship] = await db.select().from(internshipsTable).where(eq(internshipsTable.id, id));
  
  if (!internship) {
    res.status(404).json({ error: "Internship not found" });
    return;
  }
  res.json(internship);
});

router.delete("/internships/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(internshipsTable).where(eq(internshipsTable.id, id));
  res.status(204).send();
});


export default router;
