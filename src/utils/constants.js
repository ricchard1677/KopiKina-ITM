export const DIVISIONS = [
  'PMO',
  'Sales',
  'EP (Internal)',
  'EP Pop Up (External)',
  'Operational',
  'Procurement',
  'HRD',
  'Branding & Visual',
]

export const ROLES = {
  ADMIN:       'admin',
  BRANDING:    'branding',
  PMO:         'pmo',
  SALES:       'sales',
  EP_INTERNAL: 'ep_internal',
  EP_POPUP:    'ep_popup',
  OPERATIONAL: 'operational',
  PROCUREMENT: 'procurement',
  HRD:         'hrd',
}

export const ROLE_LABELS = {
  admin:       'Admin',
  branding:    'Tim Branding & Visual',
  pmo:         'PMO',
  sales:       'Sales',
  ep_internal: 'EP (Internal)',
  ep_popup:    'EP Pop Up (External)',
  operational: 'Operational',
  procurement: 'Procurement',
  hrd:         'HRD',
}

// Helper — apakah role ini bisa lihat semua request
export function canSeeAllRequests(role) {
  return role === 'admin' || role === 'branding'
}

// Helper — apakah role ini punya akses menu tertentu
export function getAccessLevel(role) {
  if (role === 'admin')    return 'admin'
  if (role === 'branding') return 'branding'
  return 'requester'
}

export const STATUS = {
  PENDING:     'Pending',
  IN_PROGRESS: 'In Progress',
  REVIEW:      'Review',
  REVISION:    'Revision',
  DONE:        'Done',
}

export const STATUS_COLORS = {
  Pending:      { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400', calendar: '#f59e0b' },
  'In Progress':{ bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400',   calendar: '#3b82f6' },
  Review:       { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-400', calendar: '#8b5cf6' },
  Revision:     { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-400', calendar: '#f97316' },
  Done:         { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-400',  calendar: '#22c55e' },
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
