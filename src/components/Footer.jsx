import { useLanguage } from '../i18n/LanguageContext'

export default function Footer() {
  const { language, t } = useLanguage()
  const ar = language === 'ar'
  const fontClass = ar ? 'font-[\'Noto_Kufi_Arabic\',sans-serif]' : ''

  return (
    <footer className="relative border-t border-white/[0.06] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="text-3xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity">
              X
            </a>
            <p className={`mt-4 text-sm text-gray-500 font-light leading-relaxed max-w-xs ${fontClass}`}>
              {t('footerDesc')}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
              {t('footerServices')}
            </h4>
            <ul className="space-y-2.5">
              {[t('footerSvc1'), t('footerSvc2'), t('footerSvc3'), t('footerSvc4')].map((item) => (
                <li key={item}>
                  <a href="#services" className={`text-sm text-gray-500 hover:text-white transition-colors font-light ${fontClass}`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
              {t('footerCompany')}
            </h4>
            <ul className="space-y-2.5">
              {[t('footerCo1'), t('footerCo2'), t('footerCo3'), t('footerCo4')].map((item) => (
                <li key={item}>
                  <a href="#" className={`text-sm text-gray-500 hover:text-white transition-colors font-light ${fontClass}`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
              {t('footerContact')}
            </h4>
            <ul className="space-y-2.5">
              <li className={`text-sm text-gray-500 font-light ${fontClass}`}>{t('footerEmail')}</li>
              <li className={`text-sm text-gray-500 font-light ${fontClass}`}>{t('footerPhone')}</li>
              <li className={`text-sm text-gray-500 font-light ${fontClass}`}>{t('footerLocation')}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={`text-xs text-gray-600 font-light ${fontClass}`}>
            {t('footerCopy')}
          </p>
          <div className="flex items-center gap-6">
            {[t('footerPrivacy'), t('footerTerms'), t('footerCookies')].map((item) => (
              <a key={item} href="#" className={`text-xs text-gray-600 hover:text-white transition-colors font-light ${fontClass}`}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
