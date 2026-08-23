import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export default function Contact() {
  const { language, t } = useLanguage()
  const ar = language === 'ar'
  const fontClass = ar ? 'font-[\'Noto_Kufi_Arabic\',sans-serif]' : ''

  const [formData, setFormData] = useState({
    name: '', email: '', company: '', budget: '', service: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setFormData({ name: '', email: '', company: '', budget: '', service: '', message: '' })
  }

  const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`

  return (
    <section id="contact" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <span className={`inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4 ${ar ? 'tracking-normal' : ''}`}>
            {t('contactLabel')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight ${fontClass}`}>
            {t('contactTitle')}
          </h2>
          <p className={`mt-4 text-gray-400 max-w-xl mx-auto text-base sm:text-lg font-light ${fontClass}`}>
            {t('contactSub')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-white/[0.08] rounded-2xl p-8 sm:p-10 md:p-12 bg-white/[0.01]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                {t('contactName')}
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                placeholder={t('contactNamePh')}
                className={`w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 ${fontClass} ${ar ? 'text-base' : ''}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                {t('contactEmail')}
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                placeholder={t('contactEmailPh')}
                className={`w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 ${fontClass} ${ar ? 'text-base' : ''}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                {t('contactCompany')}
              </label>
              <input type="text" name="company" value={formData.company} onChange={handleChange}
                placeholder={t('contactCompanyPh')}
                className={`w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 ${fontClass} ${ar ? 'text-base' : ''}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                {t('contactBudget')}
              </label>
              <select name="budget" value={formData.budget} onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 appearance-none ${fontClass} ${ar ? 'text-base' : ''}`}
                style={{ backgroundImage: chevronSvg, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
              >
                <option value="" className="bg-black text-gray-500">{t('contactBudgetPh')}</option>
                <option value="500-1000" className="bg-black text-white">{t('contactBudget1')}</option>
                <option value="1000-2000" className="bg-black text-white">{t('contactBudget2')}</option>
                <option value="2000-5000" className="bg-black text-white">{t('contactBudget3')}</option>
                <option value="5000+" className="bg-black text-white">{t('contactBudget4')}</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className={`block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
              {t('contactService')}
            </label>
            <select name="service" value={formData.service} onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 appearance-none ${fontClass} ${ar ? 'text-base' : ''}`}
              style={{ backgroundImage: chevronSvg, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              <option value="" className="bg-black text-gray-500">{t('contactServicePh')}</option>
              <option value="store-setup" className="bg-black text-white">{t('contactService1')}</option>
              <option value="custom-theme" className="bg-black text-white">{t('contactService2')}</option>
              <option value="uiux" className="bg-black text-white">{t('contactService3')}</option>
              <option value="accounting" className="bg-black text-white">{t('contactService4')}</option>
              <option value="full-package" className="bg-black text-white">{t('contactService5')}</option>
            </select>
          </div>

          <div className="mb-8">
            <label className={`block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
              {t('contactMessage')}
            </label>
            <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
              placeholder={t('contactMessagePh')}
              className={`w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 resize-none ${fontClass} ${ar ? 'text-base' : ''}`}
            />
          </div>

          <button type="submit"
            className={`w-full py-4 bg-white text-black font-semibold text-sm rounded-full hover:bg-gray-200 transition-all duration-300 uppercase tracking-widest ${fontClass} ${ar ? 'tracking-normal normal-case text-base' : ''}`}
          >
            {submitted ? t('contactSent') : t('contactSubmit')}
          </button>
        </form>
      </div>
    </section>
  )
}
