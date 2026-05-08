import { mysqlTable, text, int, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sql } from "drizzle-orm";

export const feedbackTable = mysqlTable("feedback", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id"), // Optional: can be null for anonymous feedback
  content: text("content").notNull(),
  sentiment: text("sentiment").notNull(), // Positive, Negative, Neutral
  score: int("score").notNull(),
  emoji: text("emoji").notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertFeedbackSchema = createInsertSchema(feedbackTable).omit({ id: true, createdAt: true });
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedbackTable.$inferSelect;
