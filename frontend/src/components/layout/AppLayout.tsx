import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Ticket,
  Users,
  User,
  LogOut,
  Menu,
  X,
  HeadphonesIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/users', label: 'Usuários', icon: Users },
  { to: '/profile', label: 'Perfil', icon: User },
]

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-white border-r border-gray-200 transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <HeadphonesIcon className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Triagem</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-3 px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-gray-600" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <HeadphonesIcon className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Triagem</span>
          </div>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="ml-auto text-gray-500">
              <X className="h-5 w-5" />
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
