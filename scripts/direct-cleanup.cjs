const mysql = require('mysql2/promise');

async function cleanup() {
  const connection = await mysql.createConnection("mysql://root:Kartik@2005@localhost:3306/internship_db");
  console.log("Connected to DB");
  
  try {
    // Get top 20 IDs
    const [rows] = await connection.execute('SELECT id FROM internships LIMIT 20');
    const ids = rows.map(r => r.id);
    
    if (ids.length === 0) {
      console.log("No internships to cleanup");
      process.exit(0);
    }
    
    console.log("Keeping IDs:", ids);
    
    const [result] = await connection.execute(`DELETE FROM internships WHERE id NOT IN (${ids.join(',')})`);
    console.log(`Deleted ${result.affectedRows} internships.`);
    
    process.exit(0);
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
}

cleanup();
