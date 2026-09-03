import { useLanguage } from '../i18n/LanguageContext'

export default function Pricing() {
  const { language, t } = useLanguage()
  const ar = language === 'ar'

  const plans = [
    {
      name: t('plan1Name'),
      price: t('plan1Price'),
      period: t('plan1Period'),
      description: t('plan1Desc'),
      features: [t('plan1Feat1'), t('plan1Feat2'), t('plan1Feat3'), t('plan1Feat4'), t('plan1Feat5'), t('plan1Feat6')],
      cta: t('plan1Cta'),
      popular: false,
    },
    {
      name: t('plan2Name'),
      price: t('plan2Price'),
      period: t('plan2Period'),
      description: t('plan2Desc'),
      features: [t('plan2Feat1'), t('plan2Feat2'), t('plan2Feat3'), t('plan2Feat4'), t('plan2Feat5'), t('plan2Feat6'), t('plan2Feat7')],
      cta: t('plan2Cta'),
      popular: true,
    },
    {
      name: t('plan3Name'),
      price: t('plan3Price'),
      period: t('plan3Period'),
      description: t('plan3Desc'),
      features: [t('plan3Feat1'), t('plan3Feat2'), t('plan3Feat3'), t('plan3Feat4'), t('plan3Feat5'), t('plan3Feat6'), t('plan3Feat7'), t('plan3Feat8')],
      cta: t('plan3Cta'),
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <span className={`inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#B38F6F]/70 mb-4 ${ar ? 'tracking-normal' : ''}`}>
            {t('priceLabel')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#F2F1ED] tracking-tight ${ar ? 'font-[\'Noto_Kufi_Arabic\',sans-serif]' : ''}`}>
            {t('priceTitle')}
          </h2>
          <p className={`mt-4 text-[#B38F6F] max-w-xl mx-auto text-base sm:text-lg font-light ${ar ? 'font-[\'Noto_Kufi_Arabic\',sans-serif]' : ''}`}>
            {t('priceSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative p-8 sm:p-10 rounded-2xl border transition-all duration-500 ${
                plan.popular
                  ? 'border-white/20 bg-[#B38F6F]/[0.05] scale-[1.02]'
                  : 'border-white/[0.08] bg-[#B38F6F]/[0.02] hover:border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className={`px-4 py-1.5 bg-[#710014] text-[#F2F1ED] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full ${ar ? 'tracking-normal normal-case text-xs' : ''}`}>
                    {t('pricePopular')}
                  </span>
                </div>
              )}

              <h3 className={`text-lg font-semibold text-[#F2F1ED] mb-2 tracking-tight ${ar ? 'font-[\'Noto_Kufi_Arabic\',sans-serif]' : ''}`}>
                {plan.name}
              </h3>

              <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-4xl sm:text-5xl font-black text-[#F2F1ED] tracking-tighter ${ar ? 'font-[\'Noto_Kufi_Arabic\',sans-serif]' : ''}`}>
                  {plan.price}
                </span>
                <span className={`text-sm text-[#B38F6F]/70 font-light ${ar ? 'font-[\'Noto_Kufi_Arabic\',sans-serif] text-base' : ''}`}>
                  / {plan.period}
                </span>
              </div>

              <p className={`text-sm text-[#B38F6F] mb-8 font-light leading-relaxed ${ar ? 'font-[\'Noto_Kufi_Arabic\',sans-serif] text-base' : ''}`}>
                {plan.description}
              </p>

              <ul className="space-y-3 mb-10">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-[#F2F1ED]/80">
                    <svg className="w-4 h-4 mt-0.5 text-[#F2F1ED]/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`font-light ${ar ? 'font-[\'Noto_Kufi_Arabic\',sans-serif] text-base' : ''}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block w-full text-center py-3.5 rounded-full text-sm font-semibold transition-all duration-300 uppercase tracking-wider ${
                  plan.popular
                    ? 'bg-[#710014] text-[#F2F1ED] hover:bg-[#5a0010]'
                    : 'border border-[#B38F6F]/20 text-[#F2F1ED] hover:bg-[#B38F6F]/5 hover:border-[#B38F6F]/40'
                } ${ar ? 'tracking-normal normal-case text-base font-[\'Noto_Kufi_Arabic\',sans-serif]' : ''}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
