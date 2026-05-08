const mysql = require('mysql2/promise');

async function testUpdate() {
  try {
    const connection = await mysql.createConnection("mysql://root:Kartik@2005@localhost:3306/internship_db");
    const testText = "This is a test resume text to verify database connectivity and update functionality.";
    
    console.log("Attempting to update student 1 using raw SQL...");
    const [result] = await connection.execute('UPDATE students SET resume_text = ? WHERE id = 1', [testText]);
    
    console.log("Update result:", result);
    
    // Verify it was saved
    const [rows] = await connection.execute('SELECT id, name, resume_text FROM students WHERE id = 1');
    console.log("Verified resume text:", rows[0].resume_text);
    
    await connection.end();
  } catch (err) {
    console.error("Error:", err);
  }
}

testUpdate();
