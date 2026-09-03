import { useState } from 'react'
import { useAuth } from './AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (authMode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        setError('')
        setError('Check your email for a confirmation link!')
      }
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#161616] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16  border border-[#B38F6F]/10 bg-[#B38F6F]/5 mb-6">
            <span className="text-2xl font-extrabold text-[#F2F1ED] tracking-tighter">X</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F2F1ED] tracking-tight">Admin Panel</h1>
          <p className="text-sm text-[#B38F6F]/70 mt-2">
            {authMode === 'signin' ? 'Sign in to manage your portfolio' : 'Create an admin account'}
          </p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 bg-[#B38F6F]/5 border border-[#B38F6F]/10  text-[#F2F1ED] text-sm font-medium hover:bg-[#B38F6F]/10 hover:border-[#B38F6F]/20 transition-all disabled:opacity-50 mb-6"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#B38F6F]/10" />
          <span className="text-[10px] text-[#B38F6F]/50 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-[#B38F6F]/10" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className={`flex items-center gap-3 p-4  text-sm ${
              error.includes('Check your email')
                ? 'bg-[#710014]/10 border border-[#710014]/20 text-[#B38F6F]'
                : 'bg-[#710014]/15 border border-[#710014]/30 text-[#B38F6F]'
            }`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {error.includes('Check your email') ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                ) : (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </>
                )}
              </svg>
              {error}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#B38F6F] mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-3 bg-[#B38F6F]/5 border border-[#B38F6F]/10  text-[#F2F1ED] text-sm placeholder-[#767168] focus:outline-none focus:border-[#B38F6F]/40 focus:bg-[#B38F6F]/[0.07] transition-all duration-300"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#B38F6F] mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-[#B38F6F]/5 border border-[#B38F6F]/10  text-[#F2F1ED] text-sm placeholder-[#767168] focus:outline-none focus:border-[#B38F6F]/40 focus:bg-[#B38F6F]/[0.07] transition-all duration-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#710014] text-[#F2F1ED] text-sm font-semibold  hover:bg-[#5F0B1E] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {authMode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              authMode === 'signin' ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
              setError('')
            }}
            className="text-sm text-[#B38F6F]/70 hover:text-[#B38F6F] transition-colors"
          >
            {authMode === 'signin' ? (
              <>Don't have an account? <span className="text-[#F2F1ED] font-medium">Sign Up</span></>
            ) : (
              <>Already have an account? <span className="text-[#F2F1ED] font-medium">Sign In</span></>
            )}
          </button>
        </div>

        {/* Back to site link */}
        <div className="text-center mt-8">
          <a href="/" className="text-sm text-[#B38F6F]/50 hover:text-[#B38F6F] transition-colors duration-300">
            ← Back to site
          </a>
        </div>
      </div>
    </div>
  )
}
