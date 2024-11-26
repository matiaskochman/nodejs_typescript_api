// src/dtos/CreateCommentDTO.ts

import { IsInt, IsNotEmpty, IsString, IsEmail } from "class-validator";

export class CreateCommentDTO {
  @IsString()
  @IsNotEmpty()
  body!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsInt()
  postId!: number;
}
