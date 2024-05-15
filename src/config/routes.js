const express = require('express');
const authMiddleware = require('./auth');
const users = require('../users');
const {lessons} = require('./db.config');

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
    const requestBody = req.body;
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

    // for taught lessons
    requestBody.taught = validateArrays(requestBody.taught, 'Taught');

    if (requestBody.taught?.status) {
        return res.status(requestBody.taught?.status).json({message: requestBody.taught?.message});
    }

    // for achieved lessons
    requestBody.achieved = validateArrays(requestBody.achieved, 'Achieved');

    if (requestBody.achieved?.status) {
        return res.status(requestBody.achieved?.status).json({message: requestBody.achieved?.message});
    }

    // for competencies_assessed lessons
    requestBody.competencies_assessed = validateArrays(requestBody.competencies_assessed, 'Competencies assessed');

    if (requestBody.competencies_assessed?.status) {
        return res.status(requestBody.competencies_assessed?.status).json({message: requestBody.competencies_assessed?.message});
    }

    const result = await users.addLesson(requestBody);
    return res.status(result.status).json(result.data);
});

router.get('/list_lessons/:student', authMiddleware, async (req, res) => {
    return res.json({message: req.params.student});
});

router.patch('/update_lesson/:id', authMiddleware, async (req, res) => {
    return res.json({message: req.params.id});
});

function validateArrays(arrayList, type) {
    let _notInt = false, _notIncluded = false;
    arrayList.forEach((_res, key) => {
        let _parsed = parseInt(_res);
        if (isNaN(_parsed)) {
            _notInt = true;
        }

        if (!lessons[_parsed]) {
            _notIncluded = true;
        }
        arrayList[key] = _parsed;
    });
    if (_notInt === true)
        return {message: `${type} lesson should be a valid integer!`, status: 400};

    if (_notIncluded === true)
        return {message: `${type} lesson was not found in the list of lessons!`, status: 500};

    return arrayList;
}

module.exports = {router};