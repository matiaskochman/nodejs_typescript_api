// src/services/index.ts

import { CommentService } from "./comment.service";
import { PostService } from "./post.service";

export const commentService = new CommentService();
export const postService = new PostService();
