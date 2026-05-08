import { mysqlTable, text, int, timestamp, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sql } from "drizzle-orm";

export const internshipsTable = mysqlTable("internships", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  domain: text("domain").notNull(),
  location: text("location").notNull(),
  requiredSkills: json("required_skills").$type<string[]>().notNull().default([]),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  stipend: text("stipend").notNull(),
  experienceRange: text("experience_range").notNull().default("0-1 Yrs"),
  salaryRange: text("salary_range").notNull().default("Not disclosed"),
  companyLogo: text("company_logo").notNull().default(""),
  applicationDeadline: text("application_deadline").notNull(),
  popularity: int("popularity").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertInternshipSchema = createInsertSchema(internshipsTable).omit({ id: true, createdAt: true });
export type InsertInternship = z.infer<typeof insertInternshipSchema>;
export type Internship = typeof internshipsTable.$inferSelect;
