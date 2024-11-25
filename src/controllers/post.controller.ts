// src/controllers/post.controller.ts

import { Request, Response } from "express";
import { AppDataSource } from "../ormconfig.js";
import { Post } from "../entities/Post.js";
import { Comment } from "../entities/Comment.js";

const postRepository = AppDataSource.getRepository(Post);
const commentRepository = AppDataSource.getRepository(Comment);

/**
 * Obtiene todos los posts con sus comentarios.
 */
export const getAllPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const posts = await postRepository.find({ relations: ["comments"] });
    res.json(posts);
  } catch (error) {
    console.error("Error al obtener los posts:", error);
    res.status(500).json({ message: "Error al obtener los posts" });
  }
};

/**
 * Crea un nuevo post con la posibilidad de incluir comentarios.
 */
export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, body, image, userId, comments } = req.body;

    if (!title || !body || !userId) {
      res.status(400).json({ message: "Faltan campos obligatorios" });
      return;
    }

    const post = postRepository.create({
      title,
      body,
      image,
      userId,
      comments,
    });
    const savedPost = await postRepository.save(post);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error al crear el post:", error);
    res.status(500).json({ message: "Error al crear el post" });
  }
};

/**
 * Obtiene un post por su ID, incluyendo sus comentarios.
 */
export const getPostById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const post = await postRepository.findOne({
      where: { id: Number(id) },
      relations: ["comments"],
    });

    if (!post) {
      res.status(404).json({ message: "Post no encontrado" });
      return;
    }

    res.json(post);
  } catch (error) {
    console.error("Error al obtener el post:", error);
    res.status(500).json({ message: "Error al obtener el post" });
  }
};

/**
 * Obtiene todos los comentarios de un post específico.
 */
export const getCommentsByPostId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { post_id } = req.params;

    if (!post_id || isNaN(Number(post_id))) {
      res.status(400).json({ message: "ID de post inválido" });
      return;
    }

    const post = await postRepository.findOne({
      where: { id: Number(post_id) },
      relations: ["comments"],
    });

    if (!post) {
      res.status(404).json({ message: "Post no encontrado" });
      return;
    }

    res.json(post.comments);
  } catch (error) {
    console.error("Error al obtener los comentarios del post:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los comentarios del post" });
  }
};
