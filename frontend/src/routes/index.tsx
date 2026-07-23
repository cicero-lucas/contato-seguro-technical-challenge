import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from './ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { TicketsPage } from '@/pages/tickets/TicketsPage'
import { TicketDetailPage } from '@/pages/tickets/TicketDetailPage'
import { NewTicketPage } from '@/pages/tickets/NewTicketPage'
import { UsersPage } from '@/pages/users/UsersPage'
import { ProfilePage } from '@/pages/users/ProfilePage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/new" element={<NewTicketPage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
