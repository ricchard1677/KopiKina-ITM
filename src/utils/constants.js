export const DIVISIONS = [
  'PMO',
  'Sales',
  'EP (Internal)',
  'EP Pop Up (External)',
  'Operational',
  'Procurement',
  'HRD',
  'Admin (Branding & Visual)',
]

export const ROLES = {
  ADMIN: 'admin',
  PMO: 'pmo',
  SALES: 'sales',
  EP_INTERNAL: 'ep_internal',
  EP_POPUP: 'ep_popup',
  OPERATIONAL: 'operational',
  PROCUREMENT: 'procurement',
  HRD: 'hrd',
}

export const ROLE_LABELS = {
  admin: 'Admin (Branding & Visual)',
  pmo: 'PMO',
  sales: 'Sales',
  ep_internal: 'EP (Internal)',
  ep_popup: 'EP Pop Up (External)',
  operational: 'Operational',
  procurement: 'Procurement',
  hrd: 'HRD',
}

export const STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  REVISION: 'Revision',
  DONE: 'Done',
}

export const STATUS_COLORS = {
  Pending:     { bg: 'bg-yellow-100',  text: 'text-yellow-700',  dot: 'bg-yellow-400',  calendar: '#f59e0b' },
  'In Progress':{ bg: 'bg-blue-100',   text: 'text-blue-700',    dot: 'bg-blue-400',    calendar: '#3b82f6' },
  Review:      { bg: 'bg-purple-100',  text: 'text-purple-700',  dot: 'bg-purple-400',  calendar: '#8b5cf6' },
  Revision:    { bg: 'bg-orange-100',  text: 'text-orange-700',  dot: 'bg-orange-400',  calendar: '#f97316' },
  Done:        { bg: 'bg-green-100',   text: 'text-green-700',   dot: 'bg-green-400',   calendar: '#22c55e' },
}

export const DESIGN_NEEDS = [
  'Poster',
  'Social Media Post',
  'Banner',
  'Flyer',
  'Logo',
  'Brand Identity',
  'Packaging',
  'Digital Ad',
  'Event Backdrop',
  'Menu Design',
  'Roll Up Banner',
  'Vehicle Wrap',
  'Merchandise',
  'Email Template',
  'PPT Template',
  'Video Thumbnail',
  'Other',
]

export const DEMO_USERS = [
  { email: 'admin@kopikina.id',       password: 'admin123',  role: 'admin',       name: 'Rina Susanti',    division: 'Admin (Branding & Visual)' },
  { email: 'sales@kopikina.id',       password: 'sales123',  role: 'sales',       name: 'Budi Santoso',    division: 'Sales' },
  { email: 'pmo@kopikina.id',         password: 'pmo123',    role: 'pmo',         name: 'Dewi Rahayu',     division: 'PMO' },
  { email: 'hrd@kopikina.id',         password: 'hrd123',    role: 'hrd',         name: 'Arif Wibowo',     division: 'HRD' },
  { email: 'operational@kopikina.id', password: 'ops123',    role: 'operational', name: 'Siti Nurhaliza',  division: 'Operational' },
]
