import { Router } from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
} from "../controllers/post.controller.js";

const router = Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Obtiene todos los posts
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Post"
 */
router.get("/", getAllPosts);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Crea un nuevo post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Post"
 *     responses:
 *       201:
 *         description: Post creado
 */
router.post("/", createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Obtiene un post por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 */
router.get("/:id", getPostById);

export default router;
