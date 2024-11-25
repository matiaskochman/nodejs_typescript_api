import { Request, Response } from "express";
import { AppDataSource } from "../ormconfig.js";
import { Comment } from "../entities/Comment.js";

const commentRepository = AppDataSource.getRepository(Comment);

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
