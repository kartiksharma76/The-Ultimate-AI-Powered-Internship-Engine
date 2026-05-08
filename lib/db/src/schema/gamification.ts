import { mysqlTable, text, int, timestamp, varchar, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sql } from "drizzle-orm";
import { studentsTable } from "./students";

export const gamificationTable = mysqlTable("gamification", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").references(() => studentsTable.id).notNull(),
  xpPoints: int("xp_points").notNull().default(0),
  level: int("level").notNull().default(1),
  currentStreak: int("current_streak").notNull().default(0),
  highestStreak: int("highest_streak").notNull().default(0),
  badges: json("badges").$type<{ name: string; earnedAt: string }[]>().notNull().default([]),
  lastActivityAt: timestamp("last_activity_at"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
});

export const insertGamificationSchema = createInsertSchema(gamificationTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGamification = z.infer<typeof insertGamificationSchema>;
export type Gamification = typeof gamificationTable.$inferSelect;
