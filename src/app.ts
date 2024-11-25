// src/app.ts

import express from "express";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import testRoutes from "./routes/test.routes"; // Importar la ruta de prueba
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerOptions from "./swagger.config";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

// Configuración de Swagger
const swaggerSpec = swaggerJsDoc({
  definition: swaggerOptions,
  apis: ["src/routes/*.ts"],
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/test", testRoutes); // Usar la ruta de prueba

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
