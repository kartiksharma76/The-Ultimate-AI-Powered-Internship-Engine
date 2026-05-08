import { mysqlTable, text, int, timestamp, varchar, json, float } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sql } from "drizzle-orm";
import { studentsTable } from "./students";

export const githubMetricsTable = mysqlTable("github_metrics", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").references(() => studentsTable.id).notNull(),
  githubUsername: varchar("github_username", { length: 255 }).notNull(),
  totalRepos: int("total_repos").notNull().default(0),
  totalCommits: int("total_commits").notNull().default(0),
  totalPRs: int("total_prs").notNull().default(0),
  topLanguages: json("top_languages").$type<{ language: string; percentage: number }[]>().notNull().default([]),
  codingActivityScore: float("coding_activity_score").notNull().default(0),
  developerCredibilityScore: float("developer_credibility_score").notNull().default(0),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertGithubMetricsSchema = createInsertSchema(githubMetricsTable).omit({ id: true, createdAt: true });
export type InsertGithubMetrics = z.infer<typeof insertGithubMetricsSchema>;
export type GithubMetrics = typeof githubMetricsTable.$inferSelect;
