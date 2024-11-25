import express from "express";
import postRoutes from "./routes/post.routes.js"; // Incluye la extensión .js
import commentRoutes from "./routes/comment.routes.js"; // Incluye la extensión .js

const app = express();

app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

export default app;
