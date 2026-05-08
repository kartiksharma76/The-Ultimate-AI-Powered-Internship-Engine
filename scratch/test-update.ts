import { db } from "../lib/db/src/index.ts";
import { studentsTable } from "../lib/db/src/schema/students.ts";
import { eq } from "drizzle-orm";

async function testUpdate() {
  const studentId = 1;
  const testText = "This is a test resume text to verify database connectivity and update functionality.";
  
  try {
    console.log(`Attempting to update student ${studentId}...`);
    await db.update(studentsTable)
      .set({ resumeText: testText })
      .where(eq(studentsTable.id, studentId));
      
    console.log("Update successful!");
    
    // Verify it was saved
    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
    console.log("Verified resume text:", student.resumeText);
  } catch (error) {
    console.error("Failed to update database:", error);
  }
  process.exit(0);
}

testUpdate();
