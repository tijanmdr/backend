const argon = require("argon2");
const jwt = require("jsonwebtoken");
const db = require('./config/db.config');

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

module.exports = {login};
