import { useEffect } from 'react'
import { subscribeToTickets } from '../services/ticketService'
import useTicketStore from '../store/ticketStore'
import useAuthStore from '../store/authStore'

export function useTicketsListener() {
  const { profile } = useAuthStore()
  const { setTickets, setLoading } = useTicketStore()

  useEffect(() => {
    if (!profile) return
    setLoading(true)
    const unsub = subscribeToTickets(
      (tickets) => {
        setTickets(tickets)
        setLoading(false)
      },
      profile.role,
      profile.division
    )
    return unsub
  }, [profile])
}

export default useTicketStore
