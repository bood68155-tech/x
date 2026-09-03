import { useLanguage } from '../i18n/LanguageContext'
import SpotlightCard from './SpotlightCard'
import TechStackIcon from './TechStackIcon'

const TECH_STACK = {
  frontend: {
    label: 'FRONT END',
    items: [
      { name: 'HTML5' },
      { name: 'CSS3' },
      { name: 'JavaScript' },
      { name: 'React' },
      { name: 'Tailwind CSS' },
    ],
  },
  backend: {
    label: 'BACK END & DB',
    items: [
      { name: 'Node.js' },
      { name: 'Supabase' },
      { name: 'Firebase' },
      { name: 'MySQL' },
    ],
  },
  tools: {
    label: 'TOOLS & AUTOMATION',
    items: [
      { name: 'n8n' },
      { name: 'Make.com' },
      { name: 'GitHub' },
      { name: 'Vercel' },
      { name: 'Golden Asseal' },
      { name: 'VS Code' },
    ],
  },
  other: {
    label: 'OTHER SKILLS',
    items: [
      { name: 'E-Commerce' },
      { name: 'Accounting' },
      { name: 'Digital Marketing' },
      { name: 'Workflow Integration' },
    ],
  },
}

const ALL_ITEMS = Object.values(TECH_STACK).flatMap((cat) => cat.items)

export default function Education() {
  const { language, t } = useLanguage()
  const ar = language === 'ar'
  const fontClass = ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[#B38F6F]/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className={`inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A6A199] mb-4 ${ar ? 'tracking-normal' : ''}`}>
            {t('eduLabel')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F2F1ED] tracking-tight ${fontClass}`}>
            {t('eduTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Education Card */}
          <SpotlightCard
            id="education"
            className="bento-card p-8 glow-border-hover lg:sticky lg:top-28 flex flex-col"
            spotlightSize={500}
            spotlightOpacity={0.05}
          >
            <div className="w-12 h-12  bg-[#B38F6F]/[0.06] border border-[#B38F6F]/[0.10] flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#B38F6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <h3 className={`text-lg font-bold text-[#F2F1ED] mb-2 ${fontClass}`}>{t('eduUniName')}</h3>
            <p className={`text-sm text-[#B38F6F] mb-3 ${fontClass}`}>{t('eduDegree')}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5  bg-[#B38F6F]/[0.06] border border-[#B38F6F]/[0.08] mb-6">
              <span className="w-1.5 h-1.5  bg-[#B38F6F]" />
              <span className="text-[11px] font-medium text-[#B38F6F]">{t('eduTrack')}</span>
            </div>
            <p className={`text-sm text-[#A6A199] leading-relaxed mb-8 ${fontClass}`}>
              {t('eduDesc')}
            </p>
            <div className="space-y-3 mt-auto">
              {Object.entries(TECH_STACK).map(([key, cat]) => (
                <div key={key}>
                  <span className={`text-[9px] font-bold text-[#A6A199]/60 uppercase tracking-[0.2em] ${ar ? 'text-[10px]' : ''}`}>
                    {cat.label}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cat.items.map((item) => (
                      <span key={item.name} className="text-[9px] text-[#A6A199]/60 bg-[#B38F6F]/[0.03] px-1.5 py-0.5 ">
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>

          {/* Floating Tech Icons Field */}
          <div id="techstack" className="lg:col-span-2 relative">
            <div className="mb-6">
              <h3 className={`text-sm font-bold text-[#B38F6F] uppercase tracking-[0.2em] ${ar ? 'tracking-normal text-base' : ''}`}>
                {language === 'ar' ? 'التقنيات' : 'Tech Stack'}
              </h3>
              <p className={`text-xs text-[#A6A199]/60 mt-1 ${fontClass}`}>
                {language === 'ar' ? 'اسحب الأيقونات وتحسسها' : 'Drag & hover to interact'}
              </p>
            </div>
            <div className="relative min-h-[500px] sm:min-h-[560px] bento-card glow-border-hover p-6 sm:p-8 overflow-visible">
              <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(179, 143, 111,0.4) 0.5px, transparent 0.5px)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute top-4 left-6 text-[9px] font-bold text-[#F2F1ED]/[0.04] uppercase tracking-[0.3em]">Frontend</span>
                <span className="absolute top-4 right-6 text-[9px] font-bold text-[#F2F1ED]/[0.04] uppercase tracking-[0.3em]">Backend</span>
                <span className="absolute bottom-4 left-6 text-[9px] font-bold text-[#F2F1ED]/[0.04] uppercase tracking-[0.3em]">Tools</span>
                <span className="absolute bottom-4 right-6 text-[9px] font-bold text-[#F2F1ED]/[0.04] uppercase tracking-[0.3em]">Skills</span>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]  border border-[#B38F6F]/[0.03]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px]  border border-[#B38F6F]/[0.02]" />
              </div>
              <div className="relative z-10 flex flex-wrap justify-center items-center gap-4 sm:gap-6 py-4">
                {ALL_ITEMS.map((item, i) => (
                  <TechStackIcon key={item.name} name={item.name} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
