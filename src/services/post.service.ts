// src/services/post.service.ts

import { Repository } from "typeorm";
import { Post } from "../entities/Post";
import { dataSource, testDataSource } from "../ormconfig";
import { Comment } from "../entities/Comment";

export interface CreatePostDTO {
  title: string;
  body: string;
  image?: string;
  userId: number;
}

export class PostService {
  private postRepository: Repository<Post>;

  constructor() {
    const isTest: boolean = process.env.NODE_ENV === "test";
    this.postRepository = isTest
      ? testDataSource.getRepository(Post)
      : dataSource.getRepository(Post);
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
   * Obtener todos los posts
   * @returns Lista de posts con comentarios
   */
  async getAllPosts(): Promise<Post[]> {
    const posts: Post[] = await this.postRepository.find({
      relations: ["comments"],
    });
    return posts;
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

    const post: Post | null = await this.postRepository.findOne({
      where: { id: postId },
      relations: ["comments"],
    });

    if (!post) {
      throw { status: 404, message: "Post no encontrado" };
    }

    return post.comments;
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
