import { Router } from "express";
import { createComment, moveComment } from "../controllers/comment.controller";

const router = Router();

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
