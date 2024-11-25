// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";

/**
 * Middleware de manejo de errores.
 * Captura cualquier error que ocurra en las rutas y envía una respuesta estandarizada.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message,
  });
};
