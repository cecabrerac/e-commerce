import { pool } from "./db.js";

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Conectado a PostgreSQL:", result.rows[0]);
  } catch (error) {
    console.error("Error de conexión:", error);
  } finally {
    await pool.end();
  }
}

testConnection();
