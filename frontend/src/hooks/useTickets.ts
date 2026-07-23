import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketService } from '@/services/ticketService'
import type { Status } from '@/types'

export const ticketKeys = {
  all: ['tickets'] as const,
  detail: (id: string) => ['tickets', id] as const,
}

export function useTickets() {
  return useQuery({
    queryKey: ticketKeys.all,
    queryFn: ticketService.findAll,
  })
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketService.findById(id),
    enabled: !!id,
  })
}

export function useCreateTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ticketService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ticketKeys.all }),
  })
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      ticketService.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all })
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) })
    },
  })
}
