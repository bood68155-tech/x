import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjects, CATEGORIES } from '../admin/ProjectsContext'
import { useLanguage } from '../i18n/LanguageContext'

const GRADIENTS = [
  'from-gray-800 to-gray-900',
  'from-gray-900 to-black',
  'from-gray-800 to-gray-900',
  'from-gray-900 to-gray-800',
  'from-black to-gray-900',
  'from-gray-800 to-gray-900',
]

export default function Store() {
  const { projects } = useProjects()
  const { language, t } = useLanguage()
  const ar = language === 'ar'
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section className="relative pt-28 pb-24 sm:pt-32 sm:pb-32 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className={`inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4 ${ar ? 'tracking-normal' : ''}`}>
            {t('storeLabel')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
            {t('storeTitle')}
          </h2>
          <p className={`mt-4 text-gray-400 max-w-xl mx-auto text-base sm:text-lg font-light ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
            {t('storeSub')}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {['All', ...CATEGORIES.map(c => c.value)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs font-medium rounded-full border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-gray-500 border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              {cat === 'All' ? (ar ? 'الكل' : 'All') : `${cat} (${CATEGORIES.find(c => c.value === cat)?.ar || ''})`}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProjects.map((project, i) => (
            <Link
              to={`/project/${project.id}`}
              key={project.id}
              className="group relative border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 flex flex-col"
            >
              {/* Thumbnail */}
              <div className={`relative h-52 sm:h-56 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} overflow-hidden`}>
                {/* Browser chrome */}
                <div className="absolute top-3 left-3 right-3 h-5 rounded-md bg-black/30 flex items-center gap-1.5 px-2 z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                  <div className="flex-1 h-3 rounded-sm bg-white/5 ml-2" />
                </div>

                {project.images.length > 0 ? (
                  <img src={project.images[0]} alt={project.title} className="absolute inset-0 pt-12 w-full h-full object-cover" />
                ) : project.videoFile ? (
                  <div className="absolute inset-0 pt-12 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                ) : (
                  <div className="absolute inset-0 pt-12 px-4">
                    <div className="w-16 h-3 bg-white/10 rounded-sm mb-3" />
                    <div className="w-24 h-2 bg-white/5 rounded-sm mb-6" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-14 bg-white/[0.03] rounded-lg border border-white/[0.05]" />
                      <div className="h-14 bg-white/[0.03] rounded-lg border border-white/[0.05]" />
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-14 right-3 z-10">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-gray-300 border border-white/10 ${ar ? 'tracking-normal normal-case text-xs' : ''}`}>
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className={`text-base sm:text-lg font-bold text-white tracking-tight ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
                    {project.title}
                  </h3>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08] shrink-0 ${ar ? 'tracking-normal normal-case text-xs' : ''}`}>
                    {project.tag}
                  </span>
                </div>

                <p className={`text-xs text-gray-500 uppercase tracking-wider mb-3 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                  {project.category}
                </p>

                <p className={`text-sm text-gray-400 font-light leading-relaxed mb-5 flex-1 ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
                  {project.description}
                </p>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <div>
                    {project.price ? (
                      <span className={`text-xl font-bold text-white ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
                        {project.price}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600">Contact for price</span>
                    )}
                  </div>
                  <span className={`px-5 py-2 bg-white text-black text-xs font-semibold rounded-full hover:bg-gray-200 transition-all duration-300 uppercase tracking-wider ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                    Buy Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-sm">No products in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}
