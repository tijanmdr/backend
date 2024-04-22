const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const db = require('./config/db.config.js');

// Connect to MySQL database (optional: move to separate file)
async function connectDB() {
    try {
        const connection = await mysql.createConnection(db);
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

app.get('/db_seed', async (req, res) => {
    const argon2 = require('argon2');
    const connection = await connectDB();

    try {
        const hash = await argon2.hash('password');
        const [result] = await connection.execute(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          ['Tijan', 'tijanmdr@gmail.com', hash]
        );
        return res.json({'message': 'Successfull'})
    } catch (err) {
        return res.json({'message': err.message})
    }
});

app.get('/check', async (req, res) => {
    const argon = require('argon2');
    const connection = await connectDB();

    const [rows] = await connection.execute(
        'select * from users where email=?',
        ['tijanmdr@gmail.com']
    );
    return res.json(rows);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
