import { useState, useEffect, useCallback, ReactNode } from 'react'
import { restoreSession, onAuthStateChange, signOut } from './authService'
import type { AuthSession } from './authService'

interface AuthContextValue {
  session: AuthSession | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
}

const AuthContext = (() => {
  let ctx: { value: AuthContextValue | null } = { value: null }
  return {
    get value(): AuthContextValue | null {
      return ctx.value
    },
    set value(v: AuthContextValue | null) {
      ctx.value = v
    },
  }
})()

export function useAuth(): AuthContextValue {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const doSignOut = useCallback(async () => {
    await signOut()
    setSession(null)
  }, [])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const restored = await restoreSession()
        if (mounted) {
          setSession(restored)
          setError(null)
        }
      } catch (e) {
        if (mounted) {
          setError('Sesi tidak dapat dipulihkan. Silakan login kembali.')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const unsubscribe = onAuthStateChange((s) => {
      if (mounted) {
        setSession(s)
        setError(null)
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  return { session, loading, error, signOut: doSignOut }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Simple provider that just renders children.
  // The hook manages its own state; this is a placeholder for future
  // React Context wiring once role resolution (task 1.2) lands.
  return <>{children}</>
}

export default useAuth