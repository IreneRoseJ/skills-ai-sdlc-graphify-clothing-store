import express from "express";
import {
  getProducts,
  getProductById,
  createProductReview,
} from "../controller/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts);
router.route("/:id/reviews").post(protect, createProductReview);
router.route("/:id").get(getProductById);

export default router;
