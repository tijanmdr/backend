const express = require('express');
require('dotenv').config();
const app = express();
const mysql = require('mysql2/promise');

// Replace with your actual database credentials
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME
};

// Connect to MySQL database (optional: move to separate file)
async function connectDB() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    process.exit(1);
  }
}

// Set Pug as the templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Route to render a Pug template with data (replace with your logic)
app.get('/', async (req, res) => {
  res.render('index');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});