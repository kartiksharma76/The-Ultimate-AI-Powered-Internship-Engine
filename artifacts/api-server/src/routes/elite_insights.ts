import { Router, type IRouter } from "express";
import { db, visaPredictionsTable, mentorshipBookingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

// Visa Intelligence Routes
router.get("/visa-predictions/:studentId", async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const predictions = await db.select()
    .from(visaPredictionsTable)
    .where(eq(visaPredictionsTable.studentId, studentId))
    .orderBy(desc(visaPredictionsTable.createdAt));
  res.json(predictions.map(p => ({ ...p, insights: p.insights ? JSON.parse(p.insights) : [] })));
});

router.post("/visa-predictions", async (req, res) => {
  const { studentId, country, chance, status, insights } = req.body;
  const [result] = await db.insert(visaPredictionsTable).values({
    studentId,
    country,
    chance,
    status,
    insights: JSON.stringify(insights)
  });
  res.status(201).json({ id: result.insertId });
});

// Mentorship Booking Routes
router.get("/mentorship-bookings/:studentId", async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const bookings = await db.select()
    .from(mentorshipBookingsTable)
    .where(eq(mentorshipBookingsTable.studentId, studentId))
    .orderBy(desc(mentorshipBookingsTable.createdAt));
  res.json(bookings);
});

router.post("/mentorship-bookings", async (req, res) => {
  const { studentId, mentorId, mentorName, mentorRole, sessionDate } = req.body;
  const [result] = await db.insert(mentorshipBookingsTable).values({
    studentId,
    mentorId,
    mentorName,
    mentorRole,
    sessionDate: sessionDate ? new Date(sessionDate) : null,
    status: "pending"
  });
  res.status(201).json({ id: result.insertId });
});

export default router;
