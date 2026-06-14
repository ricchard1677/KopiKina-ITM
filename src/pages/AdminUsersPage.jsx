import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Edit2, Trash2, X, Save, Users, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  createUserAccount, getAllUsers,
  updateUserProfile, deleteUserProfile,
} from '../services/userService'
import { DIVISIONS, ROLES, ROLE_LABELS } from '../utils/constants'
import Modal from '../components/common/Modal'
import EmptyState from '../components/common/EmptyState'

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))

const ROLE_DIVISION_MAP = {
  admin:       'Branding & Visual',
  branding:    'Branding & Visual',
  pmo:         'PMO',
  sales:       'Sales',
  ep_internal: 'EP (Internal)',
  ep_popup:    'EP Pop Up (External)',
  operational: 'Operational',
  procurement: 'Procurement',
  hrd:         'HRD',
}

function RoleBadge({ role }) {
  const isAdmin = role === 'admin'
  return (
    <span className={`badge text-xs ${isAdmin ? 'bg-brand-100 text-brand-600' : 'bg-neutral-100 text-neutral-600'}`}>
      {ROLE_LABELS[role] || role}
    </span>
  )
}

function CreateUserForm({ onSuccess, onClose }) {
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm()

  const selectedRole = watch('role')
  useEffect(() => {
    if (selectedRole && ROLE_DIVISION_MAP[selectedRole]) {
      setValue('division', ROLE_DIVISION_MAP[selectedRole])
    }
  }, [selectedRole, setValue])

  async function onSubmit(data) {
    try {
      await createUserAccount(data)
      toast.success(`Akun ${data.name} berhasil dibuat!`)
      onSuccess()
    } catch (e) {
      const messages = {
        'auth/invalid-credential':      'Password salah untuk email yang sudah terdaftar.',
        'auth/invalid-email':           'Format email tidak valid.',
        'auth/weak-password':           'Password terlalu lemah, min. 6 karakter.',
        'auth/operation-not-allowed':   'Email/Password sign-in belum diaktifkan. Buka Firebase Console → Authentication → Sign-in method → Email/Password → Enable.',
        'auth/network-request-failed':  'Koneksi gagal. Periksa internet.',
        'auth/configuration-not-found': 'Firebase belum dikonfigurasi. Cek file .env.local.',
      }
      toast.error(messages[e.code] || `Error: ${e.message}`, { duration: 6000 })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label className="label">Nama Lengkap <span className="text-red-400">*</span></label>
        <input className="input" placeholder="Contoh: Budi Santoso"
          {...register('name', { required: 'Wajib diisi' })} />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="label">Email <span className="text-red-400">*</span></label>
        <input className="input" type="email" placeholder="user@kopikina.id"
          {...register('email', { required: 'Wajib diisi' })} />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="label">Password <span className="text-red-400">*</span></label>
        <div className="relative">
          <input className="input pr-10" type={showPw ? 'text' : 'password'} placeholder="Min. 6 karakter"
            {...register('password', { required: 'Wajib diisi', minLength: { value: 6, message: 'Min. 6 karakter' } })} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      {/* Role */}
      <div>
        <label className="label">Role <span className="text-red-400">*</span></label>
        <select className="input" {...register('role', { required: 'Wajib diisi' })}>
          <option value="">Pilih role</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
      </div>

      {/* Division */}
      <div>
        <label className="label">Divisi <span className="text-red-400">*</span></label>
        <select className="input" {...register('division', { required: 'Wajib diisi' })}>
          <option value="">Pilih divisi</option>
          {DIVISIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {errors.division && <p className="text-xs text-red-500 mt-1">{errors.division.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Membuat akun…' : 'Buat Akun'}
        </button>
      </div>
    </form>
  )
}

function EditUserModal({ user, onClose, onSuccess }) {
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name:     user.name,
      email:    user.email,
      role:     user.role,
      division: user.division,
      password: '',
    },
  })

  const selectedRole = watch('role')
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    if (selectedRole && ROLE_DIVISION_MAP[selectedRole]) {
      setValue('division', ROLE_DIVISION_MAP[selectedRole])
    }
  }, [selectedRole, setValue])

  async function onSubmit(data) {
    try {
      const update = {
        name:     data.name,
        email:    data.email,
        role:     data.role,
        division: data.division,
      }
      await updateUserProfile(user.id, update, data.password || null)
      toast.success('Profil berhasil diperbarui!')
      onSuccess()
      onClose()
    } catch (e) {
      toast.error('Gagal memperbarui: ' + e.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nama */}
      <div>
        <label className="label">Nama Lengkap <span className="text-red-400">*</span></label>
        <input className="input" {...register('name', { required: 'Wajib diisi' })} />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="label">Email <span className="text-red-400">*</span></label>
        <input className="input" type="email" {...register('email', { required: 'Wajib diisi' })} />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        <p className="text-[11px] text-neutral-400 mt-1">
          ⚠ Perubahan email hanya tersimpan di profil. Untuk update login email, lakukan di Firebase Console.
        </p>
      </div>

      {/* Password baru (opsional) */}
      <div>
        <label className="label">Password Baru <span className="text-neutral-400 font-normal">(kosongkan jika tidak diubah)</span></label>
        <div className="relative">
          <input
            className="input pr-10"
            type={showPw ? 'text' : 'password'}
            placeholder="Min. 6 karakter"
            {...register('password', {
              minLength: { value: 6, message: 'Min. 6 karakter' },
            })}
          />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        <p className="text-[11px] text-neutral-400 mt-1">
          ⚠ Reset password hanya tersimpan di catatan. Gunakan Firebase Console untuk update password login.
        </p>
      </div>

      {/* Role */}
      <div>
        <label className="label">Role <span className="text-red-400">*</span></label>
        <select className="input" {...register('role', { required: 'Wajib diisi' })}>
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
      </div>

      {/* Divisi */}
      <div>
        <label className="label">Divisi <span className="text-red-400">*</span></label>
        <select className="input" {...register('division', { required: 'Wajib diisi' })}>
          {DIVISIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {errors.division && <p className="text-xs text-red-500 mt-1">{errors.division.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Menyimpan…' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editUser, setEditUser] = useState(null)

  async function fetchUsers() {
    setLoading(true)
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch {
      toast.error('Gagal memuat daftar user.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  async function handleDelete(user) {
    if (!confirm(`Hapus akun ${user.name}? Akun di Firebase Auth tidak ikut terhapus.`)) return
    try {
      await deleteUserProfile(user.id)
      toast.success('Profil dihapus.')
      fetchUsers()
    } catch {
      toast.error('Gagal menghapus.')
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-800">Manajemen Akun</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Buat dan kelola akun user beserta role & divisi.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Buat Akun
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(ROLE_LABELS).map(([role, label]) => {
          const count = users.filter((u) => u.role === role).length
          return (
            <div key={role} className="card px-4 py-3">
              <div className="text-xl font-bold text-neutral-800">{count}</div>
              <div className="text-[11px] text-neutral-500 truncate">{label}</div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-neutral-400">Memuat data…</div>
        ) : users.length === 0 ? (
          <EmptyState
            title="Belum ada user"
            description="Buat akun pertama untuk memulai."
            action={
              <button onClick={() => setShowCreate(true)} className="btn-primary">
                Buat Akun
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  {['Nama', 'Email', 'Role', 'Divisi', 'Aksi'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-neutral-500 px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-xs">
                            {u.name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-neutral-700">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">{u.email}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">{u.division}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditUser(u)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Buat Akun Baru">
        <CreateUserForm
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); fetchUsers() }}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit Profil User">
        {editUser && (
          <EditUserModal
            user={editUser}
            onClose={() => setEditUser(null)}
            onSuccess={fetchUsers}
          />
        )}
      </Modal>
    </div>
  )
}
