import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProjects } from '../admin/ProjectsContext'
import { useLanguage } from '../i18n/LanguageContext'
import { supabase } from '../lib/supabaseClient'

function rowToProject(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    tag: row.tag,
    price: row.price,
    videoFile: '',
    videoUrl: row.video_url || '',
    images: Array.isArray(row.images) ? row.images : [],
    demoUrl: row.demo_url || '',
  }
}

export default function ProjectDetails() {
  const { id } = useParams()
  const { projects } = useProjects()
  const { language } = useLanguage()
  const ar = language === 'ar'
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    // First try context (already loaded)
    const fromCtx = projects.find(p => String(p.id) === String(id))
    if (fromCtx && fromCtx.title) {
      setProject(fromCtx)
      setLoading(false)
      return
    }

    // Fallback: fetch from Supabase directly
    async function fetchProject() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        console.error('Project not found:', error?.message)
        setLoading(false)
        return
      }

      setProject(rowToProject(data))
      setLoading(false)
    }

    fetchProject()
  }, [id, projects])

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-28 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Loading project...</span>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black pt-28 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Project not found</p>
        <Link
          to="/store"
          className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all"
        >
          Back to Store
        </Link>
      </div>
    )
  }

  const handleOrder = () => {
    const params = new URLSearchParams({
      product: project.title,
      price: project.price || '',
      category: project.category,
    })
    window.location.href = `/contact?${params.toString()}#contact`
  }

  const allImages = project.images.length > 0 ? project.images : []
  const hasVideo = !!(project.videoUrl)

  return (
    <section className="relative pt-28 pb-24 sm:pt-32 sm:pb-32 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-gray-500">
            <li>
              <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
            </li>
            <li>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link to="/store" className="hover:text-gray-300 transition-colors">Store</Link>
            </li>
            <li>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-white">{project.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Image Gallery */}
          <div>
            {/* Main Image / Video */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-gray-800 to-gray-900 aspect-video">
              {hasVideo && allImages.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-white/30 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4"
                    >
                      Watch Video
                    </a>
                  </div>
                </div>
              ) : allImages.length > 0 ? (
                <img
                  src={allImages[activeImage]}
                  alt={`${project.title} - ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Placeholder */
                <div className="w-full h-full flex items-center justify-center px-8">
                  <div className="w-full max-w-sm">
                    <div className="w-20 h-4 bg-white/10 rounded-sm mb-4" />
                    <div className="w-32 h-3 bg-white/5 rounded-sm mb-8" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-20 bg-white/[0.03] rounded-xl border border-white/[0.05]" />
                      <div className="h-20 bg-white/[0.03] rounded-xl border border-white/[0.05]" />
                      <div className="h-20 bg-white/[0.03] rounded-xl border border-white/[0.05] col-span-2" />
                    </div>
                  </div>
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-gray-300 border border-white/10 ${ar ? 'tracking-normal normal-case' : ''}`}>
                  {project.category}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === idx
                        ? 'border-white'
                        : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video Link (if images are shown but video also exists) */}
            {hasVideo && allImages.length > 0 && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Watch Project Video
              </a>
            )}
          </div>

          {/* Right: Project Info */}
          <div className="flex flex-col">
            {/* Tags */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08] ${ar ? 'tracking-normal normal-case' : ''}`}>
                {project.tag}
              </span>
              <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08] ${ar ? 'tracking-normal normal-case' : ''}`}>
                {project.category}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
              {project.title}
            </h1>

            {/* Price */}
            <div className="mb-6">
              {project.price ? (
                <span className={`text-3xl font-bold text-white ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
                  {project.price}
                </span>
              ) : (
                <span className="text-lg text-gray-500">Contact for pricing</span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">About this project</h2>
              <p className={`text-gray-300 font-light leading-relaxed text-base ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
                {project.description}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mb-8" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                onClick={handleOrder}
                className={`flex-1 px-6 py-3.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all duration-300 uppercase tracking-wider text-center ${ar ? 'tracking-normal normal-case text-base' : ''}`}
              >
                Order Now
              </button>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3.5 bg-transparent text-white text-sm font-semibold rounded-full border border-white/20 hover:bg-white/5 hover:border-white/30 transition-all duration-300 uppercase tracking-wider text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  View Demo
                </a>
              )}
            </div>

            {/* Back Link */}
            <Link
              to="/store"
              className="flex items-center gap-2 mt-6 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
