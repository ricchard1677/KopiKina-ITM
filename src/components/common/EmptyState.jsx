import { FileX } from 'lucide-react'

export default function EmptyState({ title = 'No data found', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        <FileX className="w-7 h-7 text-neutral-400" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-700 mb-1">{title}</h3>
      {description && <p className="text-xs text-neutral-500 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  )
}
