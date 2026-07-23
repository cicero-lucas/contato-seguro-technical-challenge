import prisma from "../config/prisma";
import { Channel, Priority, Status } from "@prisma/client";

export class TicketRepository {
  async findAll() {
    return prisma.ticket.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async create(data: { message: string; channel: Channel; priority: Priority; userId: string }) {
    return prisma.ticket.create({
      data,
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async updateStatus(id: string, status: Status) {
    return prisma.ticket.update({
      where: { id },
      data: { status },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }
}
