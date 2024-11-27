// src/repositories/PostRepository.ts

import { Repository, EntityManager } from "typeorm";
import { Post } from "../entities/Post";
import { IsNull } from "typeorm";
export class PostRepository extends Repository<Post> {
  constructor(manager: EntityManager) {
    super(Post, manager);
  }

  /**
   * Encuentra todos los posts activos (no eliminados) con sus comentarios.
   * @returns Lista de posts activos.
   */
  async findActivePosts(): Promise<Post[]> {
    return this.find({
      where: { deletedAt: IsNull() },
      relations: ["comments"],
    });
  }
}
