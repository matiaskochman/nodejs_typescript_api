// src/ormconfig.ts

import { DataSource } from "typeorm";
import { Post } from "./entities/Post.js";
import { Comment } from "./entities/Comment.js";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5555"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "my_database",
  synchronize: true, // Importante para usar migraciones
  logging: true,
  entities: [Post, Comment],
  migrations: ["src/migrations/*.ts"], // Ruta para las migraciones
  subscribers: [],
});
