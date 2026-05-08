import { mysqlTable, text, int, timestamp, varchar, json, float } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sql } from "drizzle-orm";
import { studentsTable } from "./students";
import { internshipsTable } from "./internships";

export const assessmentsTable = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").references(() => studentsTable.id).notNull(),
  internshipId: int("internship_id").references(() => internshipsTable.id), // Nullable for general practice tests
  type: varchar("type", { length: 50 }).notNull(), // mcq, coding, combined
  difficulty: varchar("difficulty", { length: 50 }).notNull().default("adaptive"),
  totalScore: float("total_score").notNull().default(0),
  codingAccuracy: float("coding_accuracy").notNull().default(0),
  timeTakenMinutes: int("time_taken_minutes").notNull().default(0),
  fraudFlag: int("fraud_flag").notNull().default(0), // 0: clear, 1: suspicious, 2: confirmed fraud
  fraudDetails: json("fraud_details").$type<{ browserSwitches: number; copyPastes: number; faceNotDetected: boolean }>(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertAssessmentSchema = createInsertSchema(assessmentsTable).omit({ id: true, createdAt: true });
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessmentsTable.$inferSelect;
