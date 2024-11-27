// src/repositories/CommentRepository.ts

import { Repository, EntityManager } from "typeorm";
import { Comment } from "../entities/Comment";

export class CommentRepository extends Repository<Comment> {
  constructor(manager: EntityManager) {
    super(Comment, manager);
  }

  /**
   * Encuentra todos los comentarios asociados a un post específico.
   * @param postId ID del post.
   * @returns Lista de comentarios.
   */
  async findCommentsByPostId(postId: number): Promise<Comment[]> {
    return this.find({ where: { postId }, relations: ["post"] });
  }
}
