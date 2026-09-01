import { useLanguage } from '../i18n/LanguageContext'

export default function Hero({ onGetStarted }) {
  const { language, t } = useLanguage()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* === LAYERED BACKGROUND === */}

      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#0a0a0f] to-black" />

      {/* Subtle mesh grid — refined dot pattern */}
      <div className="absolute inset-0 opacity-[0.035]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.8) 0.5px, transparent 0.5px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Primary radial glow — warm amber/gold spotlight */}
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-[160px] opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #c9a44a 0%, transparent 70%)' }}
      />

      {/* Secondary accent glow — cool blue-purple */}
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
      />

      {/* Tertiary glow — soft white for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[100px]" />

      {/* Thin top edge gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* === MAIN CONTENT === */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Brand Logo */}
        <div className="animate-fade-in-up opacity-0 mb-8">
          <div className="inline-block relative">
            {/* Subtle glow behind the text */}
            <div className="absolute inset-0 blur-2xl opacity-30 bg-white/10 scale-150 rounded-full" />
            <span className="relative text-[80px] sm:text-[110px] md:text-[140px] font-black leading-none tracking-[-0.04em] text-white select-none">
              Abood
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className={`animate-fade-in-up opacity-0 delay-200 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white/90 leading-[1.15] tracking-tight mb-6 ${
            language === 'ar' ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''
          }`}
        >
          {t('heroHeadline1')}
          <br className="hidden sm:block" />
          <span className="font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            {t('heroHeadline2')}
          </span>
        </h1>

        {/* Subheading */}
        <p
          className={`animate-fade-in-up opacity-0 delay-300 text-base sm:text-lg md:text-xl text-gray-400/80 max-w-2xl mx-auto mb-12 leading-relaxed font-light ${
            language === 'ar' ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''
          }`}
        >
          {t('heroSub')}
        </p>

        {/* CTA Buttons — glassmorphism style */}
        <div className="animate-fade-in-up opacity-0 delay-400 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary CTA — glassmorphism pill */}
          <button
            onClick={onGetStarted}
            className={`group relative px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-widest transition-all duration-500 hover:scale-[1.03] animate-pulse-glow overflow-hidden ${
              language === 'ar' ? "font-['Noto_Kufi_Arabic',sans-serif] tracking-normal text-base" : ''
            }`}
          >
            {/* Glass background */}
            <div className="absolute inset-0 bg-white/[0.92] backdrop-blur-sm" />
            {/* Shimmer on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative text-black font-bold">{t('heroCta')}</span>
          </button>

          {/* Secondary CTA — glass border pill */}
          <a
            href="#portfolio"
            className={`relative px-8 py-4 rounded-full font-medium text-sm uppercase tracking-widest transition-all duration-500 border border-white/[0.12] text-white/70 hover:text-white hover:border-white/[0.25] hover:bg-white/[0.04] backdrop-blur-sm ${
              language === 'ar' ? "font-['Noto_Kufi_Arabic',sans-serif] tracking-normal text-base" : ''
            }`}
          >
            {t('heroSecondary')}
          </a>
        </div>

        {/* Trust indicators — subtle glass cards */}
        <div className="animate-fade-in-up opacity-0 delay-500 mt-16 sm:mt-20 flex items-center justify-center gap-8 sm:gap-12">
          {[
            { value: '100+', label: language === 'ar' ? 'مشروع' : 'Projects' },
            { value: '98%', label: language === 'ar' ? 'رضا' : 'Satisfaction' },
            { value: '24h', label: language === 'ar' ? 'استجابة' : 'Response' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white/90 tracking-tight">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="animate-fade-in opacity-0 delay-600 mt-16 sm:mt-20">
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">{t('heroScroll')}</span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-gray-500/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
