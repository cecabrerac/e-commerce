import { pool } from "../db.js";

/**
 * Validar que el carrito tenga items
 */
const validateCart = (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    throw new Error("El carrito está vacío");
  }
};

/**
 * Validar que haya stock disponible para los productos
 */
const validateStock = async (cartItems) => {
  for (const item of cartItems) {
    const result = await pool.query(
      "SELECT stock FROM products WHERE id = $1",
      [item.product_id]
    );

    if (result.rows.length === 0) {
      throw new Error(`Producto con ID ${item.product_id} no existe`);
    }

    if (result.rows[0].stock < item.quantity) {
      throw new Error(
        `Stock insuficiente para ${item.name}. Disponible: ${result.rows[0].stock}`
      );
    }
  }
};

/**
 * Procesar el checkout - crear orden y actualizar inventario
 */
export const processCheckout = async (req, res) => {
  const client = await pool.connect();

  try {
    const { user_id, cartItems, shippingAddress, paymentMethod } = req.body;

    // Validaciones
    if (!user_id) {
      return res.status(400).json({ error: "User ID es requerido" });
    }

    validateCart(cartItems);
    await validateStock(cartItems);

    // Iniciar transacción
    await client.query("BEGIN");

    // Calcular total
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Crear orden
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, status) 
       VALUES ($1, $2, $3) 
       RETURNING id, user_id, total, status, created_at`,
      [user_id, total, "pending"]
    );

    const order = orderResult.rows[0];

    // Insertar items de la orden
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );

      // Actualizar stock del producto
      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // Limpiar carrito del usuario
    await client.query("DELETE FROM cart_items WHERE user_id = $1", [user_id]);

    // Confirmar transacción
    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Orden creada exitosamente",
      order: {
        id: order.id,
        user_id: order.user_id,
        total: order.total,
        status: order.status,
        created_at: order.created_at,
        items: cartItems,
        shippingAddress,
        paymentMethod,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error en checkout:", err);

    res.status(400).json({
      success: false,
      error: err.message || "Error procesando la orden",
    });
  } finally {
    client.release();
  }
};

/**
 * Obtener resumen del checkout antes de procesar
 */
export const getCheckoutSummary = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: "User ID es requerido" });
    }

    // Obtener items del carrito
    const cartResult = await pool.query(
      `SELECT c.id, c.product_id, p.name, p.price, c.quantity
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [user_id]
    );

    const cartItems = cartResult.rows;

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    // Calcular totales
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Aquí puedes agregar cálculos de impuestos y envío
    const tax = subtotal * 0.08; // 8% de impuesto (ajusta según necesites)
    const shipping = 10000; // Costo fijo de envío (ajusta según necesites)
    const total = subtotal + tax + shipping;

    res.json({
      subtotal,
      tax,
      shipping,
      total,
      itemCount: cartItems.length,
      items: cartItems,
    });
  } catch (err) {
    console.error("Error obteniendo resumen:", err);
    res.status(500).json({ error: "Error obteniendo resumen del checkout" });
  }
};

/**
 * Validar cupón de descuento (opcional)
 */
export const validateCoupon = async (req, res) => {
  try {
    const { couponCode, totalAmount } = req.body;

    // Aquí puedes implementar la lógica de validación de cupones
    // Por ahora es un ejemplo básico
    const validCoupons = {
      SAVE10: 0.1,
      SAVE20: 0.2,
    };

    if (validCoupons[couponCode]) {
      const discount = totalAmount * validCoupons[couponCode];
      res.json({
        valid: true,
        discountPercent: validCoupons[couponCode] * 100,
        discountAmount: discount,
      });
    } else {
      res.status(400).json({ valid: false, error: "Cupón inválido" });
    }
  } catch (err) {
    console.error("Error validando cupón:", err);
    res.status(500).json({ error: "Error validando cupón" });
  }
};
