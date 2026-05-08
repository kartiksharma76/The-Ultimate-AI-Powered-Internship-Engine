import { Router } from "express";
import { db, applicationsTable, studentsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { sendApplicationEmail } from "../lib/email";
import { logger } from "../lib/logger";

const router = Router();

router.post("/submit", async (req, res) => {
  const { email, company, title, smtpUser, smtpPass, token } = req.body;

  if (!email || !company || !title) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  logger.info({ email, company }, "Processing application submission");

  try {
    // 1. Fetch student info for personalization
    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.email, email));
    const studentName = student?.name || "Applicant";
    const studentId = student?.id;

    // 2. Trigger email sending
    const result = await sendApplicationEmail(email, company, title, studentName, smtpUser, smtpPass, token);

    // 3. Record the application in the database if student exists
    if (studentId) {
      await db.insert(applicationsTable).values({
        studentId,
        company,
        title,
        status: "applied",
      });
    }

    res.json({ 
      success: result.success, 
      message: result.success ? "Application transmitted and recorded" : "Email failed to transmit, but record saved",
      emailSent: result.success,
      previewUrl: result.previewUrl 
    });
  } catch (error) {
    logger.error({ error }, "Error recording application");
    res.status(500).json({ error: "Failed to process application" });
  }
});

router.get("/student/:studentId", async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  
  if (isNaN(studentId)) {
    res.status(400).json({ error: "Invalid student ID" });
    return;
  }

  try {
    const applications = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.studentId, studentId))
      .orderBy(desc(applicationsTable.createdAt));
      
    res.json(applications);
  } catch (error) {
    logger.error({ error }, "Error fetching applications");
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

export default router;
