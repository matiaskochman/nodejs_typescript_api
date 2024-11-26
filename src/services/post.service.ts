// src/services/post.service.ts

import { Repository } from "typeorm";
import { Post } from "../entities/Post";
import { dataSource, testDataSource } from "../ormconfig";
import { Comment } from "../entities/Comment";

interface CreatePostDTO {
  title: string;
  body: string;
  image?: string;
  userId: number;
}

export class PostService {
  private postRepository: Repository<Post>;

  constructor() {
    const isTest = process.env.NODE_ENV === "test";
    this.postRepository = isTest
      ? testDataSource.getRepository(Post)
      : dataSource.getRepository(Post);
  }

  // Crear un nuevo post
  async createPost(data: CreatePostDTO): Promise<Post> {
    const { title, body, image, userId } = data;

    if (!title || !body || !userId) {
      throw { status: 400, message: "Faltan campos obligatorios" };
    }

    const post = this.postRepository.create({ title, body, image, userId });
    await this.postRepository.save(post);
    return post;
  }

  // Obtener todos los posts
  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({ relations: ["comments"] });
  }

  // Obtener un post por ID
  async getPostById(id: number): Promise<Post> {
    if (isNaN(id)) {
      throw { status: 400, message: "ID inválido" };
    }

    const post = await this.postRepository.findOne({
      where: { id },
      relations: ["comments"],
    });

    if (!post || post.deletedAt) {
      throw { status: 404, message: "Post no encontrado" };
    }

    return post;
  }

  // Obtener comentarios por ID de post
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    if (isNaN(postId)) {
      throw { status: 400, message: "ID de post inválido" };
    }

    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ["comments"],
    });

    if (!post) {
      throw { status: 404, message: "Post no encontrado" };
    }

    return post.comments;
  }

  // Soft delete de un post
  async deletePost(id: number): Promise<void> {
    if (isNaN(id)) {
      throw { status: 400, message: "ID inválido" };
    }

    const post = await this.postRepository.findOne({ where: { id } });

    if (!post || post.deletedAt) {
      throw { status: 404, message: "Post no encontrado" };
    }

    await this.postRepository.softDelete(id);
  }

  // Restaurar un post soft deleted
  async restorePost(id: number): Promise<void> {
    if (isNaN(id)) {
      throw { status: 400, message: "ID inválido" };
    }

    const post = await this.postRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!post || !post.deletedAt) {
      throw { status: 404, message: "Post no encontrado o no está eliminado" };
    }

    await this.postRepository.restore(id);
  }
}
