import { db, studentsTable } from "../lib/db/src/index";
import { desc } from "drizzle-orm";

async function check() {
  const latest = await db.select().from(studentsTable).orderBy(desc(studentsTable.createdAt)).limit(1);
  console.log("LATEST_STUDENT_DATA:");
  console.log(JSON.stringify(latest, null, 2));
  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
