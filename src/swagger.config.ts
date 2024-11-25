// src/swagger.config.ts

const swaggerOptions = {
  openapi: "3.0.0",
  info: {
    title: "Post Comments API",
    version: "1.0.0",
    description: "API para gestionar posts y comentarios",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local",
    },
  ],
  components: {
    schemas: {
      Post: {
        type: "object",
        properties: {
          id: { type: "integer", description: "ID único del post" },
          title: { type: "string", description: "Título del post" },
          body: { type: "string", description: "Contenido del post" },
          image: {
            type: "string",
            nullable: true,
            description: "URL de la imagen del post",
          },
          userId: {
            type: "integer",
            description: "ID del usuario que creó el post",
          },
          comments: {
            type: "array",
            items: { $ref: "#/components/schemas/Comment" },
            description: "Lista de comentarios asociados al post",
          },
        },
        required: ["id", "title", "body", "userId"],
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "integer", description: "ID único del comentario" },
          body: { type: "string", description: "Contenido del comentario" },
          name: {
            type: "string",
            description: "Nombre del autor del comentario",
          },
          email: {
            type: "string",
            description: "Email del autor del comentario",
          },
          postId: {
            type: "integer",
            description: "ID del post al que pertenece el comentario",
          },
        },
        required: ["id", "body", "name", "email", "postId"],
      },
    },
  },
};

export default swaggerOptions;
