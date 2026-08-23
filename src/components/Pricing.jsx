const plans = [
  {
    name: 'Starter',
    price: '$499',
    period: 'one-time',
    description: 'Perfect for new stores launching their first online presence.',
    features: [
      'Up to 20 Products',
      'Responsive Theme Setup',
      'Basic SEO Optimization',
      'Payment Gateway Setup',
      '30-Day Support',
      'Mobile-First Design',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$1,299',
    period: 'one-time',
    description: 'For growing brands that need a custom, conversion-focused store.',
    features: [
      'Up to 100 Products',
      'Custom Theme Design',
      'Advanced SEO & Analytics',
      'Payment & Shipping Setup',
      'Priority 60-Day Support',
      'Speed Optimization',
      'Custom Integrations',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$3,499',
    period: 'one-time',
    description: 'Full-scale e-commerce solution for established brands.',
    features: [
      'Unlimited Products',
      'Bespoke Theme Development',
      'Full SEO & Marketing Suite',
      'Multi-Payment Integration',
      '90-Day Premium Support',
      'Performance Optimization',
      'Accounting Integration',
      'Ongoing Consultation',
    ],
    cta: 'Contact Us',
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      {/* Subtle divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Service Packages
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-base sm:text-lg font-light">
            Transparent pricing for every stage of your e-commerce journey.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative p-8 sm:p-10 rounded-2xl border transition-all duration-500 ${
                plan.popular
                  ? 'border-white/30 bg-white/[0.04] scale-[1.02]'
                  : 'border-white/[0.08] bg-white/[0.01] hover:border-white/15'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500 font-light">/ {plan.period}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-8 font-light leading-relaxed">
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-10">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-300">
                    <svg
                      className="w-4 h-4 mt-0.5 text-white/60 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#contact"
                className={`block w-full text-center py-3.5 rounded-full text-sm font-semibold transition-all duration-300 uppercase tracking-wider ${
                  plan.popular
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'border border-white/20 text-white hover:bg-white/5 hover:border-white/40'
                }`}
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
