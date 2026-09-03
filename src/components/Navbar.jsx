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

            {/* Social Icons */}
            <a href="https://www.linkedin.com/in/abood-ahmad-697492415" target="_blank" rel="noopener noreferrer"
              className="p-2 border border-white/[0.10] text-[#c29b7f]/70 hover:text-white hover:border-[#c29b7f] hover:bg-[#c29b7f]/5 transition-all duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://github.com/bood68155-tech" target="_blank" rel="noopener noreferrer"
              className="p-2 border border-white/[0.10] text-[#c29b7f]/70 hover:text-white hover:border-[#c29b7f] hover:bg-[#c29b7f]/5 transition-all duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/3bood_a7mad_90/" target="_blank" rel="noopener noreferrer"
              className="p-2 border border-white/[0.10] text-[#c29b7f]/70 hover:text-white hover:border-[#c29b7f] hover:bg-[#c29b7f]/5 transition-all duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://wa.me/970599608181" target="_blank" rel="noopener noreferrer"
              className="p-2 border border-white/[0.10] text-[#c29b7f]/70 hover:text-white hover:border-[#c29b7f] hover:bg-[#c29b7f]/5 transition-all duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

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
