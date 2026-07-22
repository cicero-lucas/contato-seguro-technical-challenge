import { Response } from "express";
import { TicketService } from "../services/TicketService";
import { createTicketSchema, updateTicketStatusSchema } from "../validations/ticketValidation";
import { AuthenticatedRequest } from "../types";

export class TicketController {
  constructor(private ticketService: TicketService) {}

  async findAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tickets = await this.ticketService.findAll();
    res.json(tickets);
  }

  async findById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const ticket = await this.ticketService.findById(req.params.id as string);
    res.json(ticket);
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { message } = createTicketSchema.parse(req.body);
    const userId = req.user!.sub;
    const ticket = await this.ticketService.create({ message, userId });
    res.status(201).json(ticket);
  }

  async updateStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { status } = updateTicketStatusSchema.parse(req.body);
    const ticket = await this.ticketService.updateStatus(req.params.id as string, status);
    res.json(ticket);
  }
}
