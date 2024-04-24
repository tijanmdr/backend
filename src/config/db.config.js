require("dotenv").config();
const mysql = require('mysql2/promise');

const db = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
};

// Connect to MySQL database (optional: move to separate file)
async function connectDB() {
  try {
    return await mysql.createConnection(db);
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    process.exit(1);
  }
}

module.exports = {connectDB}