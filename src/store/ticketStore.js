import { create } from 'zustand'

const useTicketStore = create((set, get) => ({
  tickets: [],
  loading: false,
  filters: {
    status: '',
    division: '',
    search: '',
  },

  setTickets: (tickets) => set({ tickets }),
  setLoading: (loading) => set({ loading }),
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
  clearFilters: () =>
    set({ filters: { status: '', division: '', search: '' } }),

  getFilteredTickets: () => {
    const { tickets, filters } = get()
    return tickets.filter((t) => {
      if (filters.status && t.status !== filters.status) return false
      if (filters.division && t.division !== filters.division) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        return (
          t.requestorName?.toLowerCase().includes(q) ||
          t.brief?.toLowerCase().includes(q) ||
          t.ticketId?.toLowerCase().includes(q) ||
          t.designNeeds?.toLowerCase().includes(q)
        )
      }
      return true
    })
  },

  getStats: () => {
    const { tickets } = get()
    const now = new Date()
    return {
      total: tickets.length,
      ongoing: tickets.filter((t) => ['In Progress', 'Review', 'Revision'].includes(t.status)).length,
      pending: tickets.filter((t) => t.status === 'Pending').length,
      completed: tickets.filter((t) => t.status === 'Done').length,
      overdue: tickets.filter((t) => {
        if (t.status === 'Done') return false
        const d = t.expectedDelivery?.toDate ? t.expectedDelivery.toDate() : t.expectedDelivery ? new Date(t.expectedDelivery) : null
        return d && d < now
      }).length,
    }
  },
}))

export default useTicketStore
