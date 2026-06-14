import { format, formatDistanceToNow, isAfter, isBefore, startOfDay } from 'date-fns'

export function formatDate(date) {
  if (!date) return '-'
  const d = date?.toDate ? date.toDate() : new Date(date)
  return format(d, 'dd MMM yyyy')
}

export function formatDateTime(date) {
  if (!date) return '-'
  const d = date?.toDate ? date.toDate() : new Date(date)
  return format(d, 'dd MMM yyyy, HH:mm')
}

export function timeAgo(date) {
  if (!date) return '-'
  const d = date?.toDate ? date.toDate() : new Date(date)
  return formatDistanceToNow(d, { addSuffix: true })
}

export function isOverdue(expectedDelivery, status) {
  if (status === 'Done') return false
  if (!expectedDelivery) return false
  const d = expectedDelivery?.toDate ? expectedDelivery.toDate() : new Date(expectedDelivery)
  return isBefore(d, startOfDay(new Date()))
}

export function generateTicketId(index) {
  const prefix = 'BVD'
  const num = String(index).padStart(4, '0')
  const year = new Date().getFullYear()
  return `${prefix}-${year}-${num}`
}

export function downloadCSV(data, filename) {
  if (!data.length) return
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h] ?? ''
        return `"${String(val).replace(/"/g, '""')}"`
      }).join(',')
    ),
  ]
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
