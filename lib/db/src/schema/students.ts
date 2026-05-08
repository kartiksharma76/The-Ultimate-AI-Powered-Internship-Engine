import { mysqlTable, text, int, timestamp, json, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sql } from "drizzle-orm";

export const studentsTable = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  skills: json("skills").$type<string[]>().notNull().default([]),
  domains: json("domains").$type<string[]>().notNull().default([]),
  experienceLevel: text("experience_level").notNull().default("beginner"),
  location: text("location").notNull(),
  bio: text("bio"),
  careerGoals: text("career_goals"),
  googleId: varchar("google_id", { length: 255 }).unique(),
  avatarUrl: text("avatar_url"),
  subscriptionStatus: varchar("subscription_status", { length: 50 }).notNull().default("free"),
  isPremium: int("is_premium").notNull().default(0), // 0 for false, 1 for true
  resumeText: text("resume_text"),
  password: text("password"),
  otp: text("otp"),
  mobile: text("mobile"),
  education: json("education").$type<{ school: string; degree: string; year: string }[]>().notNull().default([]),
  projects: json("projects").$type<{ title: string; description: string; link?: string }[]>().notNull().default([]),
  experience: json("experience").$type<{ company: string; role: string; duration: string }[]>().notNull().default([]),
  totalXp: int("total_xp").notNull().default(0),
  rank: text("rank").notNull().default("Novice"),
  languagePreference: text("language_preference").notNull().default("en"),
  aiScore: int("ai_score").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({ id: true, createdAt: true });
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
