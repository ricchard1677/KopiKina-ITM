import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthListener } from './hooks/useAuth'
import { useTicketsListener } from './hooks/useTickets'
import useAuthStore from './store/authStore'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import RequestsPage from './pages/RequestsPage'
import NewRequestPage from './pages/NewRequestPage'
import RequestDetailPage from './pages/RequestDetailPage'
import CalendarPage from './pages/CalendarPage'
import AssetsPage from './pages/AssetsPage'
import KanbanPage from './pages/KanbanPage'
import AdminUsersPage from './pages/AdminUsersPage'
import LoadingScreen from './components/common/LoadingScreen'

function AuthenticatedApp() {
  useTicketsListener()
  const { profile } = useAuthStore()
  const isAdmin = profile?.role === 'admin'

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/requests/new" element={<NewRequestPage />} />
        <Route path="/requests/:id" element={<RequestDetailPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/kanban" element={<KanbanPage />} />
        {isAdmin && <Route path="/admin/users" element={<AdminUsersPage />} />}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  useAuthListener()
  const { user, loading } = useAuthStore()

  if (loading) return <LoadingScreen />

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/*"
        element={user ? <AuthenticatedApp /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}
