// src/services/post.service.ts

import { Post } from "../entities/Post";
import { PostRepository } from "../repositories/PostRepository";
import { CommentRepository } from "../repositories/CommentRepository";
import { dataSource, testDataSource } from "../ormconfig";
import { CreatePostDTO } from "../dtos/CreatePostDTO";
import { Comment } from "../entities/Comment";

export class PostService {
  private postRepository: PostRepository;
  private commentRepository: CommentRepository;

  constructor() {
    const isTest: boolean = process.env.NODE_ENV === "test";
    const manager = isTest ? testDataSource.manager : dataSource.manager;

    this.postRepository = new PostRepository(manager);
    this.commentRepository = new CommentRepository(manager);
  }

  /**
   * Crear un nuevo post
   * @param data Datos para crear el post
   * @returns El post creado
   */
  async createPost(data: CreatePostDTO): Promise<Post> {
    const { title, body, image, userId }: CreatePostDTO = data;

    if (!title || !body || !userId) {
      throw { status: 400, message: "Faltan campos obligatorios" };
    }

    const post: Post = this.postRepository.create({
      title,
      body,
      image,
      userId,
    });
    await this.postRepository.save(post);
    return post;
  }

  /**
   * Obtener todos los posts activos con sus comentarios.
   * @returns Lista de posts activos.
   */
  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.findActivePosts();
  }

  /**
   * Obtener un post por su ID
   * @param id ID del post
   * @returns El post encontrado
   */
  async getPostById(id: number): Promise<Post> {
    if (isNaN(id)) {
      throw { status: 400, message: "ID inválido" };
    }

    const post: Post | null = await this.postRepository.findOne({
      where: { id },
      relations: ["comments"],
    });

    if (!post || post.deletedAt) {
      throw { status: 404, message: "Post no encontrado" };
    }

    return post;
  }

  /**
   * Obtener comentarios de un post específico por su ID
   * @param postId ID del post
   * @returns Lista de comentarios
   */
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    if (isNaN(postId)) {
      throw { status: 400, message: "ID de post inválido" };
    }

    return this.commentRepository.findCommentsByPostId(postId);
  }

  /**
   * Soft delete de un post
   * @param id ID del post
   */
  async deletePost(id: number): Promise<void> {
    if (isNaN(id)) {
      throw { status: 400, message: "ID inválido" };
    }

    const post: Post | null = await this.postRepository.findOne({
      where: { id },
    });

    if (!post || post.deletedAt) {
      throw { status: 404, message: "Post no encontrado" };
    }

    await this.postRepository.softDelete(id);
  }

  /**
   * Restaurar un post eliminado lógicamente
   * @param id ID del post
   */
  async restorePost(id: number): Promise<void> {
    if (isNaN(id)) {
      throw { status: 400, message: "ID inválido" };
    }

    const post: Post | null = await this.postRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!post || !post.deletedAt) {
      throw { status: 404, message: "Post no encontrado o no está eliminado" };
    }

    await this.postRepository.restore(id);
  }
}
