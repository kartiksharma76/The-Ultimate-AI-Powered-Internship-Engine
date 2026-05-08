import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { githubMetricsTable, studentsTable, gamificationTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// Connect and sync GitHub profile (Mock integration)
router.post("/github/sync/:studentId", async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const { githubUsername } = req.body;
  
  if (!githubUsername) {
    return res.status(400).json({ error: "GitHub username is required" });
  }

  try {
    // Sanitize username in case user pastes full URL (e.g. github.com/username)
    let cleanUsername = githubUsername.trim();
    if (cleanUsername.includes("github.com/")) {
      cleanUsername = cleanUsername.split("github.com/")[1].split("/")[0];
    }
    
    // Fetch real data from GitHub API
    let realRepos = 0;
    let followers = 0;
    let accountAgeYears = 0;
    
    try {
      const ghRes = await fetch(`https://api.github.com/users/${cleanUsername}`);
      if (ghRes.ok) {
        const ghData = await ghRes.json() as any;
        realRepos = ghData.public_repos || 0;
        followers = ghData.followers || 0;
        const createdAt = ghData.created_at ? new Date(ghData.created_at) : new Date();
        accountAgeYears = (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365);
      }
    } catch (e) {
      console.error("Github API Error:", e);
    }

    // STRICT evaluation based purely on real data
    const codingActivityScore = Math.min((realRepos * 3) + (accountAgeYears * 5), 100);
    const developerCredibilityScore = Math.min((followers * 10) + (realRepos * 2), 100);

    const metricsData = {
      studentId,
      githubUsername: cleanUsername,
      totalRepos: realRepos,
      totalCommits: Math.floor(codingActivityScore * 5), // Estimate based on strict activity
      totalPRs: Math.floor(realRepos * 1.5),
      topLanguages: [{ language: "TypeScript", percentage: 60 }, { language: "Python", percentage: 40 }],
      codingActivityScore,
      developerCredibilityScore,
      lastSyncedAt: new Date()
    };

    let [existing] = await db.select().from(githubMetricsTable).where(eq(githubMetricsTable.studentId, studentId));
    
    if (existing) {
      await db.update(githubMetricsTable).set(metricsData).where(eq(githubMetricsTable.studentId, studentId));
    } else {
      await db.insert(githubMetricsTable).values(metricsData as any);
    }

    // Award Gamification XP based on GitHub stats
    const earnedXp = Math.floor(codingActivityScore * 10 + developerCredibilityScore * 15 + realRepos * 50);
    let [gamification] = await db.select().from(gamificationTable).where(eq(gamificationTable.studentId, studentId));
    
    if (gamification) {
      const newXp = gamification.xpPoints + earnedXp;
      const newLevel = Math.floor(newXp / 1000) + 1;
      await db.update(gamificationTable)
        .set({ xpPoints: newXp, level: newLevel, currentStreak: Math.max(gamification.currentStreak || 0, 1), highestStreak: Math.max(gamification.highestStreak || 0, 1) })
        .where(eq(gamificationTable.studentId, studentId));
    } else {
      const newLevel = Math.floor(earnedXp / 1000) + 1;
      await db.insert(gamificationTable).values({
        studentId,
        xpPoints: earnedXp,
        level: newLevel,
        currentStreak: 1,
        highestStreak: 1,
        badges: ["GitHub Connected"]
      });
    }

    const [updated] = await db.select().from(githubMetricsTable).where(eq(githubMetricsTable.studentId, studentId));
    res.json(updated);
  } catch (error) {
    console.error("GitHub Sync Error:", error);
    res.status(500).json({ error: "Failed to sync GitHub profile" });
  }
});

// Get GitHub metrics for a student
router.get("/github/:studentId", async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  try {
    const [metrics] = await db.select().from(githubMetricsTable).where(eq(githubMetricsTable.studentId, studentId));
    if (!metrics) {
      return res.status(404).json({ error: "GitHub metrics not found" });
    }
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GitHub metrics" });
  }
});

// Unlink GitHub account
router.delete("/github/:studentId", async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  try {
    await db.delete(githubMetricsTable).where(eq(githubMetricsTable.studentId, studentId));
    res.json({ success: true, message: "GitHub account unlinked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to unlink GitHub account" });
  }
});

export default router;
