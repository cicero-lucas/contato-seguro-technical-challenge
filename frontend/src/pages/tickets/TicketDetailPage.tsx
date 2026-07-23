import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Calendar, Tag, Activity, Loader2 } from 'lucide-react'
import { useTicket, useUpdateTicketStatus } from '@/hooks/useTickets'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner, ErrorState } from '@/components/ui/states'
import { channelLabel, channelVariant, statusLabel, statusVariant, priorityLabel, priorityVariant, formatDate } from '@/utils/formatters'
import type { Status } from '@/types'

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: ticket, isLoading, isError } = useTicket(id!)
  const { mutate: updateStatus, isPending } = useUpdateTicketStatus()

  if (isLoading) return <LoadingSpinner />
  if (isError || !ticket) return <ErrorState message="Ticket não encontrado." />

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/tickets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Ticket</h1>
          <p className="text-xs text-gray-400 font-mono">{ticket.id}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={priorityVariant[ticket.priority]}>
            {priorityLabel[ticket.priority]}
          </Badge>
          <Badge variant={channelVariant[ticket.channel]}>
            {channelLabel[ticket.channel]}
          </Badge>
          <Badge variant={statusVariant[ticket.status]}>
            {statusLabel[ticket.status]}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Tag className="h-4 w-4 text-gray-400" />
            Mensagem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{ticket.message}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-gray-400" />
              Solicitante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-medium text-gray-900">{ticket.user.name}</p>
            <p className="text-sm text-gray-500">{ticket.user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-gray-400" />
              Datas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Criado em</span>
              <span className="text-gray-900">{formatDate(ticket.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Atualizado em</span>
              <span className="text-gray-900">{formatDate(ticket.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-gray-400" />
            Atualizar Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Select
              value={ticket.status}
              onValueChange={(v) => updateStatus({ id: ticket.id, status: v as Status })}
              disabled={isPending}
            >
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
              </SelectContent>
            </Select>
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
