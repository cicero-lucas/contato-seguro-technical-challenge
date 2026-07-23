import { api } from './api'
import type { Ticket, Status } from '@/types'

export const ticketService = {
  findAll: async () => {
    const res = await api.get<Ticket[]>('/tickets')
    return res.data
  },

  findById: async (id: string) => {
    const res = await api.get<Ticket>(`/tickets/${id}`)
    return res.data
  },

  create: async (data: { message: string }) => {
    const res = await api.post<Ticket>('/tickets', data)
    return res.data
  },

  updateStatus: async (id: string, status: Status) => {
    const res = await api.patch<Ticket>(`/tickets/${id}/status`, { status })
    return res.data
  },
}
