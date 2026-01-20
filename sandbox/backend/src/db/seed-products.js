import { pool } from "./db.js";

async function insertProduct() {
  await pool.query(
    "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3)",
    ["Laptop", 1200.5, 10],
  );

  console.log("Producto insertado");
  await pool.end();
}

insertProduct().catch(console.error);
