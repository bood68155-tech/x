import { useLanguage } from '../i18n/LanguageContext'

const TECH_STACK = {
  frontend: {
    label: 'FRONT END',
    items: [
      { name: 'HTML5', icon: '🌐' },
      { name: 'CSS3', icon: '🎨' },
      { name: 'JavaScript', icon: '⚡' },
      { name: 'React', icon: '⚛️' },
      { name: 'Tailwind CSS', icon: '💨' },
    ],
  },
  backend: {
    label: 'BACK END & DB',
    items: [
      { name: 'Node.js', icon: '🟢' },
      { name: 'Supabase', icon: '⚡' },
      { name: 'Firebase', icon: '🔥' },
      { name: 'MySQL', icon: '🗄️' },
    ],
  },
  tools: {
    label: 'TOOLS & AUTOMATION',
    items: [
      { name: 'n8n', icon: '🔄' },
      { name: 'Make.com', icon: '🔧' },
      { name: 'GitHub', icon: '🐙' },
      { name: 'Vercel', icon: '▲' },
      { name: 'Golden Asseal', icon: '📊' },
      { name: 'VS Code', icon: '💻' },
    ],
  },
  other: {
    label: 'OTHER SKILLS',
    items: [
      { name: 'E-Commerce', icon: '🛒' },
      { name: 'Accounting', icon: '📒' },
      { name: 'Digital Marketing', icon: '📈' },
      { name: 'Workflow Integration', icon: '🔗' },
    ],
  },
}

export default function Education() {
  const { language, t } = useLanguage()
  const ar = language === 'ar'
  const fontClass = ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className={`inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4 ${ar ? 'tracking-normal' : ''}`}>
            {t('eduLabel')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight ${fontClass}`}>
            {t('eduTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Education Card (spanning 1 col) */}
          <div id="education" className="bento-card p-8 glow-border-hover lg:row-span-2 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <h3 className={`text-lg font-bold text-white mb-2 ${fontClass}`}>{t('eduUniName')}</h3>
            <p className={`text-sm text-gray-400 mb-3 ${fontClass}`}>{t('eduDegree')}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-medium text-gray-400">{t('eduTrack')}</span>
            </div>
            <p className={`text-sm text-gray-500 leading-relaxed mt-auto ${fontClass}`}>
              {t('eduDesc')}
            </p>
          </div>

          {/* Tech Stack Cards */}
          <div id="techstack" className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(TECH_STACK).map(([key, category], i) => (
              <div key={key} className="bento-card p-6 glow-border-hover">
                <h4 className={`text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ${ar ? 'tracking-normal text-xs' : ''}`}>
                  {category.label}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item.name}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-gray-300 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 cursor-default"
                    >
                      <span className="text-sm">{item.icon}</span>
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
