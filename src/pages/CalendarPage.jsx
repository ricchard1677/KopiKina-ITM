import { useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { useNavigate } from 'react-router-dom'
import useTicketStore from '../store/ticketStore'
import { STATUS_COLORS } from '../utils/constants'
import Modal from '../components/common/Modal'
import StatusBadge from '../components/common/StatusBadge'
import { formatDate } from '../utils/helpers'

function toDateStr(val) {
  if (!val) return null
  const d = val?.toDate ? val.toDate() : new Date(val)
  return d.toISOString().split('T')[0]
}

export default function CalendarPage() {
  const { tickets } = useTicketStore()
  const navigate = useNavigate()
  const [dayTickets, setDayTickets] = useState(null)
  const [dayLabel, setDayLabel] = useState('')

  const events = tickets.flatMap((t) => {
    const color = STATUS_COLORS[t.status]?.calendar || '#a8a29e'
    const items = []
    if (t.requestDate) items.push({
      id: t.id + '-req',
      title: `📋 ${t.designNeeds}`,
      date: toDateStr(t.requestDate),
      backgroundColor: color,
      extendedProps: { ticketId: t.id, type: 'request' },
    })
    if (t.expectedDelivery) items.push({
      id: t.id + '-del',
      title: `🎯 ${t.designNeeds}`,
      date: toDateStr(t.expectedDelivery),
      backgroundColor: '#6366f1',
      extendedProps: { ticketId: t.id, type: 'delivery' },
    })
    return items
  })

  function handleDateClick({ dateStr }) {
    const dayT = tickets.filter((t) => {
      return toDateStr(t.requestDate) === dateStr || toDateStr(t.expectedDelivery) === dateStr
    })
    if (dayT.length > 0) {
      setDayTickets(dayT)
      setDayLabel(new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      }))
    }
  }

  function handleEventClick({ event }) {
    const id = event.extendedProps.ticketId
    navigate(`/requests/${id}`)
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="card px-4 py-3 flex flex-wrap items-center gap-4">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Legend:</span>
        {Object.entries(STATUS_COLORS).map(([status, c]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.calendar }} />
            <span className="text-xs text-neutral-600">{status}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-xs text-neutral-600">Delivery Date</span>
        </div>
      </div>

      <div className="card p-4">
        <FullCalendar
          plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listWeek',
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          eventMaxStack={3}
          dayMaxEvents={3}
        />
      </div>

      {/* Day modal */}
      <Modal
        open={!!dayTickets}
        onClose={() => setDayTickets(null)}
        title={`Requests — ${dayLabel}`}
        size="md"
      >
        <div className="space-y-2">
          {dayTickets?.map((t) => (
            <button
              key={t.id}
              onClick={() => { navigate(`/requests/${t.id}`); setDayTickets(null) }}
              className="w-full text-left card px-4 py-3 hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs text-neutral-400 font-mono mb-0.5">{t.ticketId}</div>
                  <div className="text-sm font-semibold text-neutral-700">{t.designNeeds}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{t.requestorName} · {t.division}</div>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div className="flex gap-4 mt-2 text-[11px] text-neutral-400">
                <span>📋 Request: {formatDate(t.requestDate)}</span>
                <span>🎯 Delivery: {formatDate(t.expectedDelivery)}</span>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
