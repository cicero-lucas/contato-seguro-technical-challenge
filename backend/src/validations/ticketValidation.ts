import { z } from "zod";

export const createTicketSchema = z.object({
  message: z.string().min(5, "Mensagem deve ter no mínimo 5 caracteres").max(1000),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(["aberto", "em_atendimento", "resolvido"], {
    errorMap: () => ({ message: "Status inválido. Use: aberto, em_atendimento ou resolvido" }),
  }),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;
