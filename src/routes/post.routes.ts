import { Router } from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
} from "../controllers/post.controller.js";

const router = Router();

router.get("/", getAllPosts);
router.post("/", createPost);
router.get("/:id", getPostById);

export default router;
