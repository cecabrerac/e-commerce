import { pool } from "../db.js";

// --- Checkout ---

export const getCheckoutSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID es requerido" });
    }

    // Obtener items del carrito
    const cartResult = await pool.query(
      `SELECT c.id, c.product_id, p.name, p.price, c.quantity
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [user_id],
    );

    const cartItems = cartResult.rows;

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    // Calcular totales
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    res.json({
      subtotal,
      itemCount: cartItems.length,
      items: cartItems,
    });
  } catch (err) {
    console.error("Error obteniendo resumen:", err);
    res.status(500).json({ error: "Error obteniendo resumen del checkout" });
  }
};

export const processCheckout = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Obtener los productos del carrito
    const cartResult = await pool.query(
      `SELECT c.product_id, c.quantity, p.price
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId],
    );

    // 2. Calcular el total
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // 3. Crear la orden
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, status)
       VALUES ($1, $2, 'pending')
       RETURNING id`,
      [userId, total],
    );
    const orderId = orderResult.rows[0].id;

    // 4. Insertar los ítems de la orden
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price],
      );
    }

    // 5. Vaciar el carrito
    await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);

    // 6. Devolver la orden creada
    res.json({
      orderId,
      userId,
      total,
      status: "pending",
      items: cartItems,
    });
  } catch (err) {
    console.error("Error en checkout:", err);
    res.status(500).json({ error: "Error procesando checkout" });
  } finally {
    client.release();
  }
};
