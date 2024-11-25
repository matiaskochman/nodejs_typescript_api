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
          id: { type: "integer" },
          title: { type: "string" },
          body: { type: "string" },
          image: { type: "string", nullable: true },
          userId: { type: "integer" },
          comments: {
            type: "array",
            items: { $ref: "#/components/schemas/Comment" },
          },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "integer" },
          body: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          postId: { type: "integer" },
        },
      },
    },
  },
};

export default swaggerOptions;
