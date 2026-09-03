import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { supabase } from '../lib/supabaseClient'

export default function OrderFormModal({ isOpen, onClose, preselectedProduct }) {
  const { language, t } = useLanguage()
  const ar = language === 'ar'
  const fontClass = ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''

  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(() => ({
    name: '',
    email: '',
    phone: '',
    service: preselectedProduct?.title || '',
    details: preselectedProduct ? `I'm interested in: ${preselectedProduct.title} (${preselectedProduct.category}) - ${preselectedProduct.price || 'Contact for pricing'}` : '',
  }))

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && preselectedProduct) {
      setFormData(prev => ({
        ...prev,
        service: preselectedProduct.title || '',
        details: prev.details || `I'm interested in: ${preselectedProduct.title} (${preselectedProduct.category}) - ${preselectedProduct.price || 'Contact for pricing'}`,
      }))
    }
  }, [isOpen, preselectedProduct])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = true
    if (!formData.email.trim()) newErrors.email = true
    if (!formData.phone.trim()) newErrors.phone = true
    if (!formData.service.trim()) newErrors.service = true
    if (!formData.details.trim()) newErrors.details = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)

    // Save order to Supabase 'orders' table
    try {
      const { error } = await supabase.from('orders').insert({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        service_product: formData.service,
        project_details: formData.details,
        project_id: preselectedProduct?.id || null,
        project_title: preselectedProduct?.title || null,
        project_price: preselectedProduct?.price || null,
      })
      if (error) {
        console.warn('Supabase order save failed (table may not exist):', error.message)
      }
    } catch (err) {
      console.warn('Supabase order save error:', err)
    }

    // Also open mailto as a backup notification
    const subject = encodeURIComponent(`Order Request — ${formData.service}`)
    const body = encodeURIComponent(
      `📦 New Order Request\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 Customer Name: ${formData.name}\n` +
      `📧 Email: ${formData.email}\n` +
      `📱 Phone/WhatsApp: ${formData.phone}\n` +
      `🛒 Service/Product: ${formData.service}\n\n` +
      `📝 Project Details:\n${formData.details}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Sent via X Agency Order Form`
    )

    window.open(`mailto:bood68155@gmail.com?subject=${subject}&body=${body}`, '_blank')

    setSaving(false)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', service: '', details: '' })
      onClose()
    }, 2500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#08080a]/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 text-[#c29b7f]/70 hover:text-white transition-colors rounded-lg hover:bg-[#c29b7f]/5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-8 pt-8 pb-2 text-center border-b border-white/[0.06]">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl border border-white/10 bg-[#c29b7f]/5 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
          </div>
          <h3 className={`text-xl font-bold text-white mb-1 ${fontClass}`}>{t('orderModalTitle')}</h3>
          <p className={`text-sm text-[#c29b7f]/70 mb-6 ${fontClass}`}>{t('orderModalSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {submitted ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className={`text-lg font-semibold text-green-400 ${fontClass}`}>{t('orderSubmitted')}</p>
            </div>
          ) : (
            <>
              <div>
                <label className={`block text-xs font-medium uppercase tracking-wider text-[#c29b7f]/70 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                  {t('orderName')} *
                </label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('orderNamePh')}
                  className={`w-full px-4 py-3 bg-[#c29b7f]/[0.04] border ${errors.name ? 'border-red-500/50' : 'border-white/[0.10]'} rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c29b7f]/40 transition-all ${fontClass} ${ar ? 'text-base' : ''}`} />
                {errors.name && <p className="text-xs text-[#c29b7f] mt-1">{t('orderRequired')}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium uppercase tracking-wider text-[#c29b7f]/70 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                    {t('orderEmail')} *
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('orderEmailPh')}
                    className={`w-full px-4 py-3 bg-[#c29b7f]/[0.04] border ${errors.email ? 'border-red-500/50' : 'border-white/[0.10]'} rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c29b7f]/40 transition-all ${fontClass} ${ar ? 'text-base' : ''}`} />
                  {errors.email && <p className="text-xs text-[#c29b7f] mt-1">{t('orderRequired')}</p>}
                </div>
                <div>
                  <label className={`block text-xs font-medium uppercase tracking-wider text-[#c29b7f]/70 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                    {t('orderPhone')} *
                  </label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={t('orderPhonePh')}
                    className={`w-full px-4 py-3 bg-[#c29b7f]/[0.04] border ${errors.phone ? 'border-red-500/50' : 'border-white/[0.10]'} rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c29b7f]/40 transition-all ${fontClass} ${ar ? 'text-base' : ''}`} />
                  {errors.phone && <p className="text-xs text-[#c29b7f] mt-1">{t('orderRequired')}</p>}
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium uppercase tracking-wider text-[#c29b7f]/70 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                  {t('orderService')} *
                </label>
                <input type="text" name="service" value={formData.service} onChange={handleChange} placeholder={t('orderServicePh')}
                  className={`w-full px-4 py-3 bg-[#c29b7f]/[0.04] border ${errors.service ? 'border-red-500/50' : 'border-white/[0.10]'} rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c29b7f]/40 transition-all ${fontClass} ${ar ? 'text-base' : ''}`} />
                {errors.service && <p className="text-xs text-[#c29b7f] mt-1">{t('orderRequired')}</p>}
              </div>

              <div>
                <label className={`block text-xs font-medium uppercase tracking-wider text-[#c29b7f]/70 mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                  {t('orderDetails')} *
                </label>
                <textarea name="details" value={formData.details} onChange={handleChange} placeholder={t('orderDetailsPh')} rows={4}
                  className={`w-full px-4 py-3 bg-[#c29b7f]/[0.04] border ${errors.details ? 'border-red-500/50' : 'border-white/[0.10]'} rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c29b7f]/40 resize-none transition-all ${fontClass} ${ar ? 'text-base' : ''}`} />
                {errors.details && <p className="text-xs text-[#c29b7f] mt-1">{t('orderRequired')}</p>}
              </div>

              <button type="submit" disabled={saving}
                className={`w-full py-4 bg-[#800020] text-white font-semibold text-sm rounded-full hover:bg-[#6b0c22] transition-all duration-300 uppercase tracking-widest ${fontClass} ${ar ? 'tracking-normal normal-case text-base' : ''} disabled:opacity-50`}>
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : t('orderSubmit')}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
