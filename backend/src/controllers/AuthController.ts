import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { loginSchema, registerSchema } from "../validations/authValidation";
import { AuthenticatedRequest } from "../types";

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    const data = registerSchema.parse(req.body);
    const result = await this.authService.register(data);
    res.status(201).json(result);
  }

  async login(req: Request, res: Response): Promise<void> {
    const data = loginSchema.parse(req.body);
    const result = await this.authService.login(data);
    res.json(result);
  }

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = await this.authService.me(req.user!.sub);
    res.json(user);
  }
}
