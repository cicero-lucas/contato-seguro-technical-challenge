import { api } from './api'
import type { AuthResponse, User } from '@/types'

export const authService = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post<AuthResponse>('/auth/register', data)
    return res.data
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  me: async () => {
    const res = await api.get<User>('/auth/me')
    return res.data
  },
}
