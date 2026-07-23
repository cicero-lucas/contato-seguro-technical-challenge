import { api } from './api'
import type { User } from '@/types'

export const userService = {
  findAll: async () => {
    const res = await api.get<User[]>('/users')
    return res.data
  },

  findById: async (id: string) => {
    const res = await api.get<User>(`/users/${id}`)
    return res.data
  },

  update: async (id: string, data: { name?: string; email?: string; password?: string }) => {
    const res = await api.put<User>(`/users/${id}`, data)
    return res.data
  },
}
