// src/routes/post.routes.ts

import { Router } from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
  getCommentsByPostId,
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

/**
 * @swagger
 * /api/posts/{post_id}/comments:
 *   get:
 *     summary: Obtiene todos los comentarios de un post específico
 *     parameters:
 *       - name: post_id
 *         in: path
 *         required: true
 *         description: ID del post para obtener sus comentarios
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de comentarios del post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Comment"
 *       400:
 *         description: ID de post inválido
 *       404:
 *         description: Post no encontrado
 */
router.get("/:post_id/comments", getCommentsByPostId);

export default router;
