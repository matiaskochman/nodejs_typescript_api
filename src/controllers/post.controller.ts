// src/controllers/post.controller.ts
import { Request, Response, NextFunction } from "express";
import { PostService } from "../services/post.service";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";
import { CreatePostDTO } from "../dtos/CreatePostDTO";

const postService: PostService = new PostService();

/**
 * Obtiene todos los posts con sus comentarios.
 */
export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts: Post[] = await postService.getAllPosts();
    res.json(posts);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Crea un nuevo post.
 */
export const createPost = async (
  req: Request<unknown, unknown, CreatePostDTO>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, body, image, userId }: CreatePostDTO = req.body;

    const savedPost: Post = await postService.createPost({
      title,
      body,
      image,
      userId,
    });

    res.status(201).json(savedPost);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Obtiene un post por su ID, incluyendo sus comentarios.
 */
export const getPostById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id }: { id: string } = req.params;

    const post: Post | null = await postService.getPostById(Number(id));

    res.json(post);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Obtiene todos los comentarios de un post específico.
 */
export const getCommentsByPostId = async (
  req: Request<{ post_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { post_id }: { post_id: string } = req.params;

    const comments: Comment[] = await postService.getCommentsByPostId(
      Number(post_id)
    );

    res.json(comments);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Elimina lógicamente un post por su ID.
 */
export const softDeletePost = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id }: { id: string } = req.params;

    await postService.deletePost(Number(id));

    res.status(200).json({ message: "Post eliminado correctamente" });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Restaura un post eliminado lógicamente.
 */
export const restorePost = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id }: { id: string } = req.params;

    await postService.restorePost(Number(id));

    res.status(200).json({ message: "Post restaurado correctamente" });
  } catch (error: unknown) {
    next(error);
  }
};
