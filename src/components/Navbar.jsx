import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: t('navServices'), href: '#services' },
    { label: t('navPortfolio'), href: '#portfolio' },
    { label: t('navPricing'), href: '#pricing' },
    { label: t('navContact'), href: '#contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#" className="text-3xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity">
          X
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 tracking-wide uppercase"
            >
              {link.label}
            </a>
          ))}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-0 border border-white/15 rounded-full overflow-hidden hover:border-white/30 transition-all duration-300"
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

          <a
            href="#contact"
            className="ml-2 px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all duration-300"
          >
            {t('navGetStarted')}
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center border border-white/15 rounded-full overflow-hidden hover:border-white/30 transition-all duration-300"
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
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 mt-3">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-6 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all"
            >
              {t('navGetStarted')}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
