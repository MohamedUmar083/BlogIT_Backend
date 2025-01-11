import {
  createPost,
  deletePost,
  getPosts,
  getUserPost,
  searchPost,
  updatePost,
} from "../Controllers/postController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/create/:id", authMiddleware, createPost);
router.get("/getallpost", getPosts);
router.get("/getmypost/:id", authMiddleware, getUserPost);
router.get("/searchpost", searchPost);
router.put("/updatepost/:id", authMiddleware, updatePost);
router.delete("/deletepost/:id", authMiddleware, deletePost);

export default router;
