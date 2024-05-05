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

router.post('/add_student', authMiddleware, async (req, res) => {
    const fields = ['name', 'email', 'password', 'phone', 'address', 'license', 'dob', 'license_expiry', 'school_work'];
    let missing = false, missingItem = null;

    fields.map((field, key) => {
        if (!req?.body?.[field]) {
            missing = true;
            missingItem = key;
            return;
        }
    });

    if (missing) {
        return res.status(400).json({message: `${fields[missingItem]} required fields!`});
    }

    const result = await users.addStudent(req.body);
    return res.status(result.status).json(result.data);
});

router.get('/user_details', authMiddleware, async (req, res) => {
    const user_details = await users.getUserDetails(req);
    return res.status(user_details.status).json(user_details.data);
});

router.post('/lesson_add', authMiddleware, async (req, res) => {
    const fields = ['driver', 'student', 'date_received', 'start_odo', 'end_odo', 'taught', 'competencies_assessed', 'achieved', 'start_time', 'end_time', 'location', 'comments'];
    let missing = false, missingItem = null;

    fields.map((field, key) => {
        if (!req?.body?.[field]) {
            missing = true;
            missingItem = key;
            return;
        }
    });

    if (missing) {
        return res.status(400).json({message: `${fields[missingItem]} required fields!`});
    }
    return res.json({message: req.body});
});

module.exports = {router};