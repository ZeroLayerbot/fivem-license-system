import mysql from "mysql2/promise"

const dbConfig = {
  host: "127.0.0.1",
  port: 3306,
  user: "lic",
  password: "YOURPASSWORD",
  database: "lic",
  charset: "utf8mb4",
}
let connection: mysql.Connection | null = null

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig)
  }
  return connection
}

export async function query(sql: string, params?: any[]) {
  const conn = await getConnection()
  const [results] = await conn.execute(sql, params)
  return results
}
