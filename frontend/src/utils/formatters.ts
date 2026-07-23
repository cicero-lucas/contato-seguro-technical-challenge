import type { Channel, Status, Priority } from '@/types'

export const channelLabel: Record<Channel, string> = {
  ouvidoria: 'Ouvidoria',
  sac: 'SAC',
  suporte_tecnico: 'Suporte Técnico',
  financeiro: 'Financeiro',
  fora_do_escopo: 'Fora do Escopo',
}

export const channelVariant: Record<Channel, 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'> = {
  ouvidoria: 'destructive',
  sac: 'default',
  suporte_tecnico: 'warning',
  financeiro: 'success',
  fora_do_escopo: 'secondary',
}

export const statusLabel: Record<Status, string> = {
  aberto: 'Aberto',
  em_atendimento: 'Em Atendimento',
  resolvido: 'Resolvido',
}

export const statusVariant: Record<Status, 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'> = {
  aberto: 'warning',
  em_atendimento: 'default',
  resolvido: 'success',
}

export const priorityLabel: Record<Priority, string> = {
  ALTA: 'Alta',
  MEDIA: 'Média',
  BAIXA: 'Baixa',
}

export const priorityVariant: Record<Priority, 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'> = {
  ALTA: 'destructive',
  MEDIA: 'warning',
  BAIXA: 'secondary',
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
