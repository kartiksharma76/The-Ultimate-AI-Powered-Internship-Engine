const mysql = require('mysql2/promise');

async function clearResume() {
  try {
    const connection = await mysql.createConnection("mysql://root:Kartik@2005@localhost:3306/internship_db");
    
    console.log("Clearing fake resume from student 1...");
    await connection.execute('UPDATE students SET resume_text = NULL WHERE id = 1');
    
    console.log("Done.");
    await connection.end();
  } catch (err) {
    console.error("Error:", err);
  }
}

clearResume();
