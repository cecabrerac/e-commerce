import express from "express";
import {
  processCheckout,
  getCheckoutSummary,
  validateCoupon,
} from "../controllers/checkoutController.js";

const router = express.Router();

/**
 * GET /checkout/:userId/summary
 * Obtener resumen del checkout (subtotal, impuestos, envío, total)
 */
router.get("/:userId/summary", getCheckoutSummary);

/**
 * POST /checkout
 * Procesar el checkout y crear la orden
 */
router.post("/", processCheckout);

/**
 * POST /checkout/validate-coupon
 * Validar un cupón de descuento
 */
router.post("/validate-coupon", validateCoupon);

export default router;
