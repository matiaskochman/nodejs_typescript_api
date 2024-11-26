// src/dtos/comment.dtos.ts
export interface CommentCreateDTO {
  body: string;
  name: string;
  email: string;
  postId: number; // Cambiado a number
}

export interface CommentMoveDTO {
  commentId: number; // Cambiado a number
  newPostId: number; // Cambiado a number
}
