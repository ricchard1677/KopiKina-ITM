import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, TicketCheck, CalendarDays,
  FolderOpen, Kanban, X, Users,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { ROLE_LABELS } from '../../utils/constants'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/requests',  icon: TicketCheck,     label: 'Requests' },
  { to: '/calendar',  icon: CalendarDays,    label: 'Calendar' },
  { to: '/kanban',    icon: Kanban,          label: 'Kanban Board' },
  { to: '/assets',    icon: FolderOpen,      label: 'Brand Assets' },
]

const ADMIN_NAV = [
  { to: '/admin/users', icon: Users, label: 'Manajemen Akun' },
]

export default function Sidebar({ open, onClose }) {
  const { profile } = useAuthStore()

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-60 bg-white border-r border-neutral-200 flex flex-col
        transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src="/Konten Guideline 2026/Logo Kopikina 2026/Logo Kopikina_FIX-02.png"
              alt="KopiKina"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-neutral-800">KopiKina</div>
            <div className="text-[10px] text-neutral-400 leading-none">Branding & Visual CMS</div>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 text-neutral-400 hover:text-neutral-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}

        {/* Admin-only section */}
        {profile?.role === 'admin' && (
          <div className="pt-3 mt-3 border-t border-neutral-100">
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest px-3 mb-1.5">
              Admin
            </p>
            {ADMIN_NAV.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* User profile */}
      {profile && (
        <div className="px-4 py-4 border-t border-neutral-100">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-neutral-50 border border-neutral-100">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-bold text-base">
                {profile.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-neutral-800 truncate">{profile.name}</div>
              <div className="text-xs text-neutral-400 truncate">
                {ROLE_LABELS[profile.role] || profile.role}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
