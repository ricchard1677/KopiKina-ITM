import { STATUS_COLORS } from '../../utils/constants'

export default function StatusBadge({ status, size = 'sm' }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS['Pending']
  const sizeClass = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'

  return (
    <span className={`badge ${colors.bg} ${colors.text} ${sizeClass} font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} mr-1.5`} />
      {status}
    </span>
  )
}
