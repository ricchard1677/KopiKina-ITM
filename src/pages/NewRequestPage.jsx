import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { Upload, X, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { createTicket, uploadFile } from '../services/ticketService'
import useAuthStore from '../store/authStore'
import { DIVISIONS, DESIGN_NEEDS } from '../utils/constants'

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function NewRequestPage() {
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const [uploading, setUploading] = useState(false)
  const [refFile, setRefFile] = useState(null)

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      requestorName: profile?.name || '',
      division: profile?.division || '',
      requestDate: new Date().toISOString().split('T')[0],
    },
  })

  async function onSubmit(data) {
    try {
      let referenceUrl = data.referenceUrl || ''

      if (refFile) {
        setUploading(true)
        referenceUrl = await uploadFile(refFile, `references/${Date.now()}_${refFile.name}`)
        setUploading(false)
      }

      await createTicket({
        ...data,
        referenceUrl,
        requestDate: new Date(data.requestDate),
        expectedDelivery: new Date(data.expectedDelivery),
      })

      toast.success('Request submitted successfully!')
      navigate('/requests')
    } catch (e) {
      toast.error('Failed to submit request. Please try again.')
      console.error(e)
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
          <p className="text-xs text-neutral-500 mt-0.5">Submit a design or visual collateral request to the Branding team.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
          {/* Section: Requester Info */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Requestor Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Requestor Name" required error={errors.requestorName?.message}>
                <input className="input" {...register('requestorName', { required: 'Required' })} />
              </Field>
              <Field label="Division" required error={errors.division?.message}>
                <select className="input" {...register('division', { required: 'Required' })}>
                  <option value="">Select division</option>
                  {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Request Date" required error={errors.requestDate?.message}>
                <input type="date" className="input" {...register('requestDate', { required: 'Required' })} />
              </Field>
              <Field label="Expected Delivery Date" required error={errors.expectedDelivery?.message}>
                <input type="date" className="input" {...register('expectedDelivery', { required: 'Required' })} />
              </Field>
            </div>
          </div>

          {/* Section: Brief */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Project Brief</h3>
            <div className="space-y-4">
              <Field label="Context / Brief" required error={errors.brief?.message}>
                <textarea
                  rows={3}
                  className="input resize-none"
                  placeholder="Describe the purpose and context of this request..."
                  {...register('brief', { required: 'Required' })}
                />
              </Field>
              <Field label="Copywriting / Text Content" error={errors.copywriting?.message}>
                <textarea
                  rows={3}
                  className="input resize-none"
                  placeholder="Any specific text, taglines, or copy that should be included..."
                  {...register('copywriting')}
                />
              </Field>
            </div>
          </div>

          {/* Section: Design Specs */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Design Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Design Needs" required error={errors.designNeeds?.message}>
                <select className="input" {...register('designNeeds', { required: 'Required' })}>
                  <option value="">Select type</option>
                  {DESIGN_NEEDS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Size / Dimensions" error={errors.size?.message}>
                <input className="input" placeholder="e.g. A3, 1080x1080px, 3x6m" {...register('size')} />
              </Field>
            </div>
          </div>

          {/* Section: Reference */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Reference Material</h3>
            <div className="space-y-3">
              <Field label="Reference URL" error={errors.referenceUrl?.message}>
                <input
                  className="input"
                  placeholder="https://..."
                  {...register('referenceUrl')}
                />
              </Field>
              <div>
                <label className="label">Upload Reference File</label>
                <div className="border-2 border-dashed border-neutral-200 rounded-lg p-4 text-center hover:border-brand-300 transition-colors">
                  {refFile ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
                      <span className="truncate max-w-xs">{refFile.name}</span>
                      <button type="button" onClick={() => setRefFile(null)} className="text-neutral-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                      <span className="text-xs text-neutral-500">Click to upload reference image or PDF</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => setRefFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="btn-primary"
            >
              {isSubmitting || uploading ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
