import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProjects } from '../admin/ProjectsContext'
import { useLanguage } from '../i18n/LanguageContext'
import { supabase } from '../lib/supabaseClient'
import CryptoPaymentCheckout from '../components/CryptoPaymentCheckout'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80&auto=format&fit=crop',
]

function rowToProject(row) {
  // Normalize video URL: try video_url, then video, then media
  const videoUrl = row.video_url || row.video || row.media || ''
  // Normalize demo URL: try demo_url, then live_demo_url, then demo
  const demoUrl = row.demo_url || row.live_demo_url || row.demo || ''
  // Normalize gallery: try gallery, then images, then image_gallery
  const images = Array.isArray(row.images) ? row.images : []
  const gallery = Array.isArray(row.gallery) ? row.gallery : Array.isArray(row.image_gallery) ? row.image_gallery : []

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    tag: row.tag,
    price: row.price,
    videoFile: '',
    videoUrl,
    imageUrl: row.image_url || row.cover_image || '',
    images,
    gallery,
    features: Array.isArray(row.features) ? row.features : [],
    demoUrl,
  }
}

function parsePrice(priceStr) {
  if (!priceStr) return 0
  const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''))
  return isNaN(num) ? 0 : num
}

export default function ProjectDetails() {
  const { id } = useParams()
  const { projects } = useProjects()
  const { language } = useLanguage()
  const ar = language === 'ar'
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  // Checkout state
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null) // null | 'contact' | 'crypto'
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '' })
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)

  useEffect(() => {
    const fromCtx = projects.find(p => String(p.id) === String(id))
    if (fromCtx && fromCtx.title) {
      console.log('Project Data (from context):', fromCtx)
      setProject(fromCtx)
      setLoading(false)
      return
    }

    async function fetchProject() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setLoading(false)
        return
      }

      console.log('Project Data (from DB):', data)
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
        <Link to="/store" className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all">
          Back to Store
        </Link>
      </div>
    )
  }

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    if (!orderForm.name.trim() || !orderForm.email.trim()) return
    setOrderLoading(true)

    // Save order to Supabase
    try {
      await supabase.from('orders').insert({
        project_id: project.id,
        project_title: project.title,
        project_price: project.price,
        customer_name: orderForm.name,
        customer_email: orderForm.email,
        customer_phone: orderForm.phone,
      }).then(() => {}).catch(() => {
        // Orders table may not exist yet — that's OK
      })
    } catch (_) { /* silent */ }

    // Simulate processing
    await new Promise(r => setTimeout(r, 800))
    setOrderLoading(false)
    setOrderSubmitted(true)
  }

  const handleBackToProject = () => {
    setShowCheckout(false)
    setPaymentMethod(null)
    setOrderSubmitted(false)
  }

  // Build a unified gallery: cover image + gallery array + images array (deduplicated)
  const gallerySet = new Set()
  const allMedia = []
  // Cover image first
  if (project.imageUrl) {
    allMedia.push({ type: 'image', src: project.imageUrl })
    gallerySet.add(project.imageUrl)
  }
  // Gallery column images
  for (const src of (project.gallery || [])) {
    if (src && !gallerySet.has(src)) {
      allMedia.push({ type: 'image', src })
      gallerySet.add(src)
    }
  }
  // Legacy images array
  for (const src of project.images) {
    if (src && !gallerySet.has(src)) {
      allMedia.push({ type: 'image', src })
      gallerySet.add(src)
    }
  }
  // Video: check multiple possible field names
  const videoUrl = project.videoUrl || project.video || project.media || project.video_url || ''
  const hasVideo = !!(videoUrl)
  console.log('Video URL resolved:', videoUrl, '| hasVideo:', hasVideo)
  if (hasVideo) {
    allMedia.push({ type: 'video', src: videoUrl })
  }
  // Demo: check multiple possible field names
  const demoUrl = project.demoUrl || project.live_demo_url || project.demo || project.demo_url || ''
  const hasDemo = !!(demoUrl)
  console.log('Demo URL resolved:', demoUrl, '| hasDemo:', hasDemo)
  const numericTotal = parsePrice(project.price)

  return (
    <section className="relative pt-28 pb-24 sm:pt-32 sm:pb-32 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-gray-500">
            <li><Link to="/" className="hover:text-gray-300 transition-colors">Home</Link></li>
            <li><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
            <li><Link to="/store" className="hover:text-gray-300 transition-colors">Store</Link></li>
            <li><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
            <li className="text-white">{project.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ====== LEFT: Media Gallery ====== */}
          <div>
            {/* Main Media Preview */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-gray-800 to-gray-900 aspect-video">
              {allMedia.length > 0 ? (
                allMedia[activeImage]?.type === 'video' ? (
                  /* Inline HTML5 Video Player */
                  <video
                    src={allMedia[activeImage].src}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                    poster={project.imageUrl || FALLBACK_IMAGES[0]}
                  />
                ) : allMedia[activeImage]?.type === 'image' ? (
                  <img
                    src={allMedia[activeImage].src}
                    alt={`${project.title} - ${activeImage + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : null
              ) : (
                <img src={FALLBACK_IMAGES[0]} alt="" className="w-full h-full object-cover opacity-40" loading="lazy" />
              )}

              {/* Category Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-gray-300 border border-white/10 ${ar ? 'tracking-normal normal-case' : ''}`}>
                  {project.category}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {allMedia.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {allMedia.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === idx ? 'border-white scale-105' : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    ) : (
                      <img src={media.src} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Video Link (when video is NOT currently selected in thumbnails) */}
            {hasVideo && allMedia[activeImage]?.type !== 'video' && (
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Watch Project Video
              </a>
            )}
          </div>

          {/* ====== RIGHT: Project Info + Checkout ====== */}
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
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold text-white ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>{project.price}</span>
                  <span className="text-sm text-gray-500">one-time</span>
                </div>
              ) : (
                <span className="text-lg text-gray-500">Contact for pricing</span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">About this project</h2>
              <p className={`text-gray-300 font-light leading-relaxed text-base ${ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''}`}>
                {project.description}
              </p>
            </div>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Features</h2>
                <ul className="space-y-2">
                  {project.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mb-6" />

            {/* ====== CHECKOUT SECTION ====== */}
            {!showCheckout ? (
              /* Action Buttons */
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowCheckout(true)}
                  className={`w-full px-6 py-4 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 uppercase tracking-wider text-center flex items-center justify-center gap-2 ${ar ? 'tracking-normal normal-case text-base' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  {project.price ? `Buy Now — ${project.price}` : 'Order Now'}
                </button>
                {hasDemo && (
                  <button
                    onClick={() => window.open(demoUrl, '_blank', 'noopener,noreferrer')}
                    className="w-full px-6 py-4 bg-transparent text-white text-sm font-semibold rounded-xl border border-white/20 hover:bg-white/5 hover:border-white/30 transition-all duration-300 uppercase tracking-wider text-center flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Live Demo / Preview
                  </button>
                )}
              </div>
            ) : orderSubmitted ? (
              /* Order Confirmation */
              <div className="bg-white/[0.03] border border-green-500/20 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Order Confirmed!</h3>
                <p className="text-gray-400 text-sm mb-1">Thank you, <span className="text-white font-medium">{orderForm.name}</span></p>
                <p className="text-gray-500 text-xs">We'll contact you at <span className="text-gray-300">{orderForm.email}</span> shortly.</p>
                {hasDemo && (
                  <button onClick={() => window.open(demoUrl, '_blank', 'noopener,noreferrer')} className="inline-flex items-center gap-2 mt-6 text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Try the Live Demo
                  </button>
                )}
                <button onClick={handleBackToProject} className="block mx-auto mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors">
                  ← Back to project
                </button>
              </div>
            ) : paymentMethod === 'crypto' ? (
              /* ====== CRYPTO PAYMENT (inline) ====== */
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">Pay with USDT</h3>
                  </div>
                  <button onClick={() => setPaymentMethod(null)} className="text-gray-500 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <CryptoPaymentCheckout
                  items={[{ id: project.id, title: project.title, price: project.price }]}
                  total={numericTotal}
                  onBack={handleBackToProject}
                />
              </div>
            ) : !paymentMethod ? (
              /* ====== PAYMENT METHOD SELECTOR ====== */
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Choose Payment Method</h3>
                  <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Price Summary */}
                {project.price && (
                  <div className="flex items-center justify-between py-3 border-t border-b border-white/[0.06] mb-6">
                    <span className="text-sm text-gray-400">Total</span>
                    <span className="text-xl font-bold text-white">{project.price}</span>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Contact / Card Option */}
                  <button
                    onClick={() => setPaymentMethod('contact')}
                    className="w-full p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex items-center gap-4 text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:border-white/20 transition-all">
                      <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">Pay via Contact</p>
                      <p className="text-xs text-gray-500 mt-0.5">Name, email &amp; phone — we will reach out to confirm</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Crypto Option */}
                  <button
                    onClick={() => setPaymentMethod('crypto')}
                    className="w-full p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex items-center gap-4 text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/[0.06] border border-yellow-500/10 flex items-center justify-center shrink-0 group-hover:border-yellow-500/25 transition-all">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">Pay with USDT (TRC-20)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Send crypto directly to our deposit wallet</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              /* ====== CONTACT / CARD CHECKOUT (existing form) ====== */
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">Contact Checkout</h3>
                  </div>
                  <button onClick={() => setPaymentMethod(null)} className="text-gray-500 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={orderForm.name}
                      onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={orderForm.email}
                      onChange={e => setOrderForm({ ...orderForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone / WhatsApp <span className="text-gray-600">(optional)</span></label>
                    <input
                      type="tel"
                      value={orderForm.phone}
                      onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                      placeholder="+1 234 567 890"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>

                  {/* Price Summary */}
                  {project.price && (
                    <div className="flex items-center justify-between py-3 border-t border-white/[0.06]">
                      <span className="text-sm text-gray-400">Total</span>
                      <span className="text-xl font-bold text-white">{project.price}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={orderLoading || !orderForm.name.trim() || !orderForm.email.trim()}
                    className="w-full py-4 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {orderLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        {project.price ? `Pay ${project.price}` : 'Place Order'}
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-[10px] text-gray-600 mt-4">Secure checkout. We'll reach out to confirm your order.</p>
              </div>
            )}

            {/* Back Link */}
            <Link to="/store" className="flex items-center gap-2 mt-6 text-sm text-gray-500 hover:text-gray-300 transition-colors">
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
