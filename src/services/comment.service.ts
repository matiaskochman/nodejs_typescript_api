// src/services/comment.service.ts

import { Comment } from "../entities/Comment";
import { CommentRepository } from "../repositories/CommentRepository";
import { PostRepository } from "../repositories/PostRepository";
import { dataSource, testDataSource } from "../ormconfig";
import { CommentCreateDTO, CommentMoveDTO } from "../dtos/comment.dtos";

export class CommentService {
  private commentRepository: CommentRepository;
  private postRepository: PostRepository;

  constructor() {
    const isTest: boolean = process.env.NODE_ENV === "test";
    const manager = isTest ? testDataSource.manager : dataSource.manager;

    this.commentRepository = new CommentRepository(manager);
    this.postRepository = new PostRepository(manager);
  }

  /**
   * Crear un nuevo comentario.
   */
  async createComment(data: CommentCreateDTO): Promise<Comment> {
    const { body, name, email, postId }: CommentCreateDTO = data;

    if (!body || !name || !email || !postId) {
      throw { status: 400, message: "Faltan campos obligatorios" };
    }

    const postIdNumber: number = Number(postId);
    if (isNaN(postIdNumber)) {
      throw { status: 400, message: "ID de post inválido" };
    }

    // Verificar que el post existe y no está eliminado
    const post = await this.postRepository.findOne({
      where: { id: postIdNumber },
    });

    if (!post || post.deletedAt) {
      throw { status: 404, message: "Post no encontrado o eliminado" };
    }

    const comment: Comment = this.commentRepository.create({
      body,
      name,
      email,
      postId: postIdNumber,
    });

    await this.commentRepository.save(comment);
    return comment;
  }

  /**
   * Mover un comentario a otro post.
   */
  async moveComment(data: CommentMoveDTO): Promise<Comment> {
    const { commentId, newPostId }: CommentMoveDTO = data;

    const commentIdNumber: number = Number(commentId);
    const newPostIdNumber: number = Number(newPostId);

    if (isNaN(commentIdNumber) || isNaN(newPostIdNumber)) {
      throw { status: 400, message: "IDs inválidos" };
    }

    // Verificar que el comentario existe
    const comment: Comment | null = await this.commentRepository.findOne({
      where: { id: commentIdNumber },
    });

    if (!comment) {
      throw { status: 404, message: "Comentario no encontrado" };
    }

    // Verificar que el nuevo post existe y no está eliminado
    const newPost = await this.postRepository.findOne({
      where: { id: newPostIdNumber },
    });

    if (!newPost || newPost.deletedAt) {
      throw { status: 404, message: "Nuevo post no encontrado o eliminado" };
    }

    // Actualizar el postId del comentario
    comment.postId = newPostIdNumber;

    await this.commentRepository.save(comment);
    return comment;
  }
}
