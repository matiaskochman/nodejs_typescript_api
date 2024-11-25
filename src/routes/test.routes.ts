// src/routes/test.routes.ts

import { Router, Request, Response } from "express";

const router = Router();

/**
 * Ruta de prueba para generar un error.
 */
router.get("/error", (req: Request, res: Response) => {
  throw new Error("This is a test error.");
});

export default router;
