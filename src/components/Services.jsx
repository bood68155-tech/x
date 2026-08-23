import { useState } from 'react'

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'Store Setup',
    description: 'Complete e-commerce store configuration from domain setup to payment gateways. We handle Shopify, WooCommerce, and custom platforms end-to-end.',
    features: ['Platform Migration', 'Payment Integration', 'Product Setup'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Custom Themes',
    description: 'Bespoke, pixel-perfect theme design that reflects your brand identity. Unique layouts, custom animations, and conversion-focused design.',
    features: ['Brand Identity', 'Custom Code', 'Responsive Design'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'UI/UX Optimization',
    description: 'Data-driven design improvements that boost conversions. We analyze user behavior and optimize every touchpoint of the customer journey.',
    features: ['A/B Testing', 'Speed Optimization', 'Analytics Setup'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Automated Accounting',
    description: 'Seamless integration with accounting platforms like QuickBooks and Xero. Automated invoicing, tax calculations, and financial reporting.',
    features: ['Auto Invoicing', 'Tax Integration', 'Financial Reports'],
  },
]

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <section id="services" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Premium Services
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-base sm:text-lg font-light">
            End-to-end e-commerce solutions designed for brands that demand excellence.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className={`group relative p-8 sm:p-10 border rounded-2xl transition-all duration-500 cursor-default ${
                hoveredIndex === i
                  ? 'border-white/30 bg-white/[0.04]'
                  : 'border-white/[0.08] bg-white/[0.01] hover:border-white/20'
              }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                <div
                  className={`absolute top-0 right-0 w-full h-full transition-opacity duration-500 ${
                    hoveredIndex === i ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.06) 0%, transparent 70%)',
                  }}
                />
              </div>

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 mb-6 ${
                  hoveredIndex === i
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 text-white border-white/10'
                }`}
              >
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                {service.title}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 font-light">
                {service.description}
              </p>

              {/* Features Tags */}
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, j) => (
                  <span
                    key={j}
                    className="text-[11px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 text-gray-500"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
