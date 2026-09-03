import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../admin/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const [googleUnavailable, setGoogleUnavailable] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()
  const { isAuthenticated, loading: authLoading, user, displayName, avatarUrl, signIn, signUp, signInWithGoogle, logout, updateAvatar } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isAdmin = isAuthenticated && user?.email === 'bood68155@gmail.com'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') { setLoginOpen(false); setAdminMenuOpen(false) }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

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
        setLoginError('Check your email for a confirmation link!')
        setLoginLoading(false)
        return
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
      const msg = err?.message || ''
      if (msg.includes('provider') || msg.includes('not enabled') || msg.includes('unsupported')) {
        setGoogleUnavailable(true)
        setLoginError('Google sign-in is not configured yet. Please use email & password to sign in.')
      } else {
        setLoginError(msg || 'Google sign-in failed. Please try email & password instead.')
      }
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try { await logout() } catch (_) { /* silent */ }
    setAdminMenuOpen(false)
  }

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
    { label: t('navEducation'), href: '#education', isRoute: false },
    { label: t('navTechStack'), href: '#techstack', isRoute: false },
    { label: t('navProjects'), href: '#projects', isRoute: false },
    { label: t('navStore'), href: '/store', isRoute: true },
    { label: t('navServices'), href: '#services', isRoute: false },
    { label: t('navAboutMe'), href: '#contact', isRoute: false },
  ]

  const showAuthUI = !authLoading

  return (
    <>
      {/* Floating Centered Navbar */}
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500  ${
          scrolled
            ? 'bg-[#111116]/90 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/50 w-[calc(100%-2rem)] max-w-4xl py-3 px-6'
            : 'bg-[#111116]/60 backdrop-blur-xl border border-white/[0.06] w-[calc(100%-2rem)] max-w-4xl py-3 px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8  bg-[#c29b7f] overflow-hidden border border-white/10 group-hover:scale-110 transition-transform duration-300">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Abood" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#08080a] text-sm font-extrabold flex items-center justify-center w-full h-full">A</span>
              )}
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-white tracking-tight">Abdelrahman Osama</span>
              <span className="text-[10px] text-[#c29b7f]/70 block leading-none">Abood</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-1.5 text-[11px] font-medium  transition-all duration-300 tracking-wide ${
                    location.pathname === link.href
                      ? 'text-white bg-[#c29b7f]/[0.10]'
                      : 'text-[#c29b7f]/70 hover:text-white hover:bg-[#c29b7f]/[0.06]'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-1.5 text-[11px] font-medium text-[#c29b7f]/70 hover:text-white hover:bg-[#c29b7f]/[0.06]  transition-all duration-300 tracking-wide"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Right: Language + Auth */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center border border-white/[0.10]  overflow-hidden hover:border-white/[0.18] transition-all duration-300"
            >
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                language === 'en' ? 'bg-[#c29b7f] text-[#08080a]' : 'text-[#c29b7f]/70 hover:text-white'
              }`}>EN</span>
              <span className={`px-2.5 py-1 text-[10px] font-bold transition-all duration-300 ${
                language === 'ar' ? 'bg-[#c29b7f] text-[#08080a]' : 'text-[#c29b7f]/70 hover:text-white'
              }`}>ع</span>
            </button>

            {/* Auth Section */}
            {showAuthUI && (
              isAuthenticated ? (
                isAdmin ? (
                  <div className="relative">
                    <button
                      onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#800020] text-white text-[11px] font-bold  hover:bg-[#6b0c22] transition-all duration-300"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Admin Active
                    </button>

                    {adminMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-[#111116]/95 backdrop-blur-xl border border-white/[0.08]  shadow-2xl shadow-black/50 animate-fade-in">
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                          <p className="text-[10px] text-[#c29b7f]/70">Signed in as</p>
                          <p className="text-xs font-medium text-white truncate">{displayName}</p>
                        </div>
                        <Link
                          to="/admin"
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-[#c29b7f]/5 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          Open Dashboard
                        </Link>
                        <div className="mx-3 my-1 border-t border-white/[0.06]" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#c29b7f]/70 hover:text-[#c29b7f] hover:bg-[#c29b7f]/5 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1  border border-white/20 bg-[#c29b7f]/5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full  bg-[#c29b7f] opacity-75" />
                        <span className="relative inline-flex  h-1.5 w-1.5 bg-[#c29b7f]" />
                      </span>
                      <span className="text-[10px] font-medium text-[#c29b7f] max-w-[80px] truncate">{displayName}</span>
                    </div>
                    <button onClick={handleLogout} className="text-[10px] text-[#c29b7f]/70 hover:text-[#c29b7f] transition-colors">Logout</button>
                  </div>
                )
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.10] text-white/80 text-[11px] font-medium  hover:text-white hover:border-white/[0.18] transition-all duration-300"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Sign In
                </button>
              )
            )}

            {/* Mobile Toggle */}
            <button
              className="lg:hidden text-white p-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="lg:hidden mt-3 pt-3 border-t border-white/[0.06]">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2 text-sm font-medium  transition-all ${
                      location.pathname === link.href ? 'text-white bg-[#c29b7f]/[0.10]' : 'text-[#c29b7f]/70 hover:text-white hover:bg-[#c29b7f]/[0.06]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="px-4 py-2 text-sm font-medium text-[#c29b7f]/70 hover:text-white hover:bg-[#c29b7f]/[0.06]  transition-all"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#08080a]/80 backdrop-blur-sm animate-fade-in" onClick={resetLoginModal} />

          <div className="relative w-full max-w-sm bg-[#111116] border border-white/[0.08]  p-8 shadow-2xl shadow-black/60 animate-fade-in-up">
            <button
              onClick={resetLoginModal}
              className="absolute top-4 right-4 p-1.5 text-[#c29b7f]/70 hover:text-white transition-colors  hover:bg-[#c29b7f]/5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12  border border-white/[0.08] bg-[#c29b7f]/5 mb-4">
                <svg className="w-5 h-5 text-[#c29b7f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">
                {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-xs text-[#c29b7f]/70 mt-1">
                {authMode === 'signin' ? 'Sign in to manage your projects' : 'Sign up to get started'}
              </p>
            </div>

            {/* Google Sign-In Button — with graceful fallback */}
            {!googleUnavailable && (
              <button
                onClick={handleGoogleAuth}
                disabled={loginLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 bg-[#c29b7f]/5 border border-white/[0.12]  text-white text-sm font-medium hover:bg-[#c29b7f]/10 hover:border-[#c29b7f]/20 transition-all disabled:opacity-50 mb-4"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            )}

            {/* Fallback notice when Google is unavailable */}
            {googleUnavailable && (
              <div className="flex items-start gap-3 p-3  bg-[#c29b7f]/5 border border-white/[0.08] mb-4">
                <svg className="w-4 h-4 text-[#c29b7f] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[11px] text-[#c29b7f]/70 leading-relaxed">
                  Google sign-in is not configured yet. Use your email & password below, or contact the admin to set up Google OAuth.
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#c29b7f]/[0.10]" />
              <span className="text-[10px] text-[#c29b7f]/50 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-[#c29b7f]/[0.10]" />
            </div>

            {loginError && (
              <div className={`flex items-center gap-2 p-3  text-xs mb-4 ${
                loginError.includes('Check your email')
                  ? 'bg-[#c29b7f]/10 border border-[#c29b7f]/20 text-[#c29b7f]'
                  : 'bg-[#800020]/15 border border-[#800020]/20 text-[#c29b7f]'
              }`}>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

            <form onSubmit={handleEmailAuth} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                autoFocus
                className="w-full px-4 py-2.5 bg-[#c29b7f]/5 border border-white/[0.08]  text-white text-sm placeholder-[#c29b7f]/40 focus:outline-none focus:border-[#c29b7f]/25 transition-all"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full px-4 py-2.5 bg-[#c29b7f]/5 border border-white/[0.08]  text-white text-sm placeholder-[#c29b7f]/40 focus:outline-none focus:border-[#c29b7f]/25 transition-all"
              />
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 bg-[#800020] text-white text-sm font-semibold  hover:bg-[#6b0c22] transition-all disabled:opacity-50"
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

            <div className="mt-4 text-center">
              <button
                onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setLoginError('') }}
                className="text-xs text-[#c29b7f]/70 hover:text-[#c29b7f] transition-colors"
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
