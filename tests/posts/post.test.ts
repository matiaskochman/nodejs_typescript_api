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
