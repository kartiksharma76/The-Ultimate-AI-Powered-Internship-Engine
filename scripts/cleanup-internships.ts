import { db, internshipsTable } from "../lib/db/src/index";
import { sql } from "drizzle-orm";

async function cleanup() {
  console.log("Starting internship cleanup...");
  try {
    // Get the IDs of the first 20 internships
    const top20 = await db.select({ id: internshipsTable.id })
      .from(internshipsTable)
      .limit(20);
    
    const top20Ids = top20.map(i => i.id);

    if (top20Ids.length === 0) {
      console.log("No internships found.");
      process.exit(0);
    }

    // Delete everything except these 20 IDs
    // Since Drizzle/MySQL might not support "NOT IN" directly with an array in some versions easily, 
    // we use a raw SQL approach if needed, or simple filtering.
    
    const result = await db.execute(sql`DELETE FROM internships WHERE id NOT IN (${sql.join(top20Ids, sql`, `)})`);
    
    console.log("Cleanup completed! Kept only the top 20 internships.");
    process.exit(0);
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
}

cleanup();
