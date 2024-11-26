// src/controllers/comment.controller.ts
import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment.service";
import { CommentCreateDTO, CommentMoveDTO } from "../dtos/comment.dtos";
import { Comment } from "../entities/Comment";

const commentService: CommentService = new CommentService();

/**
 * Controlador para crear un comentario asociado a un post existente.
 */
export const createComment = async (
  req: Request<unknown, unknown, CommentCreateDTO>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, name, email, postId }: CommentCreateDTO = req.body;

    const postIdNumber: number = Number(postId); // Conversion explícita a número

    const savedComment: Comment = await commentService.createComment({
      body,
      name,
      email,
      postId: postIdNumber,
    });

    res.status(201).json(savedComment);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Controlador para mover un comentario de un post a otro.
 */
export const moveComment = async (
  req: Request<unknown, unknown, CommentMoveDTO>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { commentId, newPostId }: CommentMoveDTO = req.body;

    const commentIdNumber: number = Number(commentId); // Conversion explícita a número
    const newPostIdNumber: number = Number(newPostId); // Conversion explícita a número

    const movedComment: Comment = await commentService.moveComment({
      commentId: commentIdNumber,
      newPostId: newPostIdNumber,
    });

    res.status(200).json({
      message: "Comentario movido exitosamente",
      comment: movedComment,
    });
  } catch (error: unknown) {
    next(error);
  }
};
