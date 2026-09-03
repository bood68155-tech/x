import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { useProjects, CATEGORIES } from '../admin/ProjectsContext'
import ProjectDetailModal from './ProjectDetailModal'

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

const FILTER_TABS = [
  { value: 'All', en: 'All Projects', ar: 'كل المشاريع' },
  { value: 'E-Commerce Stores', en: 'E-Commerce Stores', ar: 'متاجر إلكترونية' },
  { value: 'Web Applications', en: 'Web Applications', ar: 'تطبيقات ويب' },
  { value: 'UI/UX Themes & Templates', en: 'UI/UX Themes & Templates', ar: 'قوالب وتصاميم' },
  { value: 'Automation Tools', en: 'Automation Tools', ar: 'أدوات الأتمتة' },
]

export default function Portfolio() {
  const { language, t } = useLanguage()
  const { projects } = useProjects()
  const ar = language === 'ar'
  const fontClass = ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeImage, setActiveImage] = useState(0)

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedProject(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedProject])

  const openDetail = (project) => {
    setSelectedProject(project)
    setActiveImage(0)
  }

  // Build media list for selected project
  const getMediaList = (project) => {
    const gallerySet = new Set()
    const allMedia = []
    if (project.imageUrl) {
      allMedia.push({ type: 'image', src: project.imageUrl })
      gallerySet.add(project.imageUrl)
    }
    for (const src of (project.gallery || [])) {
      if (src && !gallerySet.has(src)) {
        allMedia.push({ type: 'image', src })
        gallerySet.add(src)
      }
    }
    if (project.videoUrl) {
      allMedia.push({ type: 'video', src: project.videoUrl })
    }
    return allMedia
  }

  return (
    <section id="projects" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className={`inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4 ${ar ? 'tracking-normal' : ''}`}>
            {t('portLabel')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight ${fontClass}`}>
            {t('portTitle')}
          </h2>
          <p className={`mt-4 text-gray-400 max-w-xl mx-auto text-base sm:text-lg font-light ${fontClass}`}>
            {t('portSub')}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={`px-4 py-2 text-xs font-medium rounded-full border transition-all duration-300 ${
                activeCategory === tab.value
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-gray-500 border-white/10 hover:text-white hover:border-white/30'
              } ${fontClass} ${ar ? 'text-sm' : ''}`}
            >
              {ar ? tab.ar : tab.en}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProjects.map((project, i) => (
            <div
              key={project.id}
              onClick={() => openDetail(project)}
              className="group relative bento-card overflow-hidden glow-border-hover cursor-pointer flex flex-col"
            >
              {/* Cover */}
              <div className={`relative h-52 sm:h-56 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} overflow-hidden`}>
                <div className="absolute top-3 left-3 right-3 h-5 rounded-md bg-black/30 flex items-center gap-1.5 px-2 z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                  <div className="flex-1 h-3 rounded-sm bg-white/5 ml-2" />
                </div>

                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="absolute inset-0 pt-12 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                ) : project.gallery.length > 0 ? (
                  <img src={project.gallery[0]} alt={project.title} className="absolute inset-0 pt-12 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                ) : project.videoUrl ? (
                  <div className="absolute inset-0 pt-12 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                ) : (
                  <img src={FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]} alt="" className="absolute inset-0 pt-12 w-full h-full object-cover opacity-40" loading="lazy" />
                )}

                {/* Category Badge */}
                <div className="absolute top-14 right-3 z-10">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-gray-300 border border-white/10 ${ar ? 'tracking-normal normal-case text-xs' : ''}`}>
                    {project.category}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20">
                  <span className={`px-5 py-2.5 border border-white/30 text-white text-xs font-medium rounded-xl uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                    {t('portView')}
                  </span>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className={`text-base sm:text-lg font-bold text-white tracking-tight ${fontClass}`}>
                    {project.title}
                  </h3>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08] shrink-0 ${ar ? 'tracking-normal normal-case text-xs' : ''}`}>
                    {project.tag}
                  </span>
                </div>
                <p className={`text-sm text-gray-400 font-light leading-relaxed flex-1 ${fontClass}`}>
                  {project.description}
                </p>
                {project.price && (
                  <div className="mt-3 pt-3 border-t border-white/[0.06]">
                    <span className="text-sm font-bold text-white">{project.price}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-sm">No projects in this category yet.</p>
          </div>
        )}
      </div>

      {/* ===== PROJECT DETAIL MODAL ===== */}
      {selectedProject && (
        <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  )
}
