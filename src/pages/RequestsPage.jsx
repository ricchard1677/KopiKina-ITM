import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Download, X } from 'lucide-react'
import useTicketStore from '../store/ticketStore'
import useAuthStore from '../store/authStore'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'
import { formatDate, isOverdue, downloadCSV } from '../utils/helpers'
import { STATUS, DIVISIONS } from '../utils/constants'

export default function RequestsPage() {
  const { filters, setFilter, clearFilters, getFilteredTickets, loading } = useTicketStore()
  const { profile } = useAuthStore()
  const tickets = getFilteredTickets()

  function handleExport() {
    const data = tickets.map((t) => ({
      'Ticket ID': t.ticketId,
      'Requestor': t.requestorName,
      'Division': t.division,
      'Design Needs': t.designNeeds,
      'Status': t.status,
      'Request Date': formatDate(t.requestDate),
      'Expected Delivery': formatDate(t.expectedDelivery),
      'PIC Creator': t.picCreator || '-',
    }))
    downloadCSV(data, `requests-export-${Date.now()}.csv`)
  }

  const hasFilters = filters.status || filters.division || filters.search

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            className="input pl-9"
            placeholder="Search tickets, requestor, design..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            className="input w-auto text-sm"
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
          >
            <option value="">All Status</option>
            {Object.values(STATUS).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {profile?.role === 'admin' && (
            <select
              className="input w-auto text-sm"
              value={filters.division}
              onChange={(e) => setFilter('division', e.target.value)}
            >
              <option value="">All Divisions</option>
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}
          {hasFilters && (
            <button onClick={clearFilters} className="btn-ghost text-red-500 hover:bg-red-50">
              <X className="w-3.5 h-3.5" />Clear
            </button>
          )}
          <button onClick={handleExport} className="btn-secondary">
            <Download className="w-3.5 h-3.5" />CSV
          </button>
          <Link to="/requests/new" className="btn-primary">
            <Plus className="w-4 h-4" />New
          </Link>
        </div>
      </div>

      {/* Count */}
      <div className="text-xs text-neutral-500">
        Showing <strong>{tickets.length}</strong> request{tickets.length !== 1 ? 's' : ''}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-neutral-400">Loading requests…</div>
        ) : tickets.length === 0 ? (
          <EmptyState
            title="No requests found"
            description="Try adjusting your filters or create a new request."
            action={<Link to="/requests/new" className="btn-primary">Create Request</Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  {['Ticket ID', 'Design Needs', 'Requestor', 'Division', 'Status', 'Expected Delivery', 'PIC', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-neutral-500 px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="px-4 py-3 font-mono text-xs text-neutral-500 whitespace-nowrap">{t.ticketId}</td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <div className="font-medium text-neutral-700 truncate">{t.designNeeds}</div>
                      <div className="text-[11px] text-neutral-400 truncate">{t.brief}</div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{t.requestorName}</td>
                    <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap">{t.division}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={t.status} />
                      {isOverdue(t.expectedDelivery, t.status) && (
                        <span className="ml-1 badge bg-red-100 text-red-600 text-[10px]">Overdue</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap">
                      {formatDate(t.expectedDelivery)}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap">
                      {t.picCreator || <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/requests/${t.id}`}
                        className="text-xs font-medium text-brand-600 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
