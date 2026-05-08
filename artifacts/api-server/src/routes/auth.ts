import { Router } from "express";
import passport from "passport";
import { db } from "@workspace/db";
import { studentsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { sendOTP } from "../lib/mailer";

const router = Router();

// Initiate Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback (Legacy /api path)
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
    successRedirect: `${process.env.FRONTEND_URL}/`,
  })
);

// Google OAuth callback (User specified path)
// Note: This needs to be handled at the root level if not mounted at /
router.get(
  "/login/oauth2/code/google",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
    successRedirect: `${process.env.FRONTEND_URL}/`,
  })
);

// Get current user session
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Email & Password Registration
router.post("/register", async (req, res) => {
  const { email, password, name, mobile } = req.body;
  try {
    // Check if user exists
    let [user] = await db.select().from(studentsTable).where(eq(studentsTable.email, email));
    
    if (user) {
      await db.update(studentsTable).set({ password, name, mobile }).where(eq(studentsTable.id, user.id));
      user = { ...user, password, name, mobile };
    } else {
      const [inserted] = await db.insert(studentsTable).values({
        email,
        password,
        name: name || email.split("@")[0],
        mobile: mobile || "",
        location: "Remote",
        skills: [],
        domains: [],
      });
      [user] = await db.select().from(studentsTable).where(eq(studentsTable.id, inserted.insertId));
    }

    // Log in the user immediately
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed after registration" });
      return res.json({ success: true, user });
    });
  } catch (error: any) {
    console.error("Registration DB error:", error);
    res.status(500).json({ error: `Registration failed: ${error.message}` });
  }
});

// Standard Login
router.post("/login", async (req, res) => {
  const { email, mobile, password } = req.body;
  try {
    let user;
    if (email) {
      [user] = await db.select().from(studentsTable).where(eq(studentsTable.email, email));
    } else if (mobile) {
      [user] = await db.select().from(studentsTable).where(eq(studentsTable.mobile, mobile));
    }
    
    if (user && user.password === password) {
      req.login(user, (err) => {
        if (err) return res.status(500).json({ error: "Login failed" });
        return res.json({ success: true, user });
      });
    } else {
      res.status(401).json({ error: "Invalid credentials or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true });
  });
});

export default router;
