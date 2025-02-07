import sql from "mssql"
import { DB_DATABASE, DB_PASSWORD, DB_PORT, DB_SERVER, DB_USER } from "../config.js";

export const dbSettings = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_SERVER,
  database: DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    port: Number(DB_PORT),
    requestTimeout: 60000
  }
}

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings)

    return pool
  } catch (error) {
    console.log(error);
  }
}

export { sql };