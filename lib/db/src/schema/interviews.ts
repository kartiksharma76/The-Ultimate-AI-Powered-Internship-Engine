import { mysqlTable, text, int, timestamp, varchar, json, float } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sql } from "drizzle-orm";
import { studentsTable } from "./students";
import { internshipsTable } from "./internships";

export const interviewsTable = mysqlTable("interviews", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").references(() => studentsTable.id).notNull(),
  internshipId: int("internship_id").references(() => internshipsTable.id), 
  overallScore: float("overall_score").notNull().default(0),
  confidenceScore: float("confidence_score").notNull().default(0),
  communicationScore: float("communication_score").notNull().default(0),
  technicalScore: float("technical_score").notNull().default(0),
  strengths: json("strengths").$type<string[]>().notNull().default([]),
  weaknesses: json("weaknesses").$type<string[]>().notNull().default([]),
  improvementSuggestions: text("improvement_suggestions"),
  transcript: text("transcript"), // Full interview text
  videoUrl: text("video_url"), // Optional URL if recorded
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertInterviewSchema = createInsertSchema(interviewsTable).omit({ id: true, createdAt: true });
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Interview = typeof interviewsTable.$inferSelect;
