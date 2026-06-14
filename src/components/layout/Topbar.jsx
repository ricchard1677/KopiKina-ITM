import { Menu, Bell, LogOut } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../../services/authService'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const PAGE_TITLES = {
  '/dashboard':   'Dashboard',
  '/requests':    'Requests',
  '/calendar':    'Calendar',
  '/kanban':      'Kanban Board',
  '/assets':      'Brand Assets',
  '/admin/users': 'Manajemen Akun',
}

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { profile } = useAuthStore()

  const title = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] || 'KopiKina CMS'

  async function handleLogout() {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <header className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-1.5 text-neutral-500 hover:text-neutral-700">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-neutral-800">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors relative">
          <Bell className="w-4 h-4" />
        </button>
        <button
          onClick={handleLogout}
          className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
