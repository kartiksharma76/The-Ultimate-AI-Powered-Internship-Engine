import { Router } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

// Get all notifications for a student
router.get("/:studentId", async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  try {
    const notifications = await db.select()
      .from(notificationsTable)
      .where(eq(notificationsTable.studentId, studentId))
      .orderBy(desc(notificationsTable.createdAt));
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark notification as read
router.patch("/:id/read", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.update(notificationsTable)
      .set({ isRead: true })
      .where(eq(notificationsTable.id, id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notification" });
  }
});

// Create a new notification (simulation)
router.post("/simulate", async (req, res) => {
  const { studentId, type, title, message } = req.body;
  try {
    await db.insert(notificationsTable).values({
      studentId,
      type,
      title,
      message,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to create notification" });
  }
});

export default router;
