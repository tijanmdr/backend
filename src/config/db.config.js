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

const user_types = {
    instructor: 0, student: 1
};

const car_transmission = {
    0: "Auto", 1: "Manual"
};

const car_rego = [
    'YDD77D', 'YRRTDD'
];

const lessons = {
    1: 'Steering wheel',
    2:'balance of car',
    3:'side lights',
    4:'speed limits',
    5:'head checks'
};

const sql_queries = {
    'login': 'select * from users where email=?',
    'get_user': 'select u.id, u.name, u.email, ud.* from users u inner join user_details ud on u.id=ud.user where u.id=?',
    'get_all_students': `select u.id, u.name, u.email, ud.* from users u inner join user_details ud on u.id=ud.user where u.type=${user_types['student']}`,
    'insert_user': 'INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)',
    'student_details': "insert into user_details (user, phone, address, dob, license, license_expiry, school_work) values (?,?,?,?,?,?,?)",
    'student_details_transmission': "insert into user_details (user, phone, address, dob, license, license_expiry, school_work, transmission) values (?,?,?,?,?,?,?,?)",
    'is_student': `select id from users where id=? and type=${user_types['student']}`,
    'add_lesson_for_student': 'insert into lesson_received (student, driver, taught, competencies_assessed, achieved, start_time, end_time, start_odo, end_odo, date_received, location, comments)  values (?,?,?,?,?,?,?,?,?,?,?,?)',
    'list_lessons_student': 'select * from lesson_received where student=?'
}

module.exports = {connectDB, user_types, car_transmission, car_rego, sql_queries, lessons};
