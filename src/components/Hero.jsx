import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../admin/AuthContext'
import SpotlightCard from './SpotlightCard'

export default function Hero({ onGetStarted }) {
  const { language, t } = useLanguage()
  const { avatarUrl } = useAuth()
  const ar = language === 'ar'
  const fontClass = ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#0a0a0d]" />
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(194,155,127,0.4) 0.5px, transparent 0.5px)',
          backgroundSize: '40px 40px',
        }} />
      </div>
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[200px] opacity-[0.03]" style={{ background: 'radial-gradient(circle, #800020 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left: Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* HELLO Badge */}
            <div className="animate-fade-in-up opacity-0">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-semibold text-[#c29b7f] uppercase tracking-[0.2em]">
                <span className="w-2 h-2 rounded-full bg-[#c29b7f] animate-pulse" />
                {t('heroHello')}
              </span>
            </div>

            {/* Name */}
            <div className="animate-fade-in-up opacity-0 delay-100">
              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[0.95] tracking-tight ${fontClass}`}>
                {t('heroNameLine1')}
                <br />
                <span className="bg-gradient-to-r from-white via-white to-[#c29b7f]/40 bg-clip-text text-transparent">
                  {t('heroNameLine2')}
                </span>
              </h1>
            </div>

            {/* Bio */}
            <div className="animate-fade-in-up opacity-0 delay-200">
              <p className={`text-base sm:text-lg text-[#a1a1aa] font-light leading-relaxed max-w-xl ${fontClass}`}>
                {t('heroBio')}
              </p>
            </div>

            {/* Contact Cards */}
            <div className="animate-fade-in-up opacity-0 delay-300 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a href="mailto:bood68155@gmail.com" className="block">
                <SpotlightCard className="bento-card p-4 glow-border-hover flex items-center gap-3 group" spotlightSize={300} spotlightOpacity={0.08}>
                  <div className="w-10 h-10 rounded-xl bg-[#c29b7f]/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:bg-[#c29b7f]/[0.12] transition-all">
                    <svg className="w-4 h-4 text-[#c29b7f] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wider">Email</p>
                    <p className="text-xs text-white/80 truncate font-medium">bood68155@gmail.com</p>
                  </div>
                </SpotlightCard>
              </a>
              <a href="https://www.linkedin.com/in/abood-ahmad-697492415" target="_blank" rel="noopener noreferrer" className="block">
                <SpotlightCard className="bento-card p-4 glow-border-hover flex items-center gap-3 group" spotlightSize={300} spotlightOpacity={0.08}>
                  <div className="w-10 h-10 rounded-xl bg-[#c29b7f]/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:bg-[#c29b7f]/[0.12] transition-all">
                    <svg className="w-4 h-4 text-[#c29b7f] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wider">LinkedIn</p>
                    <p className="text-xs text-white/80 truncate font-medium">Abood Ahmad</p>
                  </div>
                </SpotlightCard>
              </a>
              <a href="https://github.com/bood68155-tech" target="_blank" rel="noopener noreferrer" className="block">
                <SpotlightCard className="bento-card p-4 glow-border-hover flex items-center gap-3 group" spotlightSize={300} spotlightOpacity={0.08}>
                  <div className="w-10 h-10 rounded-xl bg-[#c29b7f]/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:bg-[#c29b7f]/[0.12] transition-all">
                    <svg className="w-4 h-4 text-[#c29b7f] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wider">GitHub</p>
                    <p className="text-xs text-white/80 truncate font-medium">@bood68155-tech</p>
                  </div>
                </SpotlightCard>
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up opacity-0 delay-400 flex flex-col sm:flex-row items-start gap-4">
              <button
                onClick={onGetStarted}
                className={`group relative px-8 py-4 rounded-xl font-semibold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] overflow-hidden bg-[#800020] text-white hover:bg-[#6b0c22] ${fontClass} ${ar ? 'tracking-normal text-base' : ''}`}
              >
                {t('heroCta')}
              </button>
              <a
                href="#projects"
                className={`px-8 py-4 rounded-xl font-medium text-sm uppercase tracking-widest transition-all duration-300 border border-white/[0.12] text-white/70 hover:text-white hover:border-[#c29b7f]/30 hover:bg-[#c29b7f]/[0.05] backdrop-blur-sm ${fontClass} ${ar ? 'tracking-normal text-base' : ''}`}
              >
                {t('heroSecondary')}
              </a>
            </div>
          </div>

          {/* Right: Profile Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-slide-in-right opacity-0 delay-300">
            <div className="relative">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden glow-border animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-[#121218] via-[#0d0d11] to-[#0a0a0d]" />
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Abdelrahman Osama" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#c29b7f]/[0.07] border border-white/[0.10] flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl sm:text-4xl font-extrabold text-white/80">A</span>
                      </div>
                      <p className="text-sm font-bold text-white/70">Abdelrahman</p>
                      <p className="text-xs text-[#a1a1aa]">Osama</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c29b7f]/[0.04] rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/[0.02] rounded-tr-full" />
              </div>
              <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-[#121218] border border-white/[0.10] rounded-xl animate-float" style={{ animationDelay: '1s' }}>
                <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wider">Based in</p>
                <p className="text-xs font-bold text-white">Gaza, Palestine</p>
              </div>
              <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-[#c29b7f]/10 border border-white/20 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c29b7f] animate-pulse" />
                <span className="text-[10px] font-bold text-[#c29b7f]">Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="animate-fade-in-up opacity-0 delay-500 mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '100+', label: language === 'ar' ? 'مشروع' : 'Projects' },
            { value: '98%', label: language === 'ar' ? 'رضا' : 'Satisfaction' },
            { value: '24h', label: language === 'ar' ? 'استجابة' : 'Response' },
            { value: '2+', label: language === 'ar' ? 'سنوات خبرة' : 'Years Experience' },
          ].map((stat) => (
            <SpotlightCard key={stat.label} className="bento-card p-4 text-center glow-border-hover" spotlightSize={250} spotlightOpacity={0.06}>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#a1a1aa] mt-1 font-medium">{stat.label}</div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}
