import express from "express";
import {
  googleAuth,
  loginUser,
  registerUser,
} from "../Controllers/authController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

export default router;
