import { db } from "../lib/db/src/index.ts";
import { studentsTable } from "../lib/db/src/schema/students.ts";

async function listStudents() {
  const students = await db.select().from(studentsTable);
  console.log(`Total Students: ${students.length}`);
  students.forEach(s => {
    console.log(`ID: ${s.id}, Name: ${s.name}, Email: ${s.email}, GoogleID: ${s.googleId}, HasResume: ${!!s.resumeText}`);
  });
  process.exit(0);
}

listStudents().catch(err => {
  console.error(err);
  process.exit(1);
});
