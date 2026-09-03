import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../admin/AuthContext'
import SpotlightCard from './SpotlightCard'

export default function Hero({ onGetStarted }) {
  const { language, t } = useLanguage()
  const { avatarUrl } = useAuth()
  const ar = language === 'ar'
  const fontClass = ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#161616]" />
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(179, 143, 111,0.4) 0.5px, transparent 0.5px)',
          backgroundSize: '40px 40px',
        }} />
      </div>
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] blur-[200px] opacity-[0.03]" style={{ background: 'radial-gradient(circle, #710014 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left: Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* HELLO Badge */}
            <div className="animate-fade-in-up opacity-0 mt-6 sm:mt-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#161616] border border-[#B38F6F]/30 text-[#F2F1ED] text-xs font-semibold uppercase tracking-[0.2em]">
                {ar ? (
                  <span className="w-1.5 h-1.5 bg-[#B38F6F] animate-pulse" />
                ) : (
                  <span className="text-[#B38F6F]">#</span>
                )}
                {t('heroHello')}
              </span>
            </div>

            {/* Bio — directly after HELLO badge, no name heading */}
            <div className="animate-fade-in-up opacity-0 delay-100">
              <p className={`text-base sm:text-lg text-[#A6A199] font-light leading-relaxed max-w-xl ${fontClass}`}>
                {t('heroBio')}
              </p>
            </div>

            {/* Social Icons — clean single row */}
            <div className="animate-fade-in-up opacity-0 delay-200 flex items-center gap-3">
              {/* Email */}
              <a href="mailto:bood68155@gmail.com"
                className="p-3 border border-[#B38F6F]/[0.10] bg-[#B38F6F]/[0.03] text-[#B38F6F]/70 hover:text-[#F2F1ED] hover:border-[#B38F6F] hover:bg-[#B38F6F]/5 transition-all duration-300"
                title="Email">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/abood-ahmad-697492415" target="_blank" rel="noopener noreferrer"
                className="p-3 border border-[#B38F6F]/[0.10] bg-[#B38F6F]/[0.03] text-[#B38F6F]/70 hover:text-[#F2F1ED] hover:border-[#B38F6F] hover:bg-[#B38F6F]/5 transition-all duration-300"
                title="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* GitHub */}
              <a href="https://github.com/bood68155-tech" target="_blank" rel="noopener noreferrer"
                className="p-3 border border-[#B38F6F]/[0.10] bg-[#B38F6F]/[0.03] text-[#B38F6F]/70 hover:text-[#F2F1ED] hover:border-[#B38F6F] hover:bg-[#B38F6F]/5 transition-all duration-300"
                title="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/3bood_a7mad_90/" target="_blank" rel="noopener noreferrer"
                className="p-3 border border-[#B38F6F]/[0.10] bg-[#B38F6F]/[0.03] text-[#B38F6F]/70 hover:text-[#F2F1ED] hover:border-[#B38F6F] hover:bg-[#B38F6F]/5 transition-all duration-300"
                title="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/970599608181" target="_blank" rel="noopener noreferrer"
                className="p-3 border border-[#B38F6F]/[0.10] bg-[#B38F6F]/[0.03] text-[#B38F6F]/70 hover:text-[#F2F1ED] hover:border-[#B38F6F] hover:bg-[#B38F6F]/5 transition-all duration-300"
                title="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up opacity-0 delay-300 flex flex-col sm:flex-row items-start gap-4">
              <button
                onClick={onGetStarted}
                className={`group relative px-8 py-4 font-semibold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] overflow-hidden bg-[#710014] text-[#F2F1ED] hover:bg-[#5F0B1E] ${fontClass} ${ar ? 'tracking-normal text-base' : ''}`}
              >
                {t('heroCta')}
              </button>
              <a
                href="#projects"
                className={`px-8 py-4 font-medium text-sm uppercase tracking-widest transition-all duration-300 border border-[#B38F6F]/[0.12] text-[#F2F1ED]/70 hover:text-[#F2F1ED] hover:border-[#B38F6F]/30 hover:bg-[#B38F6F]/[0.05] backdrop-blur-sm ${fontClass} ${ar ? 'tracking-normal text-base' : ''}`}
              >
                {t('heroSecondary')}
              </a>
            </div>
          </div>

          {/* Right: Profile Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-slide-in-right opacity-0 delay-200">
            <div className="relative">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 overflow-hidden glow-border animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-[#161616] via-[#161616] to-[#161616]" />
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Abdelrahman Osama" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#B38F6F]/[0.07] border border-[#B38F6F]/[0.10] flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#F2F1ED]/80">A</span>
                      </div>
                      <p className="text-sm font-bold text-[#F2F1ED]/70">Abdelrahman</p>
                      <p className="text-xs text-[#A6A199]">Osama</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B38F6F]/[0.04]" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#B38F6F]/[0.02]" />
              </div>
              <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-[#161616] border border-[#B38F6F]/[0.10] animate-float" style={{ animationDelay: '1s' }}>
                <p className="text-[10px] text-[#A6A199] uppercase tracking-wider">Based in</p>
                <p className="text-xs font-bold text-[#F2F1ED]">Gaza, Palestine</p>
              </div>
              <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-[#B38F6F]/10 border border-[#B38F6F]/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#B38F6F] animate-pulse" />
                <span className="text-[10px] font-bold text-[#B38F6F]">Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="animate-fade-in-up opacity-0 delay-400 mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '100+', label: language === 'ar' ? 'مشروع' : 'Projects' },
            { value: '98%', label: language === 'ar' ? 'رضا' : 'Satisfaction' },
            { value: '24h', label: language === 'ar' ? 'استجابة' : 'Response' },
            { value: '2+', label: language === 'ar' ? 'سنوات خبرة' : 'Years Experience' },
          ].map((stat) => (
            <SpotlightCard key={stat.label} className="bento-card p-4 text-center glow-border-hover" spotlightSize={250} spotlightOpacity={0.06}>
              <div className="text-xl sm:text-2xl font-bold text-[#F2F1ED] tracking-tight">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A6A199] mt-1 font-medium">{stat.label}</div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}
