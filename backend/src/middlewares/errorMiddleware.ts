import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import logger from "../config/logger";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ZodError) {
    res.status(422).json({
      status: "error",
      message: "Dados inválidos",
      errors: error.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ status: "error", message: error.message });
    return;
  }

  logger.error({ err: error, path: req.path, method: req.method }, "Erro interno");
  res.status(500).json({ status: "error", message: "Erro interno do servidor" });
}
