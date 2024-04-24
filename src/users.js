const argon = require("argon2");
const jwt = require("jsonwebtoken");
const db = require('./config/db.config');
const argon2 = require("argon2");

const login = async (req) => {
    const connection = await db.connectDB();
    const [rows] = await connection.execute(
        'select * from users where email=?',
        [req.email]
    );
    if (rows.length !== 0) {
        if (await argon.verify(rows[0].password, req.password)) {
            const token = jwt.sign(rows[0], process.env.JWT_SECRET_KEY);
            return {data: {token: `Bearer ${token}`, message: "Login Successful!"}, status: 200};
        } else {
            return {data : {message: "Incorrect Password!"}, status: 401};
        }
    }
    return {data : {message: "Incorrect Email Address!"}, status: 401};
};

const addStudent = async (req) => {
    const connection = await db.connectDB();
    const hash = await argon2.hash(req.password);

    await connection.beginTransaction();

    const [user] = await connection.execute(
        "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)",
        [req.name, req.email, hash, db.user_types['student']]
    );
    if (user.affectedRows === 1){
        const [user_details] = await connection.execute(
            "insert into user_details (user, phone, address, dob, license, license_expiry, school_work) values (?,?,?,?,?,?,?)",
            [user.insertId, req.phone, req.address, req.dob, req.license, req.license_expiry, req.school_work]
        );

        if (user_details.affectedRows === 1) {
            await connection.commit();
            return {data : {message: "Student insert successful!"}, status: 200};
        }
    }
    return {data : {message: "Incorrect Email Address!"}, status: 401};
};

module.exports = {login,addStudent};
