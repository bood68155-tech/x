import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import SpotlightCard from './SpotlightCard'

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const { language, t } = useLanguage()
  const ar = language === 'ar'
  const fontClass = ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''

  const services = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349" />
        </svg>
      ),
      title: t('svcStoreTitle'),
      description: t('svcStoreDesc'),
      features: [t('svcStoreFeat1'), t('svcStoreFeat2'), t('svcStoreFeat3')],
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
      title: t('svcThemeTitle'),
      description: t('svcThemeDesc'),
      features: [t('svcThemeFeat1'), t('svcThemeFeat2'), t('svcThemeFeat3')],
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
        </svg>
      ),
      title: t('svcUxTitle'),
      description: t('svcUxDesc'),
      features: [t('svcUxFeat1'), t('svcUxFeat2'), t('svcUxFeat3')],
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
      ),
      title: t('svcAutoTitle'),
      description: t('svcAutoDesc'),
      features: [t('svcAutoFeat1'), t('svcAutoFeat2'), t('svcAutoFeat3')],
    },
  ]

  return (
    <section id="services" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="animate-blob-1 absolute -top-20 left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-500/[0.025] blur-[120px]" />
        <div className="animate-blob-2 absolute top-[40%] -right-20 w-[400px] h-[400px] rounded-full bg-orange-500/[0.02] blur-[110px]" />
        <div className="animate-blob-3 absolute bottom-[-10%] left-[10%] w-[450px] h-[450px] rounded-full bg-blue-500/[0.025] blur-[100px]" />
      </div>

      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className={`inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4 ${ar ? 'tracking-normal' : ''}`}>
            {t('servicesLabel')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight ${fontClass}`}>
            {t('servicesTitle')}
          </h2>
          <p className={`mt-4 text-gray-400 max-w-xl mx-auto text-base sm:text-lg font-light ${fontClass}`}>
            {t('servicesSub')}
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {services.map((service, i) => (
            <SpotlightCard
              key={i}
              className={`group bento-card p-7 sm:p-8 glow-border-hover cursor-default ${
                hoveredIndex === i ? 'border-white/[0.15] bg-white/[0.03]' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              spotlightSize={500}
              spotlightOpacity={0.05}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 mb-5 ${
                hoveredIndex === i
                  ? 'bg-white text-black border-white'
                  : 'bg-white/[0.05] text-white border-white/10'
              }`}>
                {service.icon}
              </div>

              <h3 className={`text-lg sm:text-xl font-bold text-white mb-2 tracking-tight ${fontClass}`}>
                {service.title}
              </h3>
              <p className={`text-gray-400 text-sm leading-relaxed mb-5 font-light ${fontClass}`}>
                {service.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, j) => (
                  <span
                    key={j}
                    className={`text-[11px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/[0.08] text-gray-500 bg-white/[0.02] ${ar ? 'tracking-normal normal-case text-xs' : ''}`}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Need Custom Design? CTA Section */}
        <div className="mt-16 sm:mt-20">
          <SpotlightCard
            className="bento-card p-8 sm:p-12 glow-border text-center relative overflow-hidden"
            spotlightSize={600}
            spotlightOpacity={0.04}
          >
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px]" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.1] mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>

              <h3 className={`text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight ${fontClass}`}>
                {t('customTitle')}
              </h3>
              <p className={`text-gray-400 max-w-lg mx-auto text-sm sm:text-base font-light mb-8 ${fontClass}`}>
                {t('customDesc')}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
                {[
                  { icon: '🛒', label: 'E-Commerce Store Setup' },
                  { icon: '💻', label: 'Custom Web Development' },
                  { icon: '🎨', label: 'UI/UX Templates' },
                  { icon: '⚡', label: 'Workflow Automation' },
                ].map((item) => (
                  <SpotlightCard
                    key={item.label}
                    className="px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
                    spotlightSize={200}
                    spotlightOpacity={0.08}
                  >
                    <span className="text-xl block mb-1">{item.icon}</span>
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{item.label}</span>
                  </SpotlightCard>
                ))}
              </div>

              <a
                href="https://wa.me/970599608181?text=Hello%20Abood!%20I%27m%20interested%20in%20a%20custom%20design/store."
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20BD5C] text-white font-semibold text-sm rounded-xl transition-all duration-300 hover:scale-[1.02] ${fontClass}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t('customCta')}
              </a>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  )
}
