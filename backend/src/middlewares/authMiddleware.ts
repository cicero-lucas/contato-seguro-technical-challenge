import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { AuthenticatedRequest } from "../types";
import { IJwtPayload } from "../interfaces/IAuth";

export function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Token não fornecido", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret) as IJwtPayload;
    req.user = payload;
    next();
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
}
