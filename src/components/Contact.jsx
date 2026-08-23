import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    service: '',
    message: '',
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

  return (
    <section id="contact" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      {/* Subtle divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Start Your Project
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-base sm:text-lg font-light">
            Tell us about your vision. We'll get back to you within 24 hours.
          </p>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="border border-white/[0.08] rounded-2xl p-8 sm:p-10 md:p-12 bg-white/[0.01]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Brand"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
                Budget Range
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                }}
              >
                <option value="" className="bg-black text-gray-500">Select budget</option>
                <option value="500-1000" className="bg-black text-white">$500 – $1,000</option>
                <option value="1000-2000" className="bg-black text-white">$1,000 – $2,000</option>
                <option value="2000-5000" className="bg-black text-white">$2,000 – $5,000</option>
                <option value="5000+" className="bg-black text-white">$5,000+</option>
              </select>
            </div>
          </div>

          {/* Service */}
          <div className="mb-6">
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
              Service Needed
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
              }}
            >
              <option value="" className="bg-black text-gray-500">Select a service</option>
              <option value="store-setup" className="bg-black text-white">Store Setup</option>
              <option value="custom-theme" className="bg-black text-white">Custom Theme</option>
              <option value="uiux" className="bg-black text-white">UI/UX Optimization</option>
              <option value="accounting" className="bg-black text-white">Accounting Integration</option>
              <option value="full-package" className="bg-black text-white">Full Package</option>
            </select>
          </div>

          {/* Message */}
          <div className="mb-8">
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
              Project Details
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Tell us about your project, goals, and timeline..."
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-white text-black font-semibold text-sm rounded-full hover:bg-gray-200 transition-all duration-300 uppercase tracking-widest"
          >
            {submitted ? '✓ Message Sent' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}
