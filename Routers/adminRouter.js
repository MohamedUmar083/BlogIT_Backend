import express from "express";
import {
  deletePost,
  deleteUser,
  getAllPost,
  getAllUser,
} from "../Controllers/adminController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/getalluser", authMiddleware, getAllUser);
router.get("/getallpost", authMiddleware, getAllPost);
router.delete("/deleteuser/:id", authMiddleware, deleteUser);
router.delete("/deletepost/:id", authMiddleware, deletePost);

export default router;
