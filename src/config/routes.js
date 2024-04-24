const express = require('express');
const authMiddleware = require('./auth');
const users = require('../users');

const router = express.Router();

router.get('/status', async (req, res) => {
    return res.json({message: "working!"});
});

router.post('/login', async (req, res) => {
    try {
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

module.exports = {router};