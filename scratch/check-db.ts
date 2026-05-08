import { db } from "../lib/db/src/index.ts";
import { studentsTable } from "../lib/db/src/schema/students.ts";
import { eq } from "drizzle-orm";

async function checkStudent() {
  const id = 1;
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, id));
  
  if (!student) {
    console.log(`Student ${id} not found.`);
  } else {
    console.log(`Student ${id} found:`);
    console.log(`Name: ${student.name}`);
    console.log(`Has Resume Text: ${!!student.resumeText}`);
    console.log(`Resume Text Length: ${student.resumeText?.length || 0}`);
    if (student.resumeText) {
      console.log(`Resume Snippet: ${student.resumeText.substring(0, 100)}...`);
    }
  }
  process.exit(0);
}

checkStudent().catch(err => {
  console.error(err);
  process.exit(1);
});
