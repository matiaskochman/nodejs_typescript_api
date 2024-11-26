// // src/dtos/comment.dtos.ts
// export interface CommentCreateDTO {
//   body: string;
//   name: string;
//   email: string;
//   postId: string;
// }

// export interface CommentMoveDTO {
//   commentId: string;
//   newPostId: string;
// }
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
