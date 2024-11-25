// src/entities/Post.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { Comment } from "./Comment";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text", nullable: true })
  body?: string;

  @Column({ type: "varchar", nullable: true })
  image?: string;

  @Column({ type: "int" })
  userId!: number;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments!: Comment[];

  @DeleteDateColumn()
  deletedAt?: Date | null; // Maneja soft delete automáticamente
}
