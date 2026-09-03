import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

const ADMIN_EMAIL = 'bood68155@gmail.com'
const ADMIN_PASSWORD = '123123'
const AVATAR_STORAGE_BUCKET = 'portfolio-assets'

// Default profile image — primary fallback whenever no custom image has been
// saved via Supabase/localStorage yet (Hero avatar card, Admin settings, Navbar)
export const DEFAULT_PROFILE_IMAGE_URL = 'https://i.postimg.cc/25y56YBK/5769588586045968051-121.jpg'
// Primary localStorage key for the profile image (instant display + offline fallback)
const AVATAR_LOCALSTORAGE_KEY = 'admin_profile_image'
// Legacy key kept so previously cached avatars keep working after the rename
const LEGACY_AVATAR_LOCALSTORAGE_KEY = 'abood_profile_avatar'
// Database persistence — the settings table is the source of truth for all visitors
const SETTINGS_TABLE = 'settings'
const PROFILE_IMAGE_SETTING_KEY = 'profile_image_url'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  // Persisted avatar URL — used across all components
  const [profileAvatar, setProfileAvatar] = useState(() => {
    try {
      return localStorage.getItem(AVATAR_LOCALSTORAGE_KEY)
        || localStorage.getItem(LEGACY_AVATAR_LOCALSTORAGE_KEY)
        || null
    } catch { return null }
  })

  // Write the avatar to both storage keys so new and legacy readers stay in sync
  const persistAvatarLocally = useCallback((url) => {
    try {
      localStorage.setItem(AVATAR_LOCALSTORAGE_KEY, url)
      localStorage.setItem(LEGACY_AVATAR_LOCALSTORAGE_KEY, url)
    } catch { /* storage unavailable */ }
  }, [])

  // Load the saved profile image from the database on initial app load so
  // returning visitors (and admins on a fresh device) always see the photo
  useEffect(() => {
    let cancelled = false
    const fetchSavedAvatar = async () => {
      try {
        const { data, error } = await supabase
          .from(SETTINGS_TABLE)
          .select('value')
          .eq('key', PROFILE_IMAGE_SETTING_KEY)
          .maybeSingle()
        if (error) {
          // settings table/policies not created yet — keep local/metadata fallback
          console.warn('Profile image DB fetch skipped:', error.message)
          return
        }
        if (cancelled) return
        if (data?.value) {
          setProfileAvatar(data.value)
          persistAvatarLocally(data.value)
        }
      } catch (err) {
        console.warn('Profile image DB fetch failed:', err.message)
      }
    }
    fetchSavedAvatar()
    return () => { cancelled = true }
  }, [persistAvatarLocally])

  const isAuthenticated = !!session

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      // If user has avatar in metadata, use it as a fallback (DB row wins above)
      const metaAvatar = currentSession?.user?.user_metadata?.avatar_url
      if (metaAvatar) {
        setProfileAvatar((prev) => prev || metaAvatar)
        persistAvatarLocally(metaAvatar)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        const metaAvatar = currentSession?.user?.user_metadata?.avatar_url
        if (metaAvatar) {
          setProfileAvatar((prev) => prev || metaAvatar)
          persistAvatarLocally(metaAvatar)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Upload profile avatar to Supabase Storage and update user metadata
  const updateAvatar = useCallback(async (file) => {
    const ext = file.name.split('.').pop() || 'png'
    const fileName = `avatars/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    // Try uploading to Supabase Storage
    let publicUrl = null
    try {
      const { data, error } = await supabase.storage
        .from(AVATAR_STORAGE_BUCKET)
        .upload(fileName, file, { cacheControl: '31536000', upsert: false })

      if (!error && data) {
        const { data: urlData } = supabase.storage.from(AVATAR_STORAGE_BUCKET).getPublicUrl(data.path)
        publicUrl = urlData?.publicUrl || null
      }
    } catch (err) {
      console.warn('Storage upload failed:', err)
    }

    // Fallback: use Base64 data URL
    if (!publicUrl) {
      publicUrl = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(file)
      })
    }

    if (!publicUrl) throw new Error('Failed to upload avatar')

    // Persist in the database (settings table) — source of truth so the image
    // survives refresh/logout and is visible to returning visitors on any device
    try {
      const { error } = await supabase
        .from(SETTINGS_TABLE)
        .upsert({
          key: PROFILE_IMAGE_SETTING_KEY,
          value: publicUrl,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' })
      if (error) console.warn('DB avatar persistence failed:', error.message)
    } catch (err) {
      console.warn('DB avatar persistence error:', err.message)
    }

    // Update Supabase user_metadata
    try {
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      })
      if (error) console.warn('Metadata update failed:', error.message)
    } catch (err) {
      console.warn('Metadata update error:', err)
    }

    // Update local state and localStorage (instant UI + offline fallback)
    setProfileAvatar(publicUrl)
    persistAvatarLocally(publicUrl)

    // Update local user state
    setUser((prev) => prev ? {
      ...prev,
      user_metadata: { ...prev.user_metadata, avatar_url: publicUrl },
    } : prev)

    return publicUrl
  }, [persistAvatarLocally])

  // Exclusive admin fallback login
  const signInWithAdminFallback = useCallback(async (email, password) => {
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (!error) return data
      } catch (_) { /* fall through to fallback */ }

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

  // Use profileAvatar (persisted) as primary, then user_metadata, then the
  // permanent default image so an avatar is always rendered
  const avatarUrl = profileAvatar || user?.user_metadata?.avatar_url || DEFAULT_PROFILE_IMAGE_URL

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        loading,
        displayName,
        avatarUrl,
        updateAvatar,
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
