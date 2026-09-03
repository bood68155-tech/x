import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export default function Contact() {
  const { language, t } = useLanguage()
  const ar = language === 'ar'
  const fontClass = ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''

  const [formData, setFormData] = useState({
    name: '', email: '', whatsapp: '', service: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const subject = encodeURIComponent(`New Project Inquiry — ${formData.service || 'General'}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `WhatsApp: ${formData.whatsapp}\n` +
      `Service Category: ${formData.service}\n\n` +
      `Project Details:\n${formData.message}`
    )

    window.open(`mailto:bood68155@gmail.com?subject=${subject}&body=${body}`, '_blank')

    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setFormData({ name: '', email: '', whatsapp: '', service: '', message: '' })
  }

  const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`

  return (
    <section id="contact" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <span className={`inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#c29b7f]/70 mb-4 ${ar ? 'tracking-normal' : ''}`}>
            {t('contactLabel')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight ${fontClass}`}>
            {t('contactTitle')}
          </h2>
          <p className={`mt-4 text-[#c29b7f] max-w-xl mx-auto text-base sm:text-lg font-light ${fontClass}`}>
            {t('contactSub')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-white/[0.08] rounded-2xl p-8 sm:p-10 md:p-12 bg-[#c29b7f]/[0.02]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Full Name */}
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider text-[#c29b7f]/70 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                {t('contactName')}
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                placeholder={t('contactNamePh')}
                className={`w-full px-4 py-3 bg-[#c29b7f]/[0.04] border border-white/[0.10] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c29b7f]/40 focus:bg-[#c29b7f]/[0.06] transition-all duration-300 ${fontClass} ${ar ? 'text-base' : ''}`}
              />
            </div>

            {/* Email */}
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider text-[#c29b7f]/70 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                {t('contactEmail')}
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                placeholder={t('contactEmailPh')}
                className={`w-full px-4 py-3 bg-[#c29b7f]/[0.04] border border-white/[0.10] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c29b7f]/40 focus:bg-[#c29b7f]/[0.06] transition-all duration-300 ${fontClass} ${ar ? 'text-base' : ''}`}
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider text-[#c29b7f]/70 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                {t('contactWhatsApp')}
              </label>
              <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required
                placeholder={t('contactWhatsAppPh')}
                className={`w-full px-4 py-3 bg-[#c29b7f]/[0.04] border border-white/[0.10] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c29b7f]/40 focus:bg-[#c29b7f]/[0.06] transition-all duration-300 ${fontClass} ${ar ? 'text-base' : ''}`}
              />
            </div>

            {/* Service Category */}
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider text-[#c29b7f]/70 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                {t('contactService')}
              </label>
              <select name="service" value={formData.service} onChange={handleChange} required
                className={`w-full px-4 py-3 bg-[#c29b7f]/[0.04] border border-white/[0.10] rounded-xl text-white text-sm focus:outline-none focus:border-[#c29b7f]/40 focus:bg-[#c29b7f]/[0.06] transition-all duration-300 appearance-none ${fontClass} ${ar ? 'text-base' : ''}`}
                style={{ backgroundImage: chevronSvg, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
              >
                <option value="" className="bg-black text-[#c29b7f]/70">{t('contactServicePh')}</option>
                <option value="Website" className="bg-[#08080a] text-white">{t('contactService1')}</option>
                <option value="Store" className="bg-[#08080a] text-white">{t('contactService2')}</option>
                <option value="Theme" className="bg-[#08080a] text-white">{t('contactService3')}</option>
              </select>
            </div>
          </div>

          {/* Project Details */}
          <div className="mb-8">
            <label className={`block text-xs font-medium uppercase tracking-wider text-[#c29b7f]/70 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
              {t('contactMessage')}
            </label>
            <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
              placeholder={t('contactMessagePh')}
              className={`w-full px-4 py-3 bg-[#c29b7f]/[0.04] border border-white/[0.10] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c29b7f]/40 focus:bg-[#c29b7f]/[0.06] transition-all duration-300 resize-none ${fontClass} ${ar ? 'text-base' : ''}`}
            />
          </div>

          <button type="submit"
            className={`w-full py-4 bg-[#800020] text-white font-semibold text-sm rounded-full hover:bg-[#6b0c22] transition-all duration-300 uppercase tracking-widest ${fontClass} ${ar ? 'tracking-normal normal-case text-base' : ''}`}
          >
            {submitted ? t('contactSent') : t('contactSubmit')}
          </button>
        </form>

        {/* Social Links */}
        <div className="mt-12 text-center">
          <p className={`text-xs text-[#c29b7f]/50 mb-4 uppercase tracking-widest ${fontClass}`}>Connect with us</p>
          <div className="flex items-center justify-center gap-4">
            <a href="https://www.linkedin.com/in/abood-ahmad-697492415" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#c29b7f]/70 hover:text-white hover:border-white/20 hover:bg-[#c29b7f]/5 transition-all duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/ats_3bood_a7mad?utm_source=qr&igsi=MWczeWgzcnQ3d2kxYw==" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#c29b7f]/70 hover:text-white hover:border-white/20 hover:bg-[#c29b7f]/5 transition-all duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://wa.me/970599608181" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#c29b7f]/70 hover:text-white hover:border-white/20 hover:bg-[#c29b7f]/5 transition-all duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
