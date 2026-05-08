import { mysqlTable, text, int, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sql } from "drizzle-orm";
import { studentsTable } from "./students";

export const applicationsTable = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").references(() => studentsTable.id).notNull(),
  company: text("company").notNull(),
  title: text("title").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("applied"), // applied, selected, pending
  shortlistedByAi: int("shortlisted_by_ai").notNull().default(0),
  fraudFlag: int("fraud_flag").notNull().default(0),
  atsScore: int("ats_score").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({ id: true, createdAt: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
