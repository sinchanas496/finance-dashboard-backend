const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // default XAMPP password is empty
  database: 'finance_dashboard'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('MySQL Connected...');
  }
});

module.exports = db;