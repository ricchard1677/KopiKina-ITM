import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  TicketCheck, CheckCircle, AlertTriangle, TrendingUp, Plus,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import useTicketStore from '../store/ticketStore'
import useAuthStore from '../store/authStore'
import StatusBadge from '../components/common/StatusBadge'
import { formatDate, timeAgo, isOverdue } from '../utils/helpers'
import { STATUS_COLORS, getAccessLevel } from '../utils/constants'

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
        </div>
      </div>
      <div className="text-2xl font-bold text-neutral-800">{value}</div>
      <div className="text-xs text-neutral-500 mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-neutral-400 mt-1">{sub}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const { tickets } = useTicketStore()
  const { profile } = useAuthStore()
  const access = getAccessLevel(profile?.role)
  const isBrandingOrAdmin = access === 'admin' || access === 'branding'

  // Requester only sees their own division's data in dashboard
  const visibleTickets = useMemo(() =>
    isBrandingOrAdmin
      ? tickets
      : tickets.filter((t) => t.division === profile?.division),
  [tickets, isBrandingOrAdmin, profile])

  const stats = useMemo(() => {
    const now = new Date()
    return {
      total:     visibleTickets.length,
      ongoing:   visibleTickets.filter((t) => ['In Progress', 'Review', 'Revision'].includes(t.status)).length,
      pending:   visibleTickets.filter((t) => t.status === 'Pending').length,
      completed: visibleTickets.filter((t) => t.status === 'Done').length,
      overdue:   visibleTickets.filter((t) => {
        if (t.status === 'Done') return false
        const d = t.expectedDelivery?.toDate ? t.expectedDelivery.toDate() : t.expectedDelivery ? new Date(t.expectedDelivery) : null
        return d && d < now
      }).length,
    }
  }, [visibleTickets])

  const recentTickets = useMemo(() =>
    [...visibleTickets].slice(0, 5),
  [visibleTickets])

  const divisionData = useMemo(() => {
    const counts = {}
    visibleTickets.forEach((t) => {
      const short = t.division?.split(' ')[0] || 'Unknown'
      counts[short] = (counts[short] || 0) + 1
    })
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [visibleTickets])

  const statusData = useMemo(() =>
    Object.entries(STATUS_COLORS).map(([status, c]) => ({
      status,
      count: visibleTickets.filter((t) => t.status === status).length,
      color: c.calendar,
    })),
  [visibleTickets])

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-800">
            Good {getGreeting()}, {profile?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            {isBrandingOrAdmin
              ? 'Overview semua request masuk ke Branding & Visual.'
              : `Menampilkan request dari divisi ${profile?.division}.`}
          </p>
        </div>
        <Link to="/requests/new" className="btn-primary flex-shrink-0">
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={stats.total} icon={TicketCheck} color="bg-brand-50 text-brand-600" />
        <StatCard label="Ongoing" value={stats.ongoing} icon={TrendingUp} color="bg-blue-100 text-blue-600" sub="In Progress + Review" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle} color="bg-green-100 text-green-600" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} color="bg-red-100 text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent activity */}
        <div className="lg:col-span-3 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h3 className="text-sm font-semibold text-neutral-800">Recent Requests</h3>
            <Link to="/requests" className="text-xs text-brand-600 hover:underline font-medium">View all →</Link>
          </div>
          {recentTickets.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">No requests yet</div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {recentTickets.map((t) => (
                <Link
                  key={t.id}
                  to={`/requests/${t.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-neutral-400">{t.ticketId}</span>
                      {isOverdue(t.expectedDelivery, t.status) && (
                        <span className="badge bg-red-100 text-red-600 text-[10px]">Overdue</span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-neutral-700 truncate">{t.designNeeds}</div>
                    <div className="text-xs text-neutral-400">{t.requestorName} · {t.division}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <StatusBadge status={t.status} />
                    <span className="text-[10px] text-neutral-400">{timeAgo(t.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Status chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-neutral-800 mb-4">By Status</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={statusData} barSize={20}>
                <XAxis dataKey="status" tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e7e5e4' }}
                  cursor={{ fill: '#fdf8f0' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-neutral-800 mb-3">By Division</h3>
            <div className="space-y-2">
              {divisionData.slice(0, 5).map(({ name, count }) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="text-xs text-neutral-600 w-20 truncate">{name}</div>
                  <div className="flex-1 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-brand-400 rounded-full"
                      style={{ width: `${(count / Math.max(...divisionData.map(d => d.count))) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium text-neutral-700 w-4 text-right">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
