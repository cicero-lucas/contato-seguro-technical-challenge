import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { createUserSchema, updateUserSchema } from "../validations/userValidation";

export class UserController {
  constructor(private userService: UserService) {}

  async findAll(req: Request, res: Response): Promise<void> {
    const users = await this.userService.findAll();
    res.json(users);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const user = await this.userService.findById(req.params.id as string);
    res.json(user);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = createUserSchema.parse(req.body);
    const user = await this.userService.create(data);
    res.status(201).json(user);
  }

  async update(req: Request, res: Response): Promise<void> {
    const data = updateUserSchema.parse(req.body);
    const user = await this.userService.update(req.params.id as string, data);
    res.json(user);
  }
}
