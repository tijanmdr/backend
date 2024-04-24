const db = require("./db.config");
const argon2 = require("argon2");

seed();

async function seed() {
    const connection = await db.connectDB();
    const hash = await argon2.hash('password');

    try {
        await connection.beginTransaction();
        const [user] = await connection.execute(
            "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)",
            ['Tijan', 'tijanmdr@gmail.com', hash, db.user_types['instructor']]
        );

        if (user.affectedRows === 1) {
            const [user_details] = await connection.execute(
                "insert into user_details (user, phone, address, dob, license, license_expiry) values (?,?,?,?,?,?)",
                [user.insertId, '021031023', '1283909123', new Date('1994-1-2'), '23232323', new Date('2025-1-2')]
            );

            if (user_details.affectedRows === 1) {
                console.log('Database seed successful!');
                await connection.commit();
                process.exit(0);
            }
        }
    } catch (err) {
        await connection.rollback();
        console.error(`error: ${err.message}`);
        process.exit(0);
    }
}

