import express from "express";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerOptions from "./swagger.config.js";

const app = express();

app.use(express.json());

// Configuración de Swagger
const swaggerSpec = swaggerJsDoc({
  definition: swaggerOptions,
  apis: ["./src/routes/*.ts"],
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

export default app;
