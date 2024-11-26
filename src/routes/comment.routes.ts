// src/routes/comment.routes.ts

import { Router } from "express";
import { createComment, moveComment } from "../controllers/comment.controller";

const router = Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Crea un nuevo comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               postId:
 *                 type: integer
 *             required:
 *               - body
 *               - name
 *               - email
 *               - postId
 *     responses:
 *       201:
 *         description: Comentario creado
 *       400:
 *         description: Faltan campos obligatorios
 *       404:
 *         description: Post no encontrado o eliminado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", createComment);

/**
 * @swagger
 * /api/comments/move:
 *   put:
 *     summary: Mueve un comentario de un post a otro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: integer
 *                 description: ID del comentario a mover
 *               newPostId:
 *                 type: integer
 *                 description: ID del nuevo post al que se moverá el comentario
 *             required:
 *               - commentId
 *               - newPostId
 *     responses:
 *       200:
 *         description: Comentario movido exitosamente
 *       400:
 *         description: IDs inválidos
 *       404:
 *         description: Comentario o nuevo post no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/move", moveComment);

export default router;
