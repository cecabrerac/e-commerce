import { pool } from "../db.js";

export const getOrders = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo órdenes:", err);
    res.status(500).json({ error: "Error obteniendo órdenes" });
  }
};

export const createOrder = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("Error creando orden:", err);
    res.status(500).json({ error: "Error creando orden" });
  }
};
