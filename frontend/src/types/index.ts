export type Channel =
  | 'ouvidoria'
  | 'sac'
  | 'suporte_tecnico'
  | 'financeiro'
  | 'fora_do_escopo'

export type Status = 'aberto' | 'em_atendimento' | 'resolvido'

export type Priority = 'ALTA' | 'MEDIA' | 'BAIXA'

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Ticket {
  id: string
  message: string
  channel: Channel
  status: Status
  priority: Priority
  userId: string
  createdAt: string
  updatedAt: string
  user: Pick<User, 'id' | 'name' | 'email'>
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  status: 'error'
  message: string
  errors?: { field: string; message: string }[]
}
