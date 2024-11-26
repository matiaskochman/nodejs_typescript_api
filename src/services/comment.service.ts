// src/services/comment.service.ts

import { Repository } from "typeorm";
import { Comment } from "../entities/Comment";
import { dataSource, testDataSource } from "../ormconfig";
import { Post } from "../entities/Post";

interface CreateCommentDTO {
  body: string;
  name: string;
  email: string;
  postId: number;
}

interface MoveCommentDTO {
  commentId: number;
  newPostId: number;
}

export class CommentService {
  private commentRepository: Repository<Comment>;
  private postRepository: Repository<Post>;

  constructor() {
    const isTest = process.env.NODE_ENV === "test";
    this.commentRepository = isTest
      ? testDataSource.getRepository(Comment)
      : dataSource.getRepository(Comment);
    this.postRepository = isTest
      ? testDataSource.getRepository(Post)
      : dataSource.getRepository(Post);
  }

  // Crear un nuevo comentario
  async createComment(data: CreateCommentDTO): Promise<Comment> {
    const { body, name, email, postId } = data;

    if (!body || !name || !email || !postId) {
      throw { status: 400, message: "Faltan campos obligatorios" };
    }

    // Verificar que el post existe y no está eliminado
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post || post.deletedAt) {
      throw { status: 404, message: "Post no encontrado o eliminado" };
    }

    const comment = this.commentRepository.create({
      body,
      name,
      email,
      postId,
    });
    await this.commentRepository.save(comment);
    return comment;
  }

  // Mover un comentario a otro post
  async moveComment(data: MoveCommentDTO): Promise<Comment> {
    const { commentId, newPostId } = data;

    if (!commentId || !newPostId) {
      throw { status: 400, message: "Faltan campos obligatorios" };
    }

    // Verificar que el comentario existe
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw { status: 404, message: "Comentario no encontrado" };
    }

    // Verificar que el nuevo post existe y no está eliminado
    const newPost = await this.postRepository.findOne({
      where: { id: newPostId },
    });
    if (!newPost || newPost.deletedAt) {
      throw { status: 404, message: "Nuevo post no encontrado o eliminado" };
    }

    // Actualizar el postId del comentario
    comment.postId = newPostId;
    await this.commentRepository.save(comment);

    return comment;
  }
}
