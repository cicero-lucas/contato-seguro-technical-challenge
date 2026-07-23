import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Ticket, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react'
import { useTickets } from '@/hooks/useTickets'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner, ErrorState } from '@/components/ui/states'
import { channelLabel, channelVariant, statusLabel, statusVariant, formatDate } from '@/utils/formatters'

function StatCard({ title, value, icon: Icon, color }: {
  title: string
  value: number
  icon: React.ElementType
  color: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const { data: tickets, isLoading, isError } = useTickets()
  const user = useAuthStore((s) => s.user)

  const stats = useMemo(() => {
    if (!tickets) return { total: 0, aberto: 0, em_atendimento: 0, resolvido: 0 }
    return {
      total: tickets.length,
      aberto: tickets.filter((t) => t.status === 'aberto').length,
      em_atendimento: tickets.filter((t) => t.status === 'em_atendimento').length,
      resolvido: tickets.filter((t) => t.status === 'resolvido').length,
    }
  }, [tickets])

  const recent = useMemo(() => tickets?.slice(0, 5) ?? [], [tickets])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Bem-vindo, {user?.name}</p>
        </div>
        <Button asChild>
          <Link to="/tickets/new">
            <Plus className="h-4 w-4" />
            Novo Ticket
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Tickets" value={stats.total} icon={Ticket} color="bg-blue-600" />
        <StatCard title="Abertos" value={stats.aberto} icon={AlertCircle} color="bg-yellow-500" />
        <StatCard title="Em Atendimento" value={stats.em_atendimento} icon={Clock} color="bg-blue-500" />
        <StatCard title="Resolvidos" value={stats.resolvido} icon={CheckCircle} color="bg-green-500" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tickets Recentes</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/tickets">Ver todos</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSpinner />}
          {isError && <ErrorState />}
          {!isLoading && !isError && recent.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">Nenhum ticket encontrado.</p>
          )}
          {!isLoading && recent.length > 0 && (
            <div className="divide-y divide-gray-100">
              {recent.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-lg transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{ticket.message}</p>
                    <p className="text-xs text-gray-400">{ticket.user.name} · {formatDate(ticket.createdAt)}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-2 shrink-0">
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
