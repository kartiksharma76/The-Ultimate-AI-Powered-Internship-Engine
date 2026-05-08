const mysql = require('mysql2/promise');

async function cleanup() {
  const url = "mysql://root:Kartik@2005@localhost:3306/internship_db";
  console.log("Starting deep cleanup...");
  
  let connection;
  try {
    connection = await mysql.createConnection(url);
    
    // 1. Get the IDs of the first 20 internships
    const [rows] = await connection.execute('SELECT id FROM internships ORDER BY id ASC LIMIT 20');
    const ids = rows.map(r => r.id);
    
    if (ids.length === 0) {
      console.log("No internships found to cleanup.");
      return;
    }
    
    console.log(`Keeping ${ids.length} internships:`, ids);
    
    // 2. Delete all internships NOT in that list
    const [result] = await connection.execute(`DELETE FROM internships WHERE id NOT IN (${ids.join(',')})`);
    
    console.log(`Cleanup success! Deleted ${result.affectedRows} internships.`);
  } catch (error) {
    console.error("Cleanup failed:", error);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

cleanup();
