import { Priority, Status } from "@prisma/client";
import { TicketRepository } from "../repositories/TicketRepository";
import { UserRepository } from "../repositories/UserRepository";
import { ClassificationService } from "./ClassificationService";
import { ICreateTicketDTO } from "../interfaces/ITicket";
import { AppError } from "../utils/AppError";

export class TicketService {
  constructor(
    private ticketRepository: TicketRepository,
    private userRepository: UserRepository,
    private classificationService: ClassificationService
  ) {}

  async findAll() {
    return this.ticketRepository.findAll();
  }

  async findById(id: string) {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) throw new AppError("Ticket não encontrado", 404);
    return ticket;
  }

  async create(data: ICreateTicketDTO) {
    const user = await this.userRepository.findById(data.userId);
    if (!user) throw new AppError("Usuário não encontrado", 404);

    const { channel, priority } = await this.classificationService.classify(data.message);

    return this.ticketRepository.create({
      message: data.message,
      channel,
      priority,
      userId: data.userId,
    });
  }

  async updateStatus(id: string, status: Status) {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) throw new AppError("Ticket não encontrado", 404);
    return this.ticketRepository.updateStatus(id, status);
  }
}
