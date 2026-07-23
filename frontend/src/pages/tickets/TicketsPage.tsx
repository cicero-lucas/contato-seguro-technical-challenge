import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useTickets } from '@/hooks/useTickets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/ui/states'
import { channelLabel, channelVariant, statusLabel, statusVariant, priorityLabel, priorityVariant, formatDate } from '@/utils/formatters'
import type { Channel, Status } from '@/types'

export function TicketsPage() {
  const { data: tickets, isLoading, isError } = useTickets()
  const [search, setSearch] = useState('')
  const [channelFilter, setChannelFilter] = useState<Channel | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all')

  const filtered = useMemo(() => {
    if (!tickets) return []
    return tickets.filter((t) => {
      const matchSearch = t.message.toLowerCase().includes(search.toLowerCase()) ||
        t.user.name.toLowerCase().includes(search.toLowerCase())
      const matchChannel = channelFilter === 'all' || t.channel === channelFilter
      const matchStatus = statusFilter === 'all' || t.status === statusFilter
      return matchSearch && matchChannel && matchStatus
    })
  }, [tickets, search, channelFilter, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-sm text-gray-500">{tickets?.length ?? 0} tickets no total</p>
        </div>
        <Button asChild>
          <Link to="/tickets/new">
            <Plus className="h-4 w-4" />
            Novo Ticket
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por mensagem ou usuário..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={channelFilter} onValueChange={(v) => setChannelFilter(v as Channel | 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os canais</SelectItem>
                <SelectItem value="ouvidoria">Ouvidoria</SelectItem>
                <SelectItem value="sac">SAC</SelectItem>
                <SelectItem value="suporte_tecnico">Suporte Técnico</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="fora_do_escopo">Fora do Escopo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Status | 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading && <LoadingSpinner />}
          {isError && <ErrorState />}
          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState title="Nenhum ticket encontrado" description="Tente ajustar os filtros ou crie um novo ticket." />
          )}
          {!isLoading && filtered.length > 0 && (
            <div className="divide-y divide-gray-100">
              {filtered.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{ticket.message}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {ticket.user.name} · {formatDate(ticket.createdAt)}
                    </p>
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
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
