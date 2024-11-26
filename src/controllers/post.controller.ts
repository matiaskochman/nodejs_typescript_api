// src/controllers/post.controller.ts
import { Request, Response, NextFunction } from "express";
import { PostService } from "../services/post.service";

const postService = new PostService();

/**
 * Obtiene todos los posts con sus comentarios.
 */
export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo post.
 */
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, body, image, userId } = req.body;
    const savedPost = await postService.createPost({
      title,
      body,
      image,
      userId,
    });
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un post por su ID, incluyendo sus comentarios.
 */
export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await postService.getPostById(Number(id));
    res.json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene todos los comentarios de un post específico.
 */
export const getCommentsByPostId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { post_id } = req.params;
    const comments = await postService.getCommentsByPostId(Number(post_id));
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina lógicamente un post por su ID.
 */
export const softDeletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await postService.deletePost(Number(id));
    res.status(200).json({ message: "Post eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

/**
 * Restaura un post eliminado lógicamente.
 */
export const restorePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await postService.restorePost(Number(id));
    res.status(200).json({ message: "Post restaurado correctamente" });
  } catch (error) {
    next(error);
  }
};
