import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useNavigate } from 'react-router-dom'
import { Calendar, User } from 'lucide-react'
import toast from 'react-hot-toast'
import useTicketStore from '../store/ticketStore'
import useAuthStore from '../store/authStore'
import { updateTicket } from '../services/ticketService'
import { STATUS, STATUS_COLORS } from '../utils/constants'
import { formatDate, isOverdue } from '../utils/helpers'

const COLUMNS = Object.values(STATUS)

function TicketCard({ ticket, index }) {
  const navigate = useNavigate()
  const overdue = isOverdue(ticket.expectedDelivery, ticket.status)
  const colors = STATUS_COLORS[ticket.status]

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => navigate(`/requests/${ticket.id}`)}
          className={`bg-white rounded-lg border px-3.5 py-3 cursor-pointer transition-all select-none
            ${snapshot.isDragging
              ? 'shadow-lg border-brand-300 rotate-1'
              : 'border-neutral-200 hover:border-brand-200 hover:shadow-card-hover'}
          `}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono text-neutral-400">{ticket.ticketId}</span>
            {overdue && (
              <span className="badge bg-red-100 text-red-500 text-[10px]">Overdue</span>
            )}
          </div>
          <div className="text-sm font-semibold text-neutral-700 mb-1 leading-snug">{ticket.designNeeds}</div>
          <div className="text-xs text-neutral-500 mb-2.5 line-clamp-2">{ticket.brief}</div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{ticket.requestorName}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span>Due {formatDate(ticket.expectedDelivery)}</span>
          </div>
          {ticket.picCreator && (
            <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold text-brand-600">{ticket.picCreator[0]}</span>
              </div>
              <span className="text-[11px] text-neutral-500 truncate">{ticket.picCreator}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}

export default function KanbanPage() {
  const { tickets } = useTicketStore()
  const { profile } = useAuthStore()
  const isAdmin = profile?.role === 'admin'

  async function onDragEnd(result) {
    if (!result.destination) return
    const { draggableId, destination } = result
    const newStatus = destination.droppableId

    if (!isAdmin) {
      toast.error('Only Admins can move tickets.')
      return
    }

    try {
      await updateTicket(draggableId, { status: newStatus })
      toast.success(`Moved to ${newStatus}`)
    } catch {
      toast.error('Failed to update status.')
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1" style={{ minHeight: 'calc(100vh - 140px)' }}>
        {COLUMNS.map((status) => {
          const col = STATUS_COLORS[status]
          const colTickets = tickets.filter((t) => t.status === status)

          return (
            <div key={status} className="flex-shrink-0 w-64 flex flex-col">
              {/* Column header */}
              <div className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl ${col.bg}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className={`text-xs font-semibold ${col.text}`}>{status}</span>
                </div>
                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${col.bg} ${col.text} border border-current/20`}>
                  {colTickets.length}
                </span>
              </div>

              {/* Droppable */}
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-b-xl p-2 space-y-2 min-h-[120px] transition-colors
                      ${snapshot.isDraggingOver ? 'bg-brand-50/50 border-2 border-dashed border-brand-200' : 'bg-neutral-100/60'}
                    `}
                  >
                    {colTickets.map((t, i) => (
                      <TicketCard key={t.id} ticket={t} index={i} />
                    ))}
                    {provided.placeholder}
                    {colTickets.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center py-8 text-xs text-neutral-400">Drop here</div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
