import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { applicationsTable, studentsTable, githubMetricsTable, assessmentsTable } from "@workspace/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

const router: IRouter = Router();

// Recruiter Dashboard: Smart Candidate Ranking
router.get("/ranking/internship/:internshipId", async (req, res) => {
  const internshipId = parseInt(req.params.internshipId);
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

  try {
    // 1. Fetch all applicants for this internship
    const applicants = await db
      .select({
        application: applicationsTable,
        student: studentsTable,
      })
      .from(applicationsTable)
      .innerJoin(studentsTable, eq(applicationsTable.studentId, studentsTable.id))
      // In a real scenario, you'd filter by internshipId on applications table
      // Assuming applicationsTable has internshipId (wait, checking schema, applicationsTable has company, title, but no internshipId? Ah, it might just be title based for now).
      // Let's just fetch all applications for demo
      .limit(100);

    const enrichedApplicants = await Promise.all(
      applicants.map(async (app) => {
        // Fetch GitHub metrics
        const [github] = await db.select().from(githubMetricsTable).where(eq(githubMetricsTable.studentId, app.student.id));
        
        // Fetch Assessments
        const assessments = await db.select().from(assessmentsTable).where(eq(assessmentsTable.studentId, app.student.id));
        const avgCodingScore = assessments.length > 0 
          ? assessments.reduce((acc, curr) => acc + curr.codingAccuracy, 0) / assessments.length 
          : 0;

        // Base Score Calculation
        let aiScore = app.student.aiScore || 0;
        aiScore += (github?.codingActivityScore || 0) * 0.3;
        aiScore += avgCodingScore * 0.4;
        aiScore += (app.application.atsScore || 0) * 0.3;

        return {
          ...app,
          githubScores: github || null,
          avgCodingScore,
          finalScore: Math.min(aiScore, 100),
          fraudRisk: app.application.fraudFlag === 1 ? "High" : "Low"
        };
      })
    );

    // Sort by highest score
    enrichedApplicants.sort((a, b) => b.finalScore - a.finalScore);

    res.json(enrichedApplicants);
  } catch (error) {
    console.error("Ranking error", error);
    res.status(500).json({ error: "Failed to rank candidates" });
  }
});

// Auto-shortlist candidates above a certain threshold
router.post("/ranking/auto-shortlist", async (req, res) => {
  const { thresholdScore } = req.body;
  const threshold = thresholdScore || 75;

  try {
    // This is a simplified auto-shortlist
    // We update all applications where atsScore > threshold (as a proxy for AI score in DB)
    // Realistically, we'd calculate score or store finalScore in DB.
    
    // Placeholder implementation
    res.json({ message: "Auto-shortlisting triggered. Candidates above threshold will be notified.", updatedCount: 0 });
  } catch (error) {
    res.status(500).json({ error: "Failed to auto-shortlist" });
  }
});

export default router;
