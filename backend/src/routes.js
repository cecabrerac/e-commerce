import express from "express";
import { pool } from "./db.js";

const router = express.Router();

// --- Productos ---
router.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
});

// --- Usuarios ---
router.get("/users", async (req, res) => {
  const result = await pool.query(
    "SELECT id, name, email, created_at FROM users"
  );
  res.json(result.rows);
});

router.post("/users", async (req, res) => {
  const { name, email, password_hash } = req.body;
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [name, email, password_hash]
  );
  res.json(result.rows[0]);
});

// --- Carrito ---
router.get("/cart/:userId", async (req, res) => {
  const { userId } = req.params;
  const result = await pool.query(
    `SELECT c.id, p.name, p.price, c.quantity
     FROM cart_items c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = $1`,
    [userId]
  );
  res.json(result.rows);
});

router.post("/cart", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  const result = await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
     RETURNING *`,
    [user_id, product_id, quantity]
  );
  res.json(result.rows[0]);
});

// --- Órdenes ---
router.get("/orders", async (req, res) => {
  const result = await pool.query("SELECT * FROM orders");
  res.json(result.rows);
});

router.post("/orders", async (req, res) => {
  const { user_id, items } = req.body;
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const orderResult = await pool.query(
    "INSERT INTO orders (user_id, total, status) VALUES ($1, $2, 'pending') RETURNING *",
    [user_id, total]
  );
  const order = orderResult.rows[0];

  for (const item of items) {
    await pool.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
      [order.id, item.product_id, item.quantity, item.price]
    );
  }

  res.json(order);
});

export default router;
