import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

const ADMIN_EMAIL = 'bood68155@gmail.com'
const ADMIN_PASSWORD = '123123'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!session

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Exclusive admin fallback login
  const signInWithAdminFallback = useCallback(async (email, password) => {
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Try Supabase first
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (!error) return data
      } catch (_) { /* fall through to fallback */ }

      // Fallback: create a mock session for admin
      const mockUser = {
        id: 'admin-fallback',
        email: ADMIN_EMAIL,
        user_metadata: {
          full_name: 'Abdelrahman Osama',
          name: 'Abood',
        },
      }
      const mockSession = { user: mockUser, access_token: 'admin-fallback' }
      setUser(mockUser)
      setSession(mockSession)
      setLoading(false)
      return { user: mockUser }
    }
    // Regular user — try Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }, [])

  const signIn = useCallback(async (email, password) => {
    return signInWithAdminFallback(email, password)
  }, [signInWithAdminFallback])

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
    return data
  }, [])

  const logout = useCallback(async () => {
    // Clear fallback session
    if (session?.access_token === 'admin-fallback') {
      setUser(null)
      setSession(null)
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [session])

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email
    || 'User'

  const avatarUrl = user?.user_metadata?.avatar_url || null

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        loading,
        displayName,
        avatarUrl,
        signUp,
        signIn,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
