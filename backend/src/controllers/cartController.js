import { pool } from "../db.js";

export const getCart = async (req, res) => {
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
};

export const addToCart = async (req, res) => {
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
};

export const removeFromCart = async (req, res) => {
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
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);
    res.json([]);
  } catch (err) {
    console.error("Error vaciando carrito:", err);
    res.status(500).json({ error: "Error vaciando carrito" });
  }
};
