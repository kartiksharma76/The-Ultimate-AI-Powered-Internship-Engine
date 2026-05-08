import { mysqlTable, serial, varchar, text, timestamp, boolean, int } from "drizzle-orm/mysql-core";
import { studentsTable } from "./students";

export const notificationsTable = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  studentId: int("student_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'match', 'application', 'system'
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
