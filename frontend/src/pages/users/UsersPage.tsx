import { useState, useMemo } from 'react'
import { Search, Users } from 'lucide-react'
import { useUsers } from '@/hooks/useUsers'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/ui/states'
import { formatDate } from '@/utils/formatters'

export function UsersPage() {
  const { data: users, isLoading, isError } = useUsers()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!users) return []
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <p className="text-sm text-gray-500">{users?.length ?? 0} usuários cadastrados</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading && <LoadingSpinner />}
          {isError && <ErrorState />}
          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState title="Nenhum usuário encontrado" />
          )}
          {!isLoading && filtered.length > 0 && (
            <div className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <div key={user.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-gray-400">Cadastrado em</p>
                    <p className="text-xs text-gray-600">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && filtered.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="h-4 w-4" />
          <span>{filtered.length} usuário{filtered.length !== 1 ? 's' : ''} exibido{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  )
}
