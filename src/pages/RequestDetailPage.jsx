import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Edit2, Trash2, ExternalLink, Calendar, User,
  MessageSquare, Upload, Save, X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useTicketStore from '../store/ticketStore'
import useAuthStore from '../store/authStore'
import { updateTicket, deleteTicket, uploadFile } from '../services/ticketService'
import StatusBadge from '../components/common/StatusBadge'
import { formatDate, formatDateTime, isOverdue } from '../utils/helpers'
import { STATUS } from '../utils/constants'

function InfoRow({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4">
      <dt className="text-xs font-semibold text-neutral-500 w-36 flex-shrink-0 mb-0.5 sm:mb-0 sm:pt-0.5">{label}</dt>
      <dd className="text-sm text-neutral-700 flex-1">{children || <span className="text-neutral-300">—</span>}</dd>
    </div>
  )
}

export default function RequestDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tickets } = useTicketStore()
  const { profile } = useAuthStore()
  const ticket = tickets.find((t) => t.id === id)

  const isAdmin = profile?.role === 'admin'
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [finalFile, setFinalFile] = useState(null)
  const [saving, setSaving] = useState(false)

  if (!ticket) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500 mb-4">Ticket not found.</p>
        <Link to="/requests" className="btn-primary">Back to Requests</Link>
      </div>
    )
  }

  function startEdit() {
    setForm({
      status: ticket.status,
      picCreator: ticket.picCreator || '',
      picContact: ticket.picContact || '',
      notes: ticket.notes || '',
      finalProjectLink: ticket.finalProjectLink || '',
    })
    setEditing(true)
  }

  async function saveEdit() {
    setSaving(true)
    try {
      let data = { ...form }
      if (finalFile) {
        const url = await uploadFile(finalFile, `finals/${ticket.id}/${Date.now()}_${finalFile.name}`)
        data.finalProjectLink = url
      }
      await updateTicket(id, data)
      toast.success('Ticket updated!')
      setEditing(false)
      setFinalFile(null)
    } catch (e) {
      toast.error('Update failed. Try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this ticket permanently?')) return
    await deleteTicket(id)
    toast.success('Ticket deleted')
    navigate('/requests')
  }

  const overdue = isOverdue(ticket.expectedDelivery, ticket.status)

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="btn-ghost">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex gap-2">
          {isAdmin && !editing && (
            <>
              <button onClick={startEdit} className="btn-secondary">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={handleDelete} className="btn-secondary text-red-500 hover:bg-red-50 border-red-100">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {editing && (
            <>
              <button onClick={() => setEditing(false)} className="btn-secondary">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button onClick={saveEdit} disabled={saving} className="btn-primary">
                <Save className="w-3.5 h-3.5" /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Header card */}
      <div className="card px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-neutral-400">{ticket.ticketId}</span>
              {overdue && <span className="badge bg-red-100 text-red-600 text-[10px]">Overdue</span>}
            </div>
            <h2 className="text-lg font-bold text-neutral-800">{ticket.designNeeds}</h2>
            <p className="text-sm text-neutral-500 mt-0.5">{ticket.division} · {ticket.requestorName}</p>
          </div>
          {editing ? (
            <select
              className="input w-auto"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              {Object.values(STATUS).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <StatusBadge status={ticket.status} size="lg" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card px-6 py-5">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">Request Details</h3>
            <dl className="space-y-3">
              <InfoRow label="Request Date">{formatDate(ticket.requestDate)}</InfoRow>
              <InfoRow label="Expected Delivery">{formatDate(ticket.expectedDelivery)}</InfoRow>
              <InfoRow label="Design Type">{ticket.designNeeds}</InfoRow>
              <InfoRow label="Size">{ticket.size}</InfoRow>
              <InfoRow label="Brief">
                <span className="whitespace-pre-line">{ticket.brief}</span>
              </InfoRow>
              <InfoRow label="Copywriting">
                <span className="whitespace-pre-line">{ticket.copywriting}</span>
              </InfoRow>
              <InfoRow label="Reference">
                {ticket.referenceUrl ? (
                  <a href={ticket.referenceUrl} target="_blank" rel="noopener noreferrer"
                    className="text-brand-600 hover:underline inline-flex items-center gap-1 text-sm">
                    View Reference <ExternalLink className="w-3 h-3" />
                  </a>
                ) : null}
              </InfoRow>
            </dl>
          </div>

          {/* Final output */}
          <div className="card px-6 py-5">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">Final Delivery</h3>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="label">Final Project Link</label>
                  <input
                    className="input"
                    placeholder="https://drive.google.com/..."
                    value={form.finalProjectLink}
                    onChange={(e) => setForm((f) => ({ ...f, finalProjectLink: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Upload Final File</label>
                  <div className="border-2 border-dashed border-neutral-200 rounded-lg p-3 text-center hover:border-brand-300">
                    {finalFile ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
                        <span className="truncate">{finalFile.name}</span>
                        <button type="button" onClick={() => setFinalFile(null)}>
                          <X className="w-4 h-4 text-neutral-400" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-4 h-4 text-neutral-400 mx-auto mb-1" />
                        <span className="text-xs text-neutral-400">Upload final design file</span>
                        <input type="file" className="hidden" onChange={(e) => setFinalFile(e.target.files?.[0])} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ) : ticket.finalProjectLink ? (
              <a href={ticket.finalProjectLink} target="_blank" rel="noopener noreferrer"
                className="btn-primary inline-flex">
                <ExternalLink className="w-4 h-4" /> View Final Project
              </a>
            ) : (
              <p className="text-sm text-neutral-400">No final file uploaded yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="card px-5 py-4">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">PIC Creator</h3>
            {editing ? (
              <div className="space-y-2">
                <div>
                  <label className="label">Name</label>
                  <input
                    className="input"
                    value={form.picCreator}
                    onChange={(e) => setForm((f) => ({ ...f, picCreator: e.target.value }))}
                    placeholder="Designer name"
                  />
                </div>
                <div>
                  <label className="label">Contact (WA/Email)</label>
                  <input
                    className="input"
                    value={form.picContact}
                    onChange={(e) => setForm((f) => ({ ...f, picContact: e.target.value }))}
                    placeholder="+62..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                {ticket.picCreator ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-brand-600" />
                      </div>
                      <span className="text-sm font-medium text-neutral-700">{ticket.picCreator}</span>
                    </div>
                    {ticket.picContact && (
                      <p className="text-xs text-neutral-500 pl-9">{ticket.picContact}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-neutral-400">Not assigned yet</p>
                )}
              </div>
            )}
          </div>

          <div className="card px-5 py-4">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Notes</h3>
            {editing ? (
              <textarea
                rows={4}
                className="input resize-none"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Internal notes for the team..."
              />
            ) : (
              <p className="text-sm text-neutral-600 whitespace-pre-line">
                {ticket.notes || <span className="text-neutral-400">No notes yet.</span>}
              </p>
            )}
          </div>

          <div className="card px-5 py-4">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <Calendar className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-neutral-500">Created</div>
                  <div className="font-medium text-neutral-700">{formatDateTime(ticket.createdAt)}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <Calendar className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-neutral-500">Last Updated</div>
                  <div className="font-medium text-neutral-700">{formatDateTime(ticket.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
