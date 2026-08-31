import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useProjects, CATEGORIES } from '../admin/ProjectsContext'

const GRADIENTS = [
  'from-gray-800 to-gray-900',
  'from-gray-900 to-black',
  'from-gray-800 to-gray-900',
  'from-gray-900 to-gray-800',
  'from-black to-gray-900',
  'from-gray-800 to-gray-900',
]

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80&auto=format&fit=crop',
]

export default function Portfolio() {
  const { language, t } = useLanguage()
  const { projects } = useProjects()
  const ar = language === 'ar'
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section id="portfolio" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <span className={`inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4 ${ar ? 'tracking-normal' : ''}`}>
            {t('portLabel')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
            {t('portTitle')}
          </h2>
          <p className={`mt-4 text-gray-400 max-w-xl mx-auto text-base sm:text-lg font-light ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
            {t('portSub')}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {['All', ...CATEGORIES.map(c => c.value)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-full border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-gray-500 border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              {cat === 'All' ? 'All' : cat === 'Website' ? `Website (${ar ? 'موقع' : ''})` : cat === 'Store' ? `Store (${ar ? 'متجر' : ''})` : `Theme (${ar ? 'ثيم' : ''})`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project, i) => (
            <Link
              to={`/project/${project.id}`}
              key={project.id}
              className="group relative border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 cursor-pointer flex flex-col"
            >
              {/* Card Visual Area */}
              <div className={`relative h-56 sm:h-64 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} overflow-hidden`}>
                {/* Browser chrome */}
                <div className="absolute top-3 left-3 right-3 h-5 rounded-md bg-black/30 flex items-center gap-1.5 px-2 z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                  <div className="flex-1 h-3 rounded-sm bg-white/5 ml-2" />
                </div>

                {/* Cover image → gallery → video → fallback */}
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="absolute inset-0 pt-12 w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : project.images.length > 0 ? (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="absolute inset-0 pt-12 w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : project.videoFile ? (
                  <div className="absolute inset-0 pt-12 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                ) : (
                  <img
                    src={FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                    alt=""
                    className="absolute inset-0 pt-12 w-full h-full object-cover opacity-40"
                    loading="lazy"
                  />
                )}

                {/* Hover overlay with VIEW PROJECT button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20">
                  <span className={`px-5 py-2.5 border border-white/30 text-white text-xs font-medium rounded-full uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                    {t('portView')}
                  </span>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-base sm:text-lg font-bold text-white tracking-tight ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
                    {project.title}
                  </h3>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08] ${ar ? 'tracking-normal normal-case text-xs' : ''}`}>
                    {project.tag}
                  </span>
                </div>
                <p className={`text-xs text-gray-500 uppercase tracking-wider mb-2 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                  {project.category}
                </p>
                <p className={`text-sm text-gray-400 font-light leading-relaxed flex-1 ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
                  {project.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-sm">No projects in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}
