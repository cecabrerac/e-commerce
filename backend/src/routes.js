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
// Obtener carrito de un usuario
router.get("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT c.id, c.product_id, p.name, p.price, c.quantity
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo carrito:", err);
    res.status(500).json({ error: "Error obteniendo carrito" });
  }
});

// Agregar producto al carrito
router.post("/cart", async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [user_id, product_id, quantity]
    );

    // devolver carrito actualizado
    const result = await pool.query(
      `SELECT c.id, c.product_id, p.name, p.price, c.quantity
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error agregando producto:", err);
    res.status(500).json({ error: "Error agregando producto" });
  }
});

// Eliminar producto del carrito
router.delete("/cart/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    await pool.query(
      `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );

    // devolver carrito actualizado
    const result = await pool.query(
      `SELECT c.id, c.product_id, p.name, p.price, c.quantity
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error eliminando producto:", err);
    res.status(500).json({ error: "Error eliminando producto" });
  }
});

// Vaciar carrito
router.post("/cart/:userId/clear", async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);
    res.json([]); // carrito vacío
  } catch (err) {
    console.error("Error vaciando carrito:", err);
    res.status(500).json({ error: "Error vaciando carrito" });
  }
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
