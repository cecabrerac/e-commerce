import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/", addToCart);
router.delete("/:userId/:productId", removeFromCart);
router.post("/:userId/clear", clearCart);

export default router;
