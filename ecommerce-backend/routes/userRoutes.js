import express from "express";
import { authUser, registerUser, logoutUser, getAddress, addAddress, deleteAddress } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.post("/logout", logoutUser);
router.get("/logout", logoutUser);
router.route("/address").get(protect, getAddress).post(protect, addAddress);
router.route("/address/:addressId").delete(protect, deleteAddress);

export default router;
