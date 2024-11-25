// src/controllers/comment.controller.ts

import { Request, Response } from "express";
import { dataSource, testDataSource } from "../ormconfig";
import { Comment } from "../entities/Comment";

const isTest = process.env.NODE_ENV === "test";
const commentRepository = isTest
  ? testDataSource.getRepository(Comment)
  : dataSource.getRepository(Comment);

import { Post } from "../entities/Post";

const postRepository = isTest
  ? testDataSource.getRepository(Post)
  : dataSource.getRepository(Post);

/**
 * Crea un nuevo comentario asociado a un post existente.
 */
export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { body, name, email, postId } = req.body;

    // Validación de campos obligatorios
    if (!body || !name || !email || !postId) {
      res.status(400).json({ message: "Faltan campos obligatorios" });
      return;
    }

    // Crear el comentario
    const comment = commentRepository.create({
      body,
      name,
      email,
      post: { id: postId },
    });

    // Guardar el comentario en la base de datos
    const savedComment = await commentRepository.save(comment);

    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error al crear el comentario:", error);
    res.status(500).json({ message: "Error al crear el comentario" });
  }
};
/**
 * Mueve un comentario de un post a otro.
 */
/**
 * Mueve un comentario de un post a otro.
 */
export const moveComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId, newPostId } = req.body;

    if (
      !commentId ||
      isNaN(Number(commentId)) ||
      !newPostId ||
      isNaN(Number(newPostId))
    ) {
      res.status(400).json({ message: "IDs inválidos" });
      return;
    }

    const comment = await commentRepository.findOneBy({
      id: Number(commentId),
    });

    if (!comment) {
      res.status(404).json({ message: "Comentario no encontrado" });
      return;
    }

    const newPost = await postRepository.findOneBy({
      id: Number(newPostId),
      // deletedAt: null,
    });

    if (!newPost) {
      res
        .status(404)
        .json({ message: "Nuevo post no encontrado o ha sido eliminado" });
      return;
    }

    comment.post = newPost;
    await commentRepository.save(comment);

    res
      .status(200)
      .json({ message: "Comentario movido exitosamente", comment });
  } catch (error) {
    console.error("Error al mover el comentario:", error);
    res.status(500).json({ message: "Error al mover el comentario" });
  }
};
