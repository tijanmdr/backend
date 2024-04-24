const db = require("./db.config");
const argon2 = require("argon2");

seed();

async function seed() {
    const connection = await db.connectDB();
    const hash = await argon2.hash('password');

    try {
        const [result] = await connection.execute(
            "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)",
            ['Tijan', 'tijanmdr@gmail.com', hash, db.user_types['instructor']]
        );

        if (result.affectedRows === 1) {
            console.log('Database seed successful!');
            process.exit(0);
        }
    } catch (err) {
        console.error(`error: ${err.message}`);
        process.exit(0);
    }
}

