const mysql = require('mysql2/promise');

async function check() {
  const connection = await mysql.createConnection("mysql://root:Kartik@2005@localhost:3306/internship_db");
  const [rows] = await connection.execute('SELECT id, name, resume_text FROM students WHERE id = 1');
  console.log(JSON.stringify(rows, null, 2));
  await connection.end();
}

check().catch(console.error);
