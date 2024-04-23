const express = require('express');
const db = require('./db.config.js');
const jwt = require("jsonwebtoken");
const authMiddleware = require('./auth');

const router = express.Router();

// Route to render a Pug template with data (replace with your logic)
router.get('/status', async (req, res) => {
    return res.json({message: "working!"})
});

router.get('/db_seed', async (req, res) => {
    const argon2 = require('argon2');
    const connection = await db.connectDB();

    try {
        const hash = await argon2.hash('password');
        const [result] = await connection.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            ['Tijan', 'tijanmdr@gmail.com', hash]
        );
        return res.json({'message': 'Successful!'});
    } catch (err) {
        return res.json({'message': err.message});
    }
});

router.post('/login', async (req, res) => {
    try {
        const argon = require('argon2');
        const connection = await db.connectDB();
        if (!req?.body?.email) {
            return res.status(400).json({message: "Email address is required!"});
        }
        if (!req?.body?.password) {
            return res.status(400).json({message: "Password is required!"});
        }

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

router.get('/check_middleware', authMiddleware, async (req, res) => {
    return res.json({m:1})
});

module.exports = {router}