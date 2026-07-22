import { Channel, Status } from "@prisma/client";

export interface ITicket {
  id: string;
  message: string;
  channel: Channel;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ICreateTicketDTO {
  message: string;
  userId: string;
}

export interface IUpdateTicketStatusDTO {
  status: Status;
}
