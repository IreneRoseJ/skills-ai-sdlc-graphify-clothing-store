import express from "express";
import {
    getStripeConfig,
    createCheckoutSession,
    fulfillCheckout,
} from "../controller/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/config", getStripeConfig);
router.post("/create-checkout-session", protect, createCheckoutSession);
router.post("/fulfill", protect, fulfillCheckout);

export default router;
