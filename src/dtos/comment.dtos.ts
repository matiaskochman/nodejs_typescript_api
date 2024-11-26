// src/dtos/comment.dtos.ts
export interface CommentCreateDTO {
  body: string;
  name: string;
  email: string;
  postId: string;
}

export interface CommentMoveDTO {
  commentId: string;
  newPostId: string;
}
