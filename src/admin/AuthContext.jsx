import { createContext, useContext, useState, useEffect } from 'react'

const ADMIN_EMAIL = 'bood68155@gmail.com'
const ADMIN_PASSWORD = '123123'
const AUTH_KEY = 'x_admin_auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true'
  })

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem(AUTH_KEY, 'true')
    } else {
      sessionStorage.removeItem(AUTH_KEY)
    }
  }, [isAuthenticated])

  const login = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const logout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem(AUTH_KEY)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
