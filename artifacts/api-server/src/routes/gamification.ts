import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { gamificationTable, studentsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

// Get gamification stats for a student
router.get("/gamification/:studentId", async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  try {
    let [stats] = await db.select().from(gamificationTable).where(eq(gamificationTable.studentId, studentId));
    
    if (!stats) {
      // Create initial stats if they don't exist
      const [insertResult] = await db.insert(gamificationTable).values({
        studentId,
        xpPoints: 0,
        level: 1,
        currentStreak: 0,
        highestStreak: 0,
        badges: []
      });
      [stats] = await db.select().from(gamificationTable).where(eq(gamificationTable.id, insertResult.insertId));
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gamification stats" });
  }
});

// Get global leaderboard
router.get("/leaderboard/global", async (req, res) => {
  try {
    const leaderboard = await db
      .select({
        studentId: studentsTable.id,
        name: studentsTable.name,
        avatarUrl: studentsTable.avatarUrl,
        xpPoints: gamificationTable.xpPoints,
        level: gamificationTable.level,
        badges: gamificationTable.badges
      })
      .from(gamificationTable)
      .innerJoin(studentsTable, eq(gamificationTable.studentId, studentsTable.id))
      .orderBy(desc(gamificationTable.xpPoints))
      .limit(50);
      
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// Add XP to a student (Internal/Admin endpoint conceptually, or called via other actions)
router.post("/gamification/:studentId/add-xp", async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const { amount, reason } = req.body;
  
  try {
    const [stats] = await db.select().from(gamificationTable).where(eq(gamificationTable.studentId, studentId));
    if (stats) {
      const newXp = stats.xpPoints + amount;
      const newLevel = Math.floor(newXp / 1000) + 1; // Simple leveling logic
      
      await db.update(gamificationTable)
        .set({ xpPoints: newXp, level: newLevel })
        .where(eq(gamificationTable.studentId, studentId));
        
      // Also update totalXp on student table
      await db.update(studentsTable).set({ totalXp: newXp }).where(eq(studentsTable.id, studentId));
      
      const [updated] = await db.select().from(gamificationTable).where(eq(gamificationTable.studentId, studentId));
      res.json(updated);
    } else {
      res.status(404).json({ error: "Student gamification record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add XP" });
  }
});

export default router;
