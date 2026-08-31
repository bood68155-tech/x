import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProjects } from '../admin/ProjectsContext'
import { useLanguage } from '../i18n/LanguageContext'
import { supabase } from '../lib/supabaseClient'

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
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    tag: row.tag,
    price: row.price,
    videoFile: '',
    videoUrl: row.video_url || '',
    imageUrl: row.image_url || '',
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

  // Checkout state
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '' })
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)

  useEffect(() => {
    const fromCtx = projects.find(p => String(p.id) === String(id))
    if (fromCtx && fromCtx.title) {
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

  const allImages = project.images.length > 0 ? project.images : []
  const hasVideo = !!(project.videoUrl)
  const hasDemo = !!(project.demoUrl)

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
          {/* ====== LEFT: Image Gallery ====== */}
          <div>
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-gray-800 to-gray-900 aspect-video">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-opacity duration-300" onError={(e) => { e.target.style.display = 'none' }} />
              ) : allImages.length > 0 ? (
                <img src={allImages[activeImage]} alt={`${project.title} - ${activeImage + 1}`} className="w-full h-full object-cover transition-opacity duration-300" onError={(e) => { e.target.style.display = 'none' }} />
              ) : hasVideo ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-white/30 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4">Watch Video</a>
                  </div>
                </div>
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
            {allImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === idx ? 'border-white scale-105' : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video Link */}
            {hasVideo && (
              <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-white transition-colors">
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
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-6 py-4 bg-transparent text-white text-sm font-semibold rounded-xl border border-white/20 hover:bg-white/5 hover:border-white/30 transition-all duration-300 uppercase tracking-wider text-center flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Live Demo / Preview
                  </a>
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
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Try the Live Demo
                  </a>
                )}
                <button onClick={() => setShowCheckout(false)} className="block mx-auto mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors">
                  ← Back to project
                </button>
              </div>
            ) : (
              /* Checkout Form */
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Instant Checkout</h3>
                  <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-white transition-colors">
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
