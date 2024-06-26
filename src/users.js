const argon = require("argon2");
const jwt = require("jsonwebtoken");
const db = require('./config/db.config');
const argon2 = require("argon2");

const login = async (req) => {
    const connection = await db.connectDB();
    const [rows] = await connection.execute(
        db.sql_queries.login,
        [req.email]
    );
    if (rows.length !== 0) {
        if (await argon.verify(rows[0].password, req.password)) {
            const _user = {id: rows[0].id, name: rows[0].name, email: rows[0].email};
            const token = jwt.sign(_user, process.env.JWT_SECRET_KEY);
            return {data: {token: `Bearer ${token}`, message: "Login Successful!"}, status: 200};
        } else {
            return {data: {message: "Incorrect Password!"}, status: 401};
        }
    }
    return {data: {message: "Incorrect Email Address!"}, status: 401};
};

const addStudent = async (req) => {
    const connection = await db.connectDB();
    const hash = await argon2.hash(req.password);

    await connection.beginTransaction();

    const [user] = await connection.execute(
        db.sql_queries.insert_user,
        [req.name, req.email, hash, db.user_types['student']]
    );
    if (user.affectedRows === 1) {
        let inputs = [user.insertId, req.phone, req.address, req.dob, req.license, req.license_expiry, req.school_work];
        let sql = db.sql_queries.student_details;

        if (req?.transmission) {
            sql = db.sql_queries.student_details_transmission;
            inputs.push(req.transmission);
        }

        const [user_details] = await connection.execute(
            sql, inputs
        );

        if (user_details.affectedRows === 1) {
            await connection.commit();
            return {data: {message: "Student insert successful!"}, status: 200};
        }
    }
    return {data: {message: "Incorrect Email Address!"}, status: 401};
};

const getUserDetails = async (req) => {
    const connection = await db.connectDB();
    let user_id = null;
    if (req.query.user) {
        user_id = req.query.user;
    } else {
        const header_token = req.headers.authorization;
        const token = header_token.split(' ');
        const decoded = jwt.verify(token[1], process.env.JWT_SECRET_KEY);
        user_id = decoded.id;
    }

    const [rows] = await connection.execute(
        db.sql_queries.get_user,
        [user_id]
    );

    if (rows.length) {
        return {data: {message: `User details for ${rows[0].name}!`, data: rows[0]}, status: 200};
    }
    return {data: {message: "User not found!"}, status: 400};
};

const listLessonsByStudent = async (student) => {
    const connection = await db.connectDB();
    const [is_student] = await connection.execute(db.sql_queries.is_student, [student]);
    if (!is_student.length)
        return {data: {message: 'Student not found!'}, status: 400};

    const [lessons] = await connection.execute(db.sql_queries.list_lessons_student, [student]);

    if (lessons.length) {
        lessons.forEach(_lesson => {
            _lesson.achieved = JSON.parse(_lesson.achieved);
            _lesson.competencies_assessed = JSON.parse(_lesson.competencies_assessed);
            _lesson.taught = JSON.parse(_lesson.taught);
        });

        return {data: {message: "List Successful!", data: lessons}, status: 200};
    }
};

const addLesson = async (req) => {
    const connection = await db.connectDB();

    await connection.beginTransaction();

    const [is_student] = await connection.execute(
        db.sql_queries.is_student,
        [req.student]
    );

    if (is_student.length) {
        req.competencies_assessed = JSON.stringify(req.competencies_assessed);
        req.achieved = JSON.stringify(req.achieved);
        req.taught = JSON.stringify(req.taught);

        const [lesson_add] = await connection.execute(
            db.sql_queries.add_lesson_for_student,
            [req.student, req.driver, req.taught, req.competencies_assessed, req.achieved, req.start_time, req.end_time, req.start_odo, req.end_odo, req.date_received, req.location, req.comments]
        );

        if (lesson_add.affectedRows > 0) {
            await connection.commit();
            return {data: {message: "Lesson has been added successfully!"}, status: 200};
        }

        return {data: {message: "Error"}, status: 400};
    } else {
        return {data: {message: "Student not found!"}, status: 500};
    }
    return {data: {message: "Incorrect Email Address!"}, status: 401};
};

module.exports = {login, addStudent, getUserDetails, addLesson, listLessonsByStudent};
