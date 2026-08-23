export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[120px]" />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Logo */}
        <div className="animate-fade-in-up opacity-0 mb-8">
          <span className="inline-block text-[120px] sm:text-[160px] md:text-[200px] font-black leading-none tracking-tighter text-white select-none">
            X
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up opacity-0 delay-200 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight mb-6">
          E-Commerce Store Design{' '}
          <br className="hidden sm:block" />
          <span className="font-bold">& Theme Customization</span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-in-up opacity-0 delay-300 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          We craft premium, high-converting online stores. From bespoke themes to
          seamless UX — we transform your vision into a luxury digital experience.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up opacity-0 delay-400 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="px-8 py-4 bg-white text-black font-semibold text-sm rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105 animate-pulse-glow uppercase tracking-widest"
          >
            Get Started
          </a>
          <a
            href="#portfolio"
            className="px-8 py-4 border border-white/20 text-white font-medium text-sm rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300 uppercase tracking-widest"
          >
            View Our Work
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-fade-in opacity-0 delay-600 mt-16 sm:mt-20">
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-gray-600 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
