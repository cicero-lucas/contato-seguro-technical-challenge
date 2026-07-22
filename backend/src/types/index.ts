import { IJwtPayload } from "../interfaces/IAuth";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: IJwtPayload;
}

export type AppEnv = "development" | "production" | "test";
