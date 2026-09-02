import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../admin/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [authMode, setAuthMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()
  const { isAuthenticated, loading: authLoading, displayName, avatarUrl, signIn, signUp, signInWithGoogle, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close modal on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setLoginOpen(false)
        setAdminMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Close login modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && loginOpen) {
      setLoginOpen(false)
      setEmail('')
      setPassword('')
      setLoginError('')
    }
  }, [isAuthenticated, loginOpen])

  const resetLoginModal = () => {
    setLoginOpen(false)
    setLoginError('')
    setEmail('')
    setPassword('')
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      if (authMode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        setLoginError('')
        // Show a friendly message for sign up
        setLoginError('Check your email for a confirmation link!')
      }
      resetLoginModal()
    } catch (err) {
      setLoginError(err.message || 'Authentication failed')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoginError('')
    setLoginLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      setLoginError(err.message || 'Google sign-in failed')
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (_) { /* silent */ }
    setAdminMenuOpen(false)
  }

  /** Navigate to a hash section, handling same-page vs cross-page scrolls */
  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      const targetId = href.slice(1)
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
      }
      setMobileOpen(false)
    }
  }

  const navLinks = [
    { label: t('navHome'), href: '/', isRoute: true },
    { label: t('navServices'), href: '#services', isRoute: false },
    { label: t('navStore'), href: '/store', isRoute: true },
    { label: t('navContact'), href: '#contact', isRoute: false },
  ]

  // Don't render auth-dependent UI until session is resolved
  const showAuthUI = !authLoading

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-2xl border-b border-white/[0.06] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 text-2xl font-black tracking-[-0.03em] text-white hover:opacity-80 transition-opacity">
            <span>Abood</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors duration-300 tracking-wide uppercase ${
                    location.pathname === link.href
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 tracking-wide uppercase"
                >
                  {link.label}
                </a>
              )
            ))}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-0 border border-white/[0.12] rounded-full overflow-hidden hover:border-white/[0.25] transition-all duration-300"
            >
              <span
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-white text-black'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                EN
              </span>
              <span
                className={`px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                  language === 'ar'
                    ? 'bg-white text-black'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                العربية
              </span>
            </button>

            {/* Auth Section */}
            {showAuthUI && (
              isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {/* User Profile Pill */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    )}
                    <span className="text-xs font-medium text-emerald-400 tracking-wide max-w-[120px] truncate">{displayName}</span>
                  </div>

                  {/* Admin Dashboard Button with dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Dashboard
                      <svg className={`w-3 h-3 transition-transform duration-200 ${adminMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    {adminMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-black/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 animate-fade-in">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-white/[0.08]">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-medium text-white truncate">{displayName}</p>
                        </div>
                        <Link
                          to="/admin"
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          Open Dashboard
                        </Link>
                        <div className="mx-3 my-1 border-t border-white/[0.08]" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="flex items-center gap-2 ml-2 px-5 py-2.5 border border-white/[0.12] text-gray-300 text-sm font-medium rounded-full hover:text-white hover:border-white/[0.25] transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Login
                </button>
              )
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center border border-white/[0.12] rounded-full overflow-hidden hover:border-white/[0.25] transition-all duration-300"
            >
              <span
                className={`px-2 py-1 text-[10px] font-bold uppercase transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-white text-black'
                    : 'text-gray-500'
                }`}
              >
                EN
              </span>
              <span
                className={`px-2 py-1 text-[10px] font-bold transition-all duration-300 ${
                  language === 'ar'
                    ? 'bg-white text-black'
                    : 'text-gray-500'
                }`}
              >
                ع
              </span>
            </button>

            {/* Mobile Admin / Login */}
            {showAuthUI && (
              isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-[10px] font-bold rounded-full"
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                    )}
                    ADMIN
                  </button>
                  {adminMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 py-2 bg-black/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl z-50">
                      <div className="px-4 py-2 border-b border-white/[0.08]">
                        <p className="text-[10px] text-gray-500">Signed in as</p>
                        <p className="text-xs font-medium text-white truncate">{displayName}</p>
                      </div>
                      <Link to="/admin" onClick={() => setAdminMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        Dashboard
                      </Link>
                      <div className="mx-3 my-1 border-t border-white/[0.08]" />
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )
            )}

            <button
              className="text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-2xl border-t border-white/[0.06] mt-3">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-wide"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-wide"
                  >
                    {link.label}
                  </a>
                )
              ))}
              <Link
                to="/store"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-6 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all"
              >
                {t('navGetStarted')}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ===== AUTH MODAL ===== */}
      {loginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={resetLoginModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/60 animate-fade-in-up">
            {/* Close */}
            <button
              onClick={resetLoginModal}
              className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-white/[0.08] bg-white/5 mb-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">
                {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {authMode === 'signin'
                  ? 'Sign in to manage your projects'
                  : 'Sign up to get started'}
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 bg-white/5 border border-white/[0.12] rounded-lg text-white text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50 mb-4"
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
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Error / Info Message */}
            {loginError && (
              <div className={`flex items-center gap-2 p-3 rounded-lg text-xs mb-4 ${
                loginError.includes('Check your email')
                  ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {loginError.includes('Check your email') ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </>
                  )}
                </svg>
                {loginError}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/25 transition-all"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/25 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                {loginLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {authMode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : authMode === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            {/* Toggle Sign In / Sign Up */}
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
                  setLoginError('')
                }}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {authMode === 'signin' ? (
                  <>Don't have an account? <span className="text-white font-medium">Sign Up</span></>
                ) : (
                  <>Already have an account? <span className="text-white font-medium">Sign In</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
