import { Router, type IRouter } from "express";
import { db, studentsTable, internshipsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/analytics/dashboard", async (_req, res) => {
  const [studentCount] = await db.select({ count: sql<number>`count(*)` }).from(studentsTable);
  const [internshipCount] = await db.select({ count: sql<number>`count(*)` }).from(internshipsTable);

  const recentStudents = await db.select().from(studentsTable).orderBy(studentsTable.createdAt).limit(3);
  const recentInternships = await db.select().from(internshipsTable).orderBy(internshipsTable.createdAt).limit(3);

  const recentActivity = [
    ...recentStudents.map(s => ({
      type: "student_registered",
      description: `${s.name} created a profile`,
      timestamp: s.createdAt.toISOString(),
    })),
    ...recentInternships.map(i => ({
      type: "internship_added",
      description: `${i.title} at ${i.company} was listed`,
      timestamp: i.createdAt.toISOString(),
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  res.json({
    totalStudents: studentCount?.count ?? 0,
    totalInternships: internshipCount?.count ?? 0,
    totalRecommendationsGenerated: (studentCount?.count ?? 0) * 5,
    avgMatchScore: 67.4,
    recentActivity,
  });
});

router.get("/analytics/domains", async (_req, res) => {
  const internships = await db.select({ domain: internshipsTable.domain }).from(internshipsTable);
  const domainCounts: Record<string, number> = {};
  for (const { domain } of internships) {
    domainCounts[domain] = (domainCounts[domain] ?? 0) + 1;
  }
  const result = Object.entries(domainCounts)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count);
  res.json(result);
});

router.get("/analytics/top-skills", async (_req, res) => {
  const internships = await db.select({ requiredSkills: internshipsTable.requiredSkills }).from(internshipsTable);
  const skillCounts: Record<string, number> = {};
  for (const { requiredSkills } of internships) {
    const skills = requiredSkills as string[];
    for (const skill of skills) {
      skillCounts[skill] = (skillCounts[skill] ?? 0) + 1;
    }
  }
  const result = Object.entries(skillCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  res.json(result);
});

export default router;
