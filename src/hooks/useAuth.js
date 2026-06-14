import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
import { getOrCreateProfile } from '../services/authService'
import useAuthStore from '../store/authStore'

export function useAuthListener() {
  const { setUser, setProfile, setLoading, clearAuth } = useAuthStore()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        const profile = await getOrCreateProfile(user)
        setProfile(profile)
      } else {
        clearAuth()
      }
      setLoading(false)
    })
    return unsub
  }, [])
}

export default useAuthStore
