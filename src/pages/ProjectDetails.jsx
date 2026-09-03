import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
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
  return {
    id: row.id, title: row.title ?? '', category: row.category ?? 'Web Applications',
    description: row.description ?? '', tag: row.tag ?? '', price: row.price ?? '',
    imageUrl: row.image_url ?? '', gallery: Array.isArray(row.gallery) ? row.gallery : [],
    videoUrl: row.video_url ?? '', demoUrl: row.demo_url ?? '',
    features: Array.isArray(row.features) ? row.features : [],
    sourceCodeUrl: row.source_code_url ?? '',
    binancePayEnabled: row.binance_pay_enabled ?? false,
    binanceWallet: row.binance_wallet ?? '', binancePayId: row.binance_pay_id ?? '',
  }
}

function parsePrice(priceStr) {
  if (!priceStr) return 0
  return parseFloat(String(priceStr).replace(/[^0-9.]/g, '')) || 0
}

function formatPrice(priceStr) {
  if (!priceStr) return null
  const clean = priceStr.trim()
  if (clean.startsWith('$') || clean.startsWith('USDT')) return clean
  return `$${clean}`
}

const BINANCE_WALLET_DEFAULT = 'TJKY5CWJ684NVVczFpuTWKnEvHgeb8pcvr'

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects } = useProjects()
  const { language } = useLanguage()
  const ar = language === 'ar'
  const fontClass = ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '' })
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [binanceNetwork, setBinanceNetwork] = useState('TRC20')
  const [binanceCopied, setBinanceCopied] = useState(false)

  useEffect(() => {
    const fromCtx = projects.find(p => String(p.id) === String(id))
    if (fromCtx && fromCtx.title) { setProject(fromCtx); setLoading(false); return }
    async function fetchProject() {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
      if (error || !data) { setLoading(false); return }
      setProject(rowToProject(data)); setLoading(false)
    }
    fetchProject()
  }, [id, projects])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') navigate('/store') }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [navigate])

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    if (!orderForm.name.trim() || !orderForm.email.trim()) return
    setOrderLoading(true)
    try {
      await supabase.from('orders').insert({
        project_id: project.id, project_title: project.title, project_price: project.price,
        customer_name: orderForm.name, customer_email: orderForm.email, customer_phone: orderForm.phone,
      })
    } catch (_) {}
    await new Promise(r => setTimeout(r, 800))
    setOrderLoading(false); setOrderSubmitted(true)
  }

  const handleBackToProject = () => { setShowCheckout(false); setPaymentMethod(null); setOrderSubmitted(false) }

  // Build media list
  const gallerySet = new Set()
  const allMedia = []
  if (project?.imageUrl) { allMedia.push({ type: 'image', src: project.imageUrl }); gallerySet.add(project.imageUrl) }
  for (const src of (project?.gallery || [])) { if (src && !gallerySet.has(src)) { allMedia.push({ type: 'image', src }); gallerySet.add(src) } }
  if (project?.videoUrl) allMedia.push({ type: 'video', src: project.videoUrl })

  const hasVideo = !!project?.videoUrl
  const hasDemo = !!project?.demoUrl
  const numericTotal = parsePrice(project?.price)
  const displayPrice = formatPrice(project?.price)

  // === LOADING ===
  if (loading) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 text-gray-500">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  )

  // === NOT FOUND ===
  if (!project) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center">
        <p className="text-gray-400 text-lg mb-4">Project not found</p>
        <button onClick={() => navigate('/store')} className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all">Back to Store</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => navigate('/store')} />

      {/* Modal Window */}
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#0f0f12] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden animate-fade-in-up flex flex-col">

        {/* ===== MAC-STYLE TITLE BAR ===== */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-3">
            {/* Traffic light dots */}
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/store')} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all" title="Close" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="h-4 w-px bg-white/[0.08] mx-1" />
            <span className="text-xs text-gray-500 font-medium truncate max-w-[200px]">{project.title}</span>
          </div>
          <button onClick={() => navigate('/store')} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* ===== MODAL BODY — SCROLLABLE ===== */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* ========== LEFT COLUMN: Media & Actions ========== */}
            <div className="p-5 sm:p-6 border-b md:border-b-0 md:border-r border-white/[0.06]">
              {/* Main Media Preview */}
              <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-gray-800 to-gray-900 aspect-video">
                {allMedia.length > 0 ? (
                  allMedia[activeImage]?.type === 'video'
                    ? <video src={allMedia[activeImage].src} controls playsInline className="w-full h-full object-cover" poster={project.imageUrl || FALLBACK_IMAGES[0]} />
                    : allMedia[activeImage]?.type === 'image'
                      ? <img src={allMedia[activeImage].src} alt={`${project.title} - ${activeImage + 1}`} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                      : null
                ) : <img src={FALLBACK_IMAGES[0]} alt="" className="w-full h-full object-cover opacity-40" loading="lazy" />}

                {/* Category Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-gray-300 border border-white/10 ${ar ? 'tracking-normal normal-case text-xs' : ''}`}>
                    {project.category}
                  </span>
                </div>

                {/* Video indicator */}
                {hasVideo && allMedia[activeImage]?.type !== 'video' && (
                  <button onClick={() => setActiveImage(allMedia.findIndex(m => m.type === 'video'))}
                    className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium hover:bg-black/80 transition-all">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    Video
                  </button>
                )}
              </div>

              {/* Thumbnail Strip */}
              {allMedia.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {allMedia.map((media, idx) => (
                    <button key={idx} onClick={() => setActiveImage(idx)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${activeImage === idx ? 'border-white scale-105' : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'}`}>
                      {media.type === 'video'
                        ? <div className="w-full h-full bg-gray-800 flex items-center justify-center"><svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div>
                        : <img src={media.src} alt="" className="w-full h-full object-cover" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons — Below Media */}
              <div className="mt-5 space-y-2.5">
                {hasDemo && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 uppercase tracking-wider">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Live Demo
                  </a>
                )}
                {project.sourceCodeUrl && (
                  <a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium rounded-xl border border-white/[0.12] hover:border-white/[0.2] transition-all flex items-center justify-center gap-2.5 uppercase tracking-wider">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    Source Code / Template
                  </a>
                )}
                {hasVideo && allMedia[activeImage]?.type !== 'video' && (
                  <button onClick={() => setActiveImage(allMedia.findIndex(m => m.type === 'video'))}
                    className="w-full py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium rounded-xl border border-white/[0.12] hover:border-white/[0.2] transition-all flex items-center justify-center gap-2.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    Watch Video
                  </button>
                )}
              </div>

              {/* Demo URL */}
              {hasDemo && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                  className="block mt-3 text-center text-[11px] text-blue-400/70 hover:text-blue-300 break-all transition-colors">
                  {project.demoUrl}
                </a>
              )}
            </div>

            {/* ========== RIGHT COLUMN: Details & Info ========== */}
            <div className="p-5 sm:p-6 flex flex-col">
              {/* Tags */}
              <div className="flex items-center gap-2 mb-4">
                {project.tag && (
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08] ${ar ? 'tracking-normal normal-case text-xs' : ''}`}>{project.tag}</span>
                )}
              </div>

              {/* Title */}
              <h1 className={`text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2 ${fontClass}`}>{project.title}</h1>
              <p className="text-sm text-gray-500 mb-5">{project.category}</p>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-3">About the Project</h2>
                <p className={`text-gray-300 text-sm leading-[1.8] ${fontClass}`}>{project.description}</p>
              </div>

              {/* Core Technologies */}
              {project.features?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-3">Core Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.features.map((feat, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-white/[0.06] mb-5" />

              {/* ===== CHECKOUT / PAYMENT SECTION ===== */}
              {!showCheckout ? (
                <>
                  {/* Price Badge */}
                  {displayPrice ? (
                    <div className="flex items-center justify-between mb-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-sm text-gray-400">Price</span>
                      <span className={`text-2xl font-bold text-white ${fontClass}`}>{displayPrice}</span>
                    </div>
                  ) : (
                    <div className="mb-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                      <span className="text-sm text-gray-400">Contact for pricing</span>
                    </div>
                  )}

                  {/* BUY NOW — Primary CTA */}
                  <button onClick={() => setShowCheckout(true)}
                    className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                    Buy Now with Binance Pay
                  </button>

                  {/* Secondary: Pay via Contact */}
                  <button onClick={() => setShowCheckout(true)}
                    className="w-full mt-2.5 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 text-sm font-medium rounded-xl border border-white/[0.1] hover:border-white/[0.2] transition-all text-center">
                    Pay via Contact Form
                  </button>
                </>
              ) : orderSubmitted ? (
                /* ===== ORDER CONFIRMED ===== */
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Order Confirmed!</h3>
                  <p className="text-gray-400 text-sm mb-1">Thank you, <span className="text-white font-medium">{orderForm.name}</span></p>
                  <p className="text-gray-500 text-xs mb-4">We'll contact you at <span className="text-gray-300">{orderForm.email}</span>.</p>
                  {hasDemo && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4 mb-4">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                      Try the Live Demo
                    </a>
                  )}
                  <button onClick={handleBackToProject} className="block mx-auto text-xs text-gray-600 hover:text-gray-400 transition-colors">← Back to project</button>
                </div>
              ) : paymentMethod === 'crypto' ? (
                /* ===== CRYPTO PAYMENT ===== */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">Pay with USDT</h3>
                    <button onClick={() => setPaymentMethod(null)} className="text-gray-500 hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                  <CryptoPaymentCheckout items={[{ id: project.id, title: project.title, price: project.price }]} total={numericTotal} onBack={handleBackToProject} />
                </div>
              ) : paymentMethod === 'binance' ? (
                /* ===== BINANCE PAY ===== */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">Binance Pay</h3>
                    <button onClick={() => setPaymentMethod(null)} className="text-gray-500 hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-4">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Total</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-white">{numericTotal}</span>
                      <span className="text-xs text-gray-500">USDT</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {['TRC20', 'BEP20'].map(n => (
                      <button key={n} onClick={() => setBinanceNetwork(n)}
                        className={`flex-1 py-2 text-[11px] font-semibold rounded-lg border transition-all ${binanceNetwork === n ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-white/[0.03] border-white/[0.08] text-gray-500 hover:text-gray-300'}`}>{n}</button>
                    ))}
                  </div>
                  <div className="mb-4">
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Deposit Address ({binanceNetwork})</label>
                    <div className="flex items-stretch gap-1.5">
                      <div className="flex-1 px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-[11px] text-gray-300 font-mono break-all select-all leading-relaxed">{project.binanceWallet || BINANCE_WALLET_DEFAULT}</div>
                      <button onClick={async () => {
                        try { await navigator.clipboard.writeText(project.binanceWallet || BINANCE_WALLET_DEFAULT) } catch {} 
                        setBinanceCopied(true); setTimeout(() => setBinanceCopied(false), 2000)
                      }} className={`shrink-0 px-3 rounded-lg text-[10px] font-semibold transition-all ${binanceCopied ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400' : 'bg-white/[0.06] border border-white/10 text-gray-400 hover:text-white'}`}>
                        {binanceCopied ? '✓' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <ol className="space-y-1 text-[11px] text-gray-500 mb-4">
                    {['Open Binance app.', `Send ${numericTotal} USDT on ${binanceNetwork}.`, 'Copy TxID after sending.', 'Paste below and confirm.'].map((s, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-white/[0.06] text-gray-500 flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5">{i + 1}</span>{s}</li>
                    ))}
                  </ol>
                  <form onSubmit={async (e) => {
                    e.preventDefault(); const txInput = e.target.elements.txHash; if (!txInput.value.trim()) return
                    setOrderLoading(true)
                    try { await supabase.from('orders').insert({ items: [{ id: project.id, title: project.title, price: project.price }], total: numericTotal, payment_method: `BINANCE_PAY_${binanceNetwork}`, transaction_id: txInput.value.trim(), status: 'pending_verification', project_id: project.id, project_title: project.title, project_price: project.price }) } catch {}
                    await new Promise(r => setTimeout(r, 600)); setOrderLoading(false); setOrderSubmitted(true)
                  }} className="space-y-2.5">
                    <input name="txHash" type="text" required placeholder="Paste TxID..."
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs font-mono placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all" />
                    <button type="submit" disabled={orderLoading}
                      className="w-full py-3 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-all uppercase tracking-wider disabled:opacity-40">
                      {orderLoading ? 'Submitting...' : 'Confirm Payment'}
                    </button>
                  </form>
                </div>
              ) : !paymentMethod ? (
                /* ===== PAYMENT METHOD SELECTOR ===== */
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">Choose Payment Method</h3>
                  {displayPrice && (
                    <div className="flex items-center justify-between py-2.5 border-t border-b border-white/[0.06] mb-3">
                      <span className="text-xs text-gray-400">Total</span>
                      <span className="text-lg font-bold text-white">{displayPrice}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    {project.binancePayEnabled && (
                      <button onClick={() => setPaymentMethod('binance')}
                        className="w-full p-3.5 rounded-xl border border-yellow-500/10 bg-yellow-500/[0.03] hover:bg-yellow-500/[0.08] hover:border-yellow-500/25 transition-all flex items-center gap-3 text-left group">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/[0.08] border border-yellow-500/15 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 10.894l-1.406 1.406-1.406-1.406-1.406 1.406 1.406 1.406-1.406 1.406 1.406 1.406 1.406-1.406 1.406 1.406 1.406-1.406-1.406-1.406 1.406-1.406-1.406-1.406z"/></svg>
                        </div>
                        <div className="flex-1"><p className="text-xs font-semibold text-white">Binance Pay</p><p className="text-[10px] text-gray-500">USDT via TRC-20 / BEP-20</p></div>
                        <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    )}
                    <button onClick={() => setPaymentMethod('crypto')}
                      className="w-full p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all flex items-center gap-3 text-left group">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500/[0.06] border border-yellow-500/10 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="flex-1"><p className="text-xs font-semibold text-white">Pay with USDT</p><p className="text-[10px] text-gray-500">Direct crypto transfer</p></div>
                      <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <button onClick={() => setPaymentMethod('contact')}
                      className="w-full p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all flex items-center gap-3 text-left group">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:border-white/20 transition-all">
                        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                      </div>
                      <div className="flex-1"><p className="text-xs font-semibold text-white">Pay via Contact</p><p className="text-[10px] text-gray-500">Name, email & phone</p></div>
                      <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              ) : (
                /* ===== CONTACT CHECKOUT ===== */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">Contact Checkout</h3>
                    <button onClick={() => setPaymentMethod(null)} className="text-gray-500 hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                  <form onSubmit={handleOrderSubmit} className="space-y-3">
                    <input type="text" required value={orderForm.name} onChange={e => setOrderForm({ ...orderForm, name: e.target.value })} placeholder="Full name"
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all" />
                    <input type="email" required value={orderForm.email} onChange={e => setOrderForm({ ...orderForm, email: e.target.value })} placeholder="Email address"
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all" />
                    <input type="tel" value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} placeholder="Phone / WhatsApp (optional)"
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all" />
                    {displayPrice && (
                      <div className="flex items-center justify-between py-2 border-t border-white/[0.06]">
                        <span className="text-xs text-gray-400">Total</span>
                        <span className="text-lg font-bold text-white">{displayPrice}</span>
                      </div>
                    )}
                    <button type="submit" disabled={orderLoading || !orderForm.name.trim() || !orderForm.email.trim()}
                      className="w-full py-3 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-all uppercase tracking-wider disabled:opacity-40 flex items-center justify-center gap-2">
                      {orderLoading ? 'Processing...' : <>{displayPrice ? `Pay ${displayPrice}` : 'Place Order'}</>}
                    </button>
                  </form>
                </div>
              )}

              {/* Back link */}
              <button onClick={() => navigate('/store')} className="mt-4 flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Back to Store
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
