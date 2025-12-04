import mysql from 'mysql2/promise';

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'cinehub',
} = process.env;

let cachedConnection: mysql.Connection | null = null;

async function createConnection() {
  return mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });
}

export async function getDb() {
  if (cachedConnection) {
    try {
      await cachedConnection.ping();
      return cachedConnection;
    } catch (_) {
      cachedConnection = null;
    }
  }

  cachedConnection = await createConnection();
  return cachedConnection;
}

export async function query<T = unknown>(sql: string, params: any[] = []) {
  const conn = await getDb();
  const [rows] = await conn.execute(sql, params);
  return rows as T;
}
