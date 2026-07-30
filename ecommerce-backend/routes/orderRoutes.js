import express from "express";
import {
  getOrderById,
  getOrders,
  getMyOrders,
} from "../controller/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getOrders);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);

export default router;
