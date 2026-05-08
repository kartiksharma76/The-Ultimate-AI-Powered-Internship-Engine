import { db, feedbackTable } from "@workspace/db";

async function checkFeedback() {
  console.log("Checking feedback table...");
  try {
    const feedback = await db.select().from(feedbackTable);
    console.log(`Current feedback count: ${feedback.length}`);
    if (feedback.length > 0) {
      console.log("Last feedback:", feedback[feedback.length - 1]);
    } else {
      console.log("Table is empty (this is expected if you haven't submitted anything yet).");
    }
  } catch (err) {
    console.error("Error checking feedback table:", err);
  } finally {
    process.exit();
  }
}

checkFeedback();
