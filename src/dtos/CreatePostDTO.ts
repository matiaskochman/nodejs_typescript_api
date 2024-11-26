// src/dtos/post.dtos.ts
import { IsString, IsNotEmpty, IsInt } from "class-validator";

export class CreatePostDTO {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;

  @IsString()
  image!: string;

  @IsInt()
  userId!: number;
}
