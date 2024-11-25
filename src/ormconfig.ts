// src/ormconfig.ts

import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { Comment } from "./entities/Comment";
import dotenv from "dotenv";

dotenv.config();

// Instancia para Desarrollo y Producción
export const dataSource = new DataSource({
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
});

// Instancia para Pruebas
export const testDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  dropSchema: true,
  entities: [Post, Comment],
  synchronize: true, // Sincronizar el esquema para pruebas
  logging: false,
});
