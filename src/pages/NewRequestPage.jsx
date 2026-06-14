import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Upload, X, FileText, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import { createTicket } from '../services/ticketService'
import { uploadToCloudinary, formatFileSize } from '../services/cloudinaryService'
import useAuthStore from '../store/authStore'
import { DIVISIONS, DESIGN_NEEDS } from '../utils/constants'

function Field({ label, error, required, hint, children }) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-neutral-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function FileUploadBox({ label, hint, file, onFile, onClear, accept = 'image/*,.pdf,.ai,.psd,.zip' }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className={`border-2 border-dashed rounded-lg p-4 transition-colors ${file ? 'border-brand-300 bg-brand-50/30' : 'border-neutral-200 hover:border-brand-300'}`}>
        {file ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
              {file.type?.startsWith('image') ? (
                <Image className="w-4 h-4 text-brand-600" />
              ) : (
                <FileText className="w-4 h-4 text-brand-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-neutral-700 truncate">{file.name}</div>
              <div className="text-[11px] text-neutral-400">{formatFileSize(file.size)}</div>
            </div>
            <button type="button" onClick={onClear} className="text-neutral-400 hover:text-red-500 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-1.5">
            <Upload className="w-5 h-5 text-neutral-400" />
            <span className="text-xs text-neutral-500 font-medium">Klik untuk upload</span>
            {hint && <span className="text-[11px] text-neutral-400">{hint}</span>}
            <input type="file" className="hidden" accept={accept} onChange={(e) => onFile(e.target.files?.[0] || null)} />
          </label>
        )}
      </div>
    </div>
  )
}

export default function NewRequestPage() {
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const [refFile, setRefFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      requestorName:  profile?.name || '',
      division:       profile?.division || '',
      requestDate:    new Date().toISOString().split('T')[0],
    },
  })

  const watchedRequestDate = watch('requestDate')
  const minDeliveryDate = (() => {
    if (!watchedRequestDate) return ''
    const d = new Date(watchedRequestDate)
    d.setDate(d.getDate() + 3)
    return d.toISOString().split('T')[0]
  })()

  async function onSubmit(data) {
    try {
      let referenceUrl = data.referenceUrl || ''
      let referenceFileName = ''

      if (refFile) {
        setUploading(true)
        toast.loading('Mengupload file referensi…', { id: 'upload' })
        const result = await uploadToCloudinary(refFile, 'references')
        referenceUrl = result.url
        referenceFileName = result.fileName
        toast.success('File berhasil diupload!', { id: 'upload' })
        setUploading(false)
      }

      await createTicket({
        ...data,
        referenceUrl,
        referenceFileName,
        requestDate:      new Date(data.requestDate),
        expectedDelivery: new Date(data.expectedDelivery),
      })

      toast.success('Request berhasil dikirim!')
      navigate('/requests')
    } catch (e) {
      toast.error('Gagal submit: ' + e.message, { id: 'upload' })
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="card">
        <div className="px-6 py-5 border-b border-neutral-100">
          <h2 className="text-base font-semibold text-neutral-800">New Visual Request</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Submit permintaan desain ke tim Branding & Visual.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">

          {/* Requestor Info */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Informasi Requestor</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nama Requestor" required error={errors.requestorName?.message}>
                <input className="input" {...register('requestorName', { required: 'Wajib diisi' })} />
              </Field>
              <Field label="Divisi" required error={errors.division?.message}>
                <select className="input" {...register('division', { required: 'Wajib diisi' })}>
                  <option value="">Pilih divisi</option>
                  {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Tanggal Request" required error={errors.requestDate?.message}>
                <input type="date" className="input" {...register('requestDate', { required: 'Wajib diisi' })} />
              </Field>
              <Field label="Estimasi Tanggal Selesai" required error={errors.expectedDelivery?.message}
                hint="Minimal 3 hari setelah tanggal request">
                <input type="date" className="input" min={minDeliveryDate}
                  {...register('expectedDelivery', {
                    required: 'Wajib diisi',
                    validate: (v) => {
                      if (!watchedRequestDate || !v) return true
                      const diff = (new Date(v) - new Date(watchedRequestDate)) / 86400000
                      return diff >= 3 || 'Target minimal 3 hari setelah tanggal request'
                    },
                  })} />
              </Field>
            </div>
          </div>

          {/* Brief */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Project Brief</h3>
            <div className="space-y-4">
              <Field label="Konteks / Brief" required error={errors.brief?.message}>
                <textarea rows={3} className="input resize-none"
                  placeholder="Jelaskan tujuan dan konteks request ini..."
                  {...register('brief', { required: 'Wajib diisi' })} />
              </Field>
              <Field label="Copywriting / Teks Konten" error={errors.copywriting?.message}>
                <textarea rows={3} className="input resize-none"
                  placeholder="Teks, tagline, atau copy yang perlu disertakan..."
                  {...register('copywriting')} />
              </Field>
            </div>
          </div>

          {/* Design Specs */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Spesifikasi Desain</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Jenis Desain" required error={errors.designNeeds?.message}>
                <select className="input" {...register('designNeeds', { required: 'Wajib diisi' })}>
                  <option value="">Pilih jenis</option>
                  {DESIGN_NEEDS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Ukuran / Dimensi" error={errors.size?.message}>
                <input className="input" placeholder="cth: A3, 1080x1080px, 3x6m" {...register('size')} />
              </Field>
            </div>
          </div>

          {/* Reference */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Referensi</h3>
            <div className="space-y-4">
              <Field label="Link Referensi" hint="Pinterest, Behance, Google Drive, atau URL gambar">
                <input className="input" placeholder="https://..."
                  {...register('referenceUrl')} />
              </Field>
              <FileUploadBox
                label="Upload File Referensi"
                hint="Gambar, PDF, AI, PSD, ZIP — maks. 10MB"
                file={refFile}
                onFile={setRefFile}
                onClear={() => setRefFile(null)}
                accept="image/*,.pdf,.ai,.psd,.zip,.docx"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={isSubmitting || uploading} className="btn-primary">
              {uploading ? 'Mengupload…' : isSubmitting ? 'Mengirim…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
