const express = require('express');
const mysql = require('mysql2/promise');
const db = require('./config/db.config.js');
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
        return res.json({'message': 'Successfull'});
    } catch (err) {
        return res.json({'message': err.message});
    }
});

app.post('/login', async (req, res) => {
    try {
        const argon = require('argon2');
        const connection = await connectDB();
        console.log(req.body);
        if (!req?.body?.email) {
            return res.status(400).json({message: "Email address is required!"});
        }
        if (!req?.body?.password) {
            return res.status(400).json({message: "Password is required!"});
        }
        console.log(req.body.email);


        const [rows] = await connection.execute(
            'select * from users where email=?',
            [req.body.email]
        );
        if (rows.length !== 0) {
            if (await argon.verify(rows[0].password, req.body.password)) {
                const token = jwt.sign(rows[0], process.env.JWT_SECRET_KEY);
                return res.json({token: token, message: "Login Successful!"});
            } else {
                return res.status(401).json({message: "Incorrect Password!"});
            }
        }
        return res.status(401).json({message: "Incorrect Email Address!"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Error: ${err.message}`});
    }

});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
