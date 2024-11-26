// src/controllers/comment.controller.ts
import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment.service";

const commentService = new CommentService();

/**
 * Crea un nuevo comentario asociado a un post existente.
 */
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, name, email, postId } = req.body;
    const savedComment = await commentService.createComment({
      body,
      name,
      email,
      postId,
    });
    res.status(201).json(savedComment);
  } catch (error) {
    next(error);
  }
};

/**
 * Mueve un comentario de un post a otro.
 */
export const moveComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { commentId, newPostId } = req.body;
    const movedComment = await commentService.moveComment({
      commentId,
      newPostId,
    });
    res.status(200).json({
      message: "Comentario movido exitosamente",
      comment: movedComment,
    });
  } catch (error) {
    next(error);
  }
};
