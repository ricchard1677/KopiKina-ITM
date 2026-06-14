import { useState } from 'react'
import {
  FolderOpen, Download, ExternalLink, Image, FileText,
  Search, Plus, Upload, X,
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { uploadFile } from '../services/ticketService'

const STATIC_ASSETS = [
  {
    category: 'Logo Files',
    items: [
      { name: 'KopiKina Logo — Version 01 (PNG)', type: 'png', size: '—', url: '/Konten Guideline 2026/Logo Kopikina 2026/Logo Kopikina_FIX-01.png', preview: true },
      { name: 'KopiKina Logo — Version 02 (PNG)', type: 'png', size: '—', url: '/Konten Guideline 2026/Logo Kopikina 2026/Logo Kopikina_FIX-02.png', preview: true },
      { name: 'KopiKina Logo — Version 03 (PNG)', type: 'png', size: '—', url: '/Konten Guideline 2026/Logo Kopikina 2026/Logo Kopikina_FIX-03.png', preview: true },
      { name: 'KopiKina Logo — Version 04 (PNG)', type: 'png', size: '—', url: '/Konten Guideline 2026/Logo Kopikina 2026/Logo Kopikina_FIX-04.png', preview: true },
    ],
  },
  {
    category: 'Brand Guidelines',
    items: [
      { name: 'Kopikina Brief Content Guideline 2026 (PDF)', type: 'pdf', size: '—', url: '/Konten Guideline 2026/Kopikina Brief Content Guideline 2026_2.pdf' },
      { name: 'Feeds Guide 4:5 (PNG)', type: 'png', size: '—', url: '/Konten Guideline 2026/Grafis Guide 2026/Guide FEEDS 4_5.png', preview: true },
      { name: 'IGS Guide 2026 (PNG)', type: 'png', size: '—', url: '/Konten Guideline 2026/Kopikina IGS Guide 2026/IGS Guide 2026.png', preview: true },
      { name: 'Reels & TikTok Safe Zone Guide (PNG)', type: 'png', size: '—', url: '/Konten Guideline 2026/Kopikina Guide Reels & TikTok 2026/Guide Safe Zone Reels & TikTok.png', preview: true },
    ],
  },
  {
    category: 'Templates',
    items: [
      { name: 'Social Media Template Pack (AI) — Upload to Firebase Storage', type: 'ai', size: 'Upload needed', url: '#' },
      { name: 'Presentation Template (PPTX) — Upload to Firebase Storage', type: 'pptx', size: 'Upload needed', url: '#' },
      { name: 'Event Banner Template (PSD) — Upload to Firebase Storage', type: 'psd', size: 'Upload needed', url: '#' },
    ],
  },
  {
    category: 'Brand Colors 2026',
    items: [],
    colors: [
      { name: 'Attacus Red',   hex: '#AB1F27', role: 'Primary Color' },
      { name: 'Golden Yellow', hex: '#C38D2C', role: 'Secondary Color' },
      { name: 'Bone White',    hex: '#E4E0DA', role: 'Secondary Color' },
      { name: 'Black Perfect', hex: '#000013', role: 'Secondary Color' },
    ],
  },
]

const TYPE_ICONS = {
  pdf: '📄', svg: '🖼️', png: '🖼️', ai: '🎨', psd: '🎨', pptx: '📊', html: '💻', ico: '🔷',
}

export default function AssetsPage() {
  const { profile } = useAuthStore()
  const isAdmin = profile?.role === 'admin'
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadFile(file, `brand-assets/${Date.now()}_${file.name}`)
      toast.success(`${file.name} uploaded to brand assets!`)
    } catch {
      toast.error('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const filtered = search
    ? STATIC_ASSETS.map((cat) => ({
        ...cat,
        items: cat.items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())),
      })).filter((cat) => cat.items.length > 0 || cat.colors)
    : STATIC_ASSETS

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            className="input pl-9"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isAdmin && (
          <label className={`btn-primary cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading…' : 'Upload Asset'}
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        )}
      </div>

      {/* Info banner */}
      <div className="rounded-xl bg-brand-50 border border-brand-100 px-4 py-3 flex items-start gap-3">
        <FolderOpen className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-brand-700">Centralized Brand Asset Library</p>
          <p className="text-xs text-brand-600 mt-0.5">
            These files should be used as references when submitting design requests. Ensure all visuals follow our brand guidelines.
          </p>
        </div>
      </div>

      {/* Asset categories */}
      {filtered.map((cat) => (
        <div key={cat.category}>
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">{cat.category}</h3>

          {/* Color swatches */}
          {cat.colors && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {cat.colors.map((c) => (
                <div key={c.hex} className="card overflow-hidden">
                  <div className="h-16" style={{ background: c.hex }} />
                  <div className="px-3 py-2">
                    <div className="text-xs font-semibold text-neutral-700">{c.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{c.hex}</div>
                    <div className="text-[10px] text-neutral-400">{c.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* File list */}
          {cat.items.length > 0 && (
            <div className="card overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {cat.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors">
                    <span className="text-xl">{TYPE_ICONS[item.type] || '📁'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-neutral-700 truncate">{item.name}</div>
                      <div className="text-xs text-neutral-400">{item.size} · {item.type.toUpperCase()}</div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <a href={item.url} className="btn-ghost text-neutral-500">
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      {item.preview && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-neutral-500">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
