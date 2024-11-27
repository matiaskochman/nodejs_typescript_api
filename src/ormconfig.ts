// src/ormconfig.ts
import "reflect-metadata";

import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { Comment } from "./entities/Comment";
import dotenv from "dotenv";
import { PostRepository } from "./repositories/PostRepository";
import { CommentRepository } from "./repositories/CommentRepository";

dotenv.config();

// Instancia para Desarrollo y Producción
const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "my_database",
  synchronize: false, // Debe ser false para usar migraciones
  logging: false,
  entities: [Post, Comment],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
  // Añade tus repositorios personalizados
  // Nota: TypeORM 0.3.x no soporta la opción 'repositories' directamente
});

// Instancia para Pruebas
const testDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  dropSchema: true,
  entities: [Post, Comment],
  synchronize: true, // Sincronizar el esquema para pruebas
  logging: false,
  // Añade tus repositorios personalizados para pruebas
});

export { dataSource, testDataSource };
