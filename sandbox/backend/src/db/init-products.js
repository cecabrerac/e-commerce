import { pool } from "./db.js";

async function createProductsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      stock INT NOT NULL
    );
  `);

  console.log("Tabla products creada");
  await pool.end();
}

createProductsTable().catch(console.error);
