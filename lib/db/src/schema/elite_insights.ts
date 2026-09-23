import { mysqlTable, text, int, timestamp, varchar, float } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sql } from "drizzle-orm";
import { studentsTable } from "./students";

export const visaPredictionsTable = mysqlTable("visa_predictions", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").references(() => studentsTable.id).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  chance: float("chance").notNull(),
  status: varchar("status", { length: 100 }).notNull(),
  insights: text("insights"), // JSON stringified array
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const mentorshipBookingsTable = mysqlTable("mentorship_bookings", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").references(() => studentsTable.id).notNull(),
  mentorId: int("mentor_id").notNull(),
  mentorName: varchar("mentor_name", { length: 255 }).notNull(),
  mentorRole: varchar("mentor_role", { length: 255 }).notNull(),
  sessionDate: timestamp("session_date"),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertVisaPredictionSchema = createInsertSchema(visaPredictionsTable).omit({ id: true, createdAt: true });
export type InsertVisaPrediction = z.infer<typeof insertVisaPredictionSchema>;

export const insertMentorshipBookingSchema = createInsertSchema(mentorshipBookingsTable).omit({ id: true, createdAt: true });
export type InsertMentorshipBooking = z.infer<typeof insertMentorshipBookingSchema>;
