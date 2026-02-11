import postgres from "postgres";

const sql = postgres({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5435,
    database: process.env.DB_NAME || "classroom_booking",
    username: process.env.DB_USER || "admin",
    password: process.env.DB_PASS || "admin123",
});

export default sql;
