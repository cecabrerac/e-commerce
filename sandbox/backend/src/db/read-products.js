import { pool } from "./db.js";

async function getProducts() {
  const result = await pool.query("SELECT * FROM products");
  console.log(result.rows);
  await pool.end();
}

getProducts().catch(console.error);
