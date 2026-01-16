import express from "express";
import {
  processCheckout,
  getCheckoutSummary,
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

export default router;
