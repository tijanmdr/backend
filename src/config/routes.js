const express = require('express');
const db = require('./db.config.js');
const authMiddleware = require('./auth');
const users = require('../users');

const router = express.Router();

// Route to render a Pug template with data (replace with your logic)
router.get('/status', async (req, res) => {
    return res.json({message: "working!"});
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

        const result = await users.login(req.body);
        return res.status(result.status).json(result.data);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Error: ${err.message}`});
    }
});

router.get('/check_middleware', authMiddleware, async (req, res) => {
    return res.json({m: 1});
});

module.exports = {router};