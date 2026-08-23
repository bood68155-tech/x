export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="text-3xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity">
              X
            </a>
            <p className="mt-4 text-sm text-gray-500 font-light leading-relaxed max-w-xs">
              Premium e-commerce agency crafting luxury digital experiences for forward-thinking brands.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {['Store Setup', 'Custom Themes', 'UI/UX Design', 'Accounting'].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-sm text-gray-500 hover:text-white transition-colors font-light">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {['About Us', 'Portfolio', 'Pricing', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(' ', '')}`}
                    className="text-sm text-gray-500 hover:text-white transition-colors font-light"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-gray-500 font-light">hello@agencyx.com</li>
              <li className="text-sm text-gray-500 font-light">+1 (555) 123-4567</li>
              <li className="text-sm text-gray-500 font-light">New York, NY</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600 font-light">
            © 2026 X Agency. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-xs text-gray-600 hover:text-white transition-colors font-light">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
