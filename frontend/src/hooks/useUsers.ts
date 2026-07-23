import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'

export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => ['users', id] as const,
}

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: userService.findAll,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.findById(id),
    enabled: !!id,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; email?: string; password?: string } }) =>
      userService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
    },
  })
}
