import mysql from "mysql2/promise";

const {
  DB_HOST = "127.0.0.1",
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_NAME = "cinehub",
  DB_PORT = "3306",
} = process.env;

/**
 * Pool kết nối MySQL cơ bản cho Next.js (app router).
 * Dùng `await db.query('SELECT ...')` trong server action / route handler.
 */
export const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(DB_PORT),
  connectionLimit: 10,
});

export default db;
