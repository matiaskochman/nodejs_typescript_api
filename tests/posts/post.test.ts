// tests/posts/posts.test.ts

import request from "supertest";
import app from "../../src/app";
import { Post } from "../../src/entities/Post";

describe("Posts API", () => {
  describe("POST /api/posts", () => {
    it("should create a new post", async () => {
      const res = await request(app).post("/api/posts").send({
        title: "Test Post",
        body: "This is a test post.",
        userId: 1,
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Test Post");
      expect(res.body.body).toBe("This is a test post.");
      expect(res.body.userId).toBe(1);
      expect(res.body.deletedAt).toBeNull();
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/api/posts").send({
        title: "",
        body: "Missing title.",
        userId: 1,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "Faltan campos obligatorios");
    });
  });

  // ...otras pruebas para GET, DELETE, PATCH
});

describe("Posts API - Full Workflow", () => {
  // Variables para almacenar IDs de recursos creados
  let post1Id: number;
  let post2Id: number;
  let comment1Id: number;

  it("should perform the full API operations as per the bash script", async () => {
    // 1. Crear el Primer Post
    const createPost1Res = await request(app).post("/api/posts").send({
      title: "Primer Post",
      body: "Este es el contenido del primer post.",
      userId: 1,
    });
    expect(createPost1Res.statusCode).toEqual(201);
    expect(createPost1Res.body).toHaveProperty("id");
    expect(createPost1Res.body.title).toBe("Primer Post");
    expect(createPost1Res.body.body).toBe(
      "Este es el contenido del primer post."
    );
    expect(createPost1Res.body.userId).toBe(1);
    expect(createPost1Res.body.deletedAt).toBeNull();
    post1Id = createPost1Res.body.id;
    console.log("Respuesta Crear Primer Post:", createPost1Res.body);

    // 2. Crear el Segundo Post
    const createPost2Res = await request(app).post("/api/posts").send({
      title: "Segundo Post",
      body: "Este es el contenido del segundo post.",
      userId: 2,
    });
    expect(createPost2Res.statusCode).toEqual(201);
    expect(createPost2Res.body).toHaveProperty("id");
    expect(createPost2Res.body.title).toBe("Segundo Post");
    expect(createPost2Res.body.body).toBe(
      "Este es el contenido del segundo post."
    );
    expect(createPost2Res.body.userId).toBe(2);
    expect(createPost2Res.body.deletedAt).toBeNull();
    post2Id = createPost2Res.body.id;
    console.log("Respuesta Crear Segundo Post:", createPost2Res.body);

    // 3. Obtener Todos los Posts
    const getAllPostsRes = await request(app).get("/api/posts");
    expect(getAllPostsRes.statusCode).toEqual(200);
    expect(Array.isArray(getAllPostsRes.body)).toBe(true);
    expect(getAllPostsRes.body.length).toBeGreaterThanOrEqual(2);
    console.log("Respuesta Obtener Todos los Posts:", getAllPostsRes.body);

    // 4. Añadir un Comentario al Primer Post
    const addCommentRes = await request(app).post("/api/comments").send({
      body: "Este es un comentario para el primer post.",
      name: "Ana García",
      email: "ana.garcia@example.com",
      postId: post1Id,
    });
    expect(addCommentRes.statusCode).toEqual(201);
    expect(addCommentRes.body).toHaveProperty("id");
    expect(addCommentRes.body.body).toBe(
      "Este es un comentario para el primer post."
    );
    expect(addCommentRes.body.name).toBe("Ana García");
    expect(addCommentRes.body.email).toBe("ana.garcia@example.com");
    expect(addCommentRes.body.postId).toBe(post1Id);
    comment1Id = addCommentRes.body.id;
    console.log(
      "Respuesta Añadir Comentario al Primer Post:",
      addCommentRes.body
    );

    // 5. Obtener Comentarios del Primer Post
    const getCommentsPost1Res = await request(app).get(
      `/api/posts/${post1Id}/comments`
    );
    expect(getCommentsPost1Res.statusCode).toEqual(200);
    expect(Array.isArray(getCommentsPost1Res.body)).toBe(true);
    expect(getCommentsPost1Res.body.length).toBe(1);
    expect(getCommentsPost1Res.body[0].id).toBe(comment1Id);
    console.log(
      "Respuesta Obtener Comentarios del Primer Post:",
      getCommentsPost1Res.body
    );

    // 6. Mover el Comentario al Segundo Post
    const moveCommentRes = await request(app).put("/api/comments/move").send({
      commentId: comment1Id,
      newPostId: post2Id,
    });
    expect(moveCommentRes.statusCode).toEqual(200);
    expect(moveCommentRes.body).toHaveProperty(
      "message",
      "Comentario movido exitosamente"
    );
    expect(moveCommentRes.body.comment.postId).toBe(post2Id);
    console.log(
      "Respuesta Mover Comentario al Segundo Post:",
      moveCommentRes.body
    );

    // 7. Obtener Comentarios del Segundo Post
    const getCommentsPost2Res = await request(app).get(
      `/api/posts/${post2Id}/comments`
    );
    expect(getCommentsPost2Res.statusCode).toEqual(200);
    expect(Array.isArray(getCommentsPost2Res.body)).toBe(true);
    expect(getCommentsPost2Res.body.length).toBe(1);
    expect(getCommentsPost2Res.body[0].id).toBe(comment1Id);
    console.log(
      "Respuesta Obtener Comentarios del Segundo Post:",
      getCommentsPost2Res.body
    );

    // 8. Soft Delete del Primer Post
    const deletePost1Res = await request(app).delete(`/api/posts/${post1Id}`);
    expect(deletePost1Res.statusCode).toEqual(200);
    expect(deletePost1Res.body).toHaveProperty(
      "message",
      "Post eliminado correctamente"
    );
    console.log("Respuesta Soft Delete del Primer Post:", deletePost1Res.body);

    // Verificar que el post está soft deleted
    const getPostAfterDeleteRes = await request(app).get(
      `/api/posts/${post1Id}`
    );
    expect(getPostAfterDeleteRes.statusCode).toEqual(404);
    console.log(
      "Verificación de Soft Delete - Post1 No Encontrado:",
      getPostAfterDeleteRes.body
    );

    // 9. Obtener Todos los Posts Después de la Eliminación
    const getAllPostsAfterDeleteRes = await request(app).get("/api/posts");
    expect(getAllPostsAfterDeleteRes.statusCode).toEqual(200);
    expect(Array.isArray(getAllPostsAfterDeleteRes.body)).toBe(true);
    // Verificar que el primer post no está en la lista
    const post1Exists = getAllPostsAfterDeleteRes.body.some(
      (post: Post) => post.id === post1Id
    );
    expect(post1Exists).toBe(false);
    console.log(
      "Respuesta Obtener Todos los Posts Después de la Eliminación:",
      getAllPostsAfterDeleteRes.body
    );

    // 10. Restaurar el Primer Post
    const restorePost1Res = await request(app).patch(
      `/api/posts/${post1Id}/restore`
    );
    expect(restorePost1Res.statusCode).toEqual(200);
    expect(restorePost1Res.body).toHaveProperty(
      "message",
      "Post restaurado correctamente"
    );
    console.log("Respuesta Restaurar el Primer Post:", restorePost1Res.body);

    // 11. Obtener Todos los Posts Después de la Restauración
    const getAllPostsAfterRestoreRes = await request(app).get("/api/posts");
    expect(getAllPostsAfterRestoreRes.statusCode).toEqual(200);
    expect(Array.isArray(getAllPostsAfterRestoreRes.body)).toBe(true);
    // Verificar que el primer post está nuevamente en la lista
    const post1ExistsAfterRestore = getAllPostsAfterRestoreRes.body.some(
      (post: Post) => post.id === post1Id
    );
    expect(post1ExistsAfterRestore).toBe(true);
    console.log(
      "Respuesta Obtener Todos los Posts Después de la Restauración:",
      getAllPostsAfterRestoreRes.body
    );
  });
});
