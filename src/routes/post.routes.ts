// src/routes/post.routes.ts

import { Router } from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
  getCommentsByPostId,
  softDeletePost,
  restorePost,
} from "../controllers/post.controller";

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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               image:
 *                 type: string
 *               userId:
 *                 type: integer
 *             required:
 *               - title
 *               - body
 *               - userId
 *     responses:
 *       201:
 *         description: Post creado
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error interno del servidor
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
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
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
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:post_id/comments", getCommentsByPostId);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Elimina lógicamente un post por su ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post eliminado correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", softDeletePost);

/**
 * @swagger
 * /api/posts/{id}/restore:
 *   patch:
 *     summary: Restaura un post eliminado lógicamente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post restaurado correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Post no encontrado o no está eliminado
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/:id/restore", restorePost);

export default router;
