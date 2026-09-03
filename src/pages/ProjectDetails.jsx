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
  return {
    id: row.id,
    title: row.title ?? '',
    category: row.category ?? 'Web Applications',
    description: row.description ?? '',
    tag: row.tag ?? '',
    price: row.price ?? '',
    imageUrl: row.image_url ?? '',
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    videoUrl: row.video_url ?? '',
    demoUrl: row.demo_url ?? '',
    features: Array.isArray(row.features) ? row.features : [],
    sourceCodeUrl: row.source_code_url ?? '',
    binancePayEnabled: row.binance_pay_enabled ?? false,
    binanceWallet: row.binance_wallet ?? '',
    binancePayId: row.binance_pay_id ?? '',
  }
}

function parsePrice(priceStr) {
  if (!priceStr) return 0
  const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''))
  return isNaN(num) ? 0 : num
}

const BINANCE_WALLET_DEFAULT = 'TJKY5CWJ684NVVczFpuTWKnEvHgeb8pcvr'

function formatPrice(priceStr) {
  if (!priceStr) return null
  const clean = priceStr.trim()
  if (clean.startsWith('$') || clean.startsWith('USDT')) return clean
  return `$${clean}`
}

export default function ProjectDetails() {
  const { id } = useParams()
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
      setProject(rowToProject(data))
      setLoading(false)
    }
    fetchProject()
  }, [id, projects])

  useEffect(() => {
    document.body.style.overflow = showCheckout ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showCheckout])

  if (loading) return (
    <div className="min-h-screen bg-[#09090b] pt-28 flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-500">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <span className="text-sm">Loading project...</span>
      </div>
    </div>
  )

  if (!project) return (
    <div className="min-h-screen bg-[#09090b] pt-28 flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-lg">Project not found</p>
      <Link to="/store" className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all">Back to Store</Link>
    </div>
  )

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    if (!orderForm.name.trim() || !orderForm.email.trim()) return
    setOrderLoading(true)
    try {
      await supabase.from('orders').insert({
        project_id: project.id, project_title: project.title, project_price: project.price,
        customer_name: orderForm.name, customer_email: orderForm.email, customer_phone: orderForm.phone,
      })
    } catch (_) { /* silent */ }
    await new Promise(r => setTimeout(r, 800))
    setOrderLoading(false)
    setOrderSubmitted(true)
  }

  const handleBackToProject = () => { setShowCheckout(false); setPaymentMethod(null); setOrderSubmitted(false) }

  // Build media list
  const gallerySet = new Set()
  const allMedia = []
  if (project.imageUrl) { allMedia.push({ type: 'image', src: project.imageUrl }); gallerySet.add(project.imageUrl) }
  for (const src of (project.gallery || [])) { if (src && !gallerySet.has(src)) { allMedia.push({ type: 'image', src }); gallerySet.add(src) } }
  if (project.videoUrl) allMedia.push({ type: 'video', src: project.videoUrl })

  const hasVideo = !!project.videoUrl
  const hasDemo = !!project.demoUrl
  const numericTotal = parsePrice(project.price)
  const displayPrice = formatPrice(project.price)

  return (
    <section className="relative pt-28 pb-24 sm:pt-32 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* ====== LEFT: Media Gallery ====== */}
          <div className="lg:col-span-7">
            {/* Main Media Preview */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-gray-800 to-gray-900 aspect-video">
              {allMedia.length > 0 ? (
                allMedia[activeImage]?.type === 'video'
                  ? <video src={allMedia[activeImage].src} controls playsInline className="w-full h-full object-cover" poster={project.imageUrl || FALLBACK_IMAGES[0]} />
                  : allMedia[activeImage]?.type === 'image'
                    ? <img src={allMedia[activeImage].src} alt={`${project.title} - ${activeImage + 1}`} className="w-full h-full object-cover transition-opacity duration-300" onError={e => { e.target.style.display = 'none' }} />
                    : null
              ) : <img src={FALLBACK_IMAGES[0]} alt="" className="w-full h-full object-cover opacity-40" loading="lazy" />}
              <div className="absolute top-4 right-4 z-10">
                <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-gray-300 border border-white/10 ${ar ? 'tracking-normal normal-case' : ''}`}>{project.category}</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {allMedia.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {allMedia.map((media, idx) => (
                  <button key={idx} onClick={() => setActiveImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-white scale-105' : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'}`}>
                    {media.type === 'video'
                      ? <div className="w-full h-full bg-gray-800 flex items-center justify-center"><svg className="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div>
                      : <img src={media.src} alt="" className="w-full h-full object-cover" />}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Video Link */}
            {hasVideo && allMedia[activeImage]?.type !== 'video' && (
              <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Watch Project Video
              </a>
            )}
          </div>

          {/* ====== RIGHT: Project Info + Actions ====== */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Tags */}
            <div className="flex items-center gap-2 mb-4">
              {project.tag && (
                <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08] ${ar ? 'tracking-normal normal-case' : ''}`}>{project.tag}</span>
              )}
              <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08] ${ar ? 'tracking-normal normal-case' : ''}`}>{project.category}</span>
            </div>

            {/* Title */}
            <h1 className={`text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3 ${fontClass}`}>{project.title}</h1>

            {/* Price */}
            <div className="mb-6">
              {displayPrice ? (
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold text-white ${fontClass}`}>{displayPrice}</span>
                  <span className="text-sm text-gray-500">one-time</span>
                </div>
              ) : (
                <span className="text-lg text-gray-500">Contact for pricing</span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">About this project</h2>
              <p className={`text-gray-300 font-light leading-[1.75] text-[15px] ${fontClass}`}>{project.description}</p>
            </div>

            {/* Features */}
            {project.features?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Features</h2>
                <ul className="space-y-2.5">
                  {project.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mb-6" />

            {/* ====== ACTION BAR ====== */}
            {!showCheckout ? (
              <div className="flex flex-col gap-3">
                {/* Buy Now — Primary */}
                <button onClick={() => setShowCheckout(true)}
                  className={`w-full px-6 py-4 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 uppercase tracking-wider text-center flex items-center justify-center gap-2.5 ${fontClass} ${ar ? 'tracking-normal text-base' : ''}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                  {displayPrice ? `Buy Now — ${displayPrice}` : 'Order Now'}
                </button>

                {/* Secondary buttons row */}
                <div className="grid grid-cols-2 gap-3">
                  {hasDemo && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                      className="px-5 py-3.5 bg-white/[0.04] text-white text-sm font-medium rounded-xl border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-center flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                      Live Demo
                    </a>
                  )}
                  {project.sourceCodeUrl && (
                    <a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer"
                      className="px-5 py-3.5 bg-white/[0.04] text-white text-sm font-medium rounded-xl border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-center flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                      Source Code
                    </a>
                  )}
                </div>

                {/* Demo URL link text */}
                {hasDemo && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                    className="block text-center text-xs text-blue-400/80 hover:text-blue-300 underline underline-offset-2 break-all transition-colors">
                    {project.demoUrl}
                  </a>
                )}
              </div>
            ) : orderSubmitted ? (
              /* ====== ORDER CONFIRMED ====== */
              <div className="bg-white/[0.03] border border-emerald-500/20 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Order Confirmed!</h3>
                <p className="text-gray-400 text-sm mb-1">Thank you, <span className="text-white font-medium">{orderForm.name}</span></p>
                <p className="text-gray-500 text-xs mb-4">We'll contact you at <span className="text-gray-300">{orderForm.email}</span> shortly.</p>
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
              /* ====== CRYPTO PAYMENT ====== */
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-white">Pay with USDT</h3>
                  <button onClick={() => setPaymentMethod(null)} className="text-gray-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <CryptoPaymentCheckout items={[{ id: project.id, title: project.title, price: project.price }]} total={numericTotal} onBack={handleBackToProject} />
              </div>
            ) : paymentMethod === 'binance' ? (
              /* ====== BINANCE PAY ====== */
              <div className="bg-white/[0.03] border border-yellow-500/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-white">Binance Pay</h3>
                  <button onClick={() => setPaymentMethod(null)} className="text-gray-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                {/* Order Summary */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Order Summary</p>
                  <p className="text-sm font-semibold text-white mb-1">{project.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{numericTotal}</span>
                    <span className="text-sm text-gray-500">USDT</span>
                  </div>
                </div>
                {/* Network Toggle */}
                <div className="flex gap-2 mb-5">
                  {['TRC20', 'BEP20'].map(n => (
                    <button key={n} onClick={() => setBinanceNetwork(n)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${binanceNetwork === n ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-white/[0.03] border-white/[0.08] text-gray-500 hover:text-gray-300'}`}>{n}</button>
                  ))}
                </div>
                {/* Wallet Address */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deposit Address (USDT · {binanceNetwork})</label>
                  <div className="flex items-stretch gap-2">
                    <div className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 font-mono break-all leading-relaxed select-all">{project.binanceWallet || BINANCE_WALLET_DEFAULT}</div>
                    <button onClick={async () => {
                      try { await navigator.clipboard.writeText(project.binanceWallet || BINANCE_WALLET_DEFAULT) } catch { /* silent */ }
                      setBinanceCopied(true); setTimeout(() => setBinanceCopied(false), 2000)
                    }} className={`shrink-0 px-4 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${binanceCopied ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400' : 'bg-white/[0.06] border border-white/10 text-gray-300 hover:text-white hover:border-white/25'}`}>
                      {binanceCopied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                {/* Steps */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-5">
                  <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">How to Pay</p>
                  <ol className="space-y-1.5 text-xs text-gray-400 font-light">
                    {[
                      'Open Binance app or wallet.',
                      `Send exactly ${numericTotal} USDT on the ${binanceNetwork} network.`,
                      'Copy the Transaction Hash (TxID) after sending.',
                      'Paste it below and confirm payment.',
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-white/[0.06] text-gray-500 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                {/* TxID Form */}
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const txInput = e.target.elements.txHash
                  if (!txInput.value.trim()) return
                  setOrderLoading(true)
                  try {
                    await supabase.from('orders').insert({
                      items: [{ id: project.id, title: project.title, price: project.price }],
                      total: numericTotal, payment_method: `BINANCE_PAY_${binanceNetwork}`,
                      transaction_id: txInput.value.trim(), status: 'pending_verification',
                      project_id: project.id, project_title: project.title, project_price: project.price,
                    })
                  } catch (_) { /* silent */ }
                  await new Promise(r => setTimeout(r, 600))
                  setOrderLoading(false); setOrderSubmitted(true)
                }} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Transaction Hash / TxID</label>
                    <input name="txHash" type="text" required placeholder="Paste your TxID here..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all" />
                  </div>
                  <button type="submit" disabled={orderLoading}
                    className="w-full py-3.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-all uppercase tracking-wider disabled:opacity-40 flex items-center justify-center gap-2">
                    {orderLoading ? 'Submitting...' : 'Confirm Payment'}
                  </button>
                </form>
                <p className="text-center text-[10px] text-gray-600 mt-3">Verification takes 1-3 confirmations on the network.</p>
              </div>
            ) : !paymentMethod ? (
              /* ====== PAYMENT METHOD SELECTOR ====== */
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-white">Choose Payment Method</h3>
                  <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                {displayPrice && (
                  <div className="flex items-center justify-between py-3 border-t border-b border-white/[0.06] mb-5">
                    <span className="text-sm text-gray-400">Total</span>
                    <span className="text-xl font-bold text-white">{displayPrice}</span>
                  </div>
                )}
                <div className="space-y-3">
                  {/* Contact */}
                  <button onClick={() => setPaymentMethod('contact')}
                    className="w-full p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all flex items-center gap-4 text-left group">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:border-white/20 transition-all">
                      <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">Pay via Contact</p>
                      <p className="text-xs text-gray-500 mt-0.5">Name, email & phone — we reach out to confirm</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                  {/* USDT Crypto */}
                  <button onClick={() => setPaymentMethod('crypto')}
                    className="w-full p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all flex items-center gap-4 text-left group">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/[0.06] border border-yellow-500/10 flex items-center justify-center shrink-0 group-hover:border-yellow-500/25 transition-all">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">Pay with USDT (TRC-20)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Send crypto directly to our deposit wallet</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                  {/* Binance Pay */}
                  {project.binancePayEnabled && (
                    <button onClick={() => setPaymentMethod('binance')}
                      className="w-full p-4 rounded-xl border border-yellow-500/10 bg-yellow-500/[0.03] hover:bg-yellow-500/[0.08] hover:border-yellow-500/25 transition-all flex items-center gap-4 text-left group">
                      <div className="w-12 h-12 rounded-xl bg-yellow-500/[0.08] border border-yellow-500/15 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 10.894l-1.406 1.406-1.406-1.406-1.406 1.406 1.406 1.406-1.406 1.406 1.406 1.406 1.406-1.406 1.406 1.406 1.406-1.406-1.406-1.406 1.406-1.406-1.406-1.406zM12 19.5c-4.142 0-7.5-3.358-7.5-7.5s3.358-7.5 7.5-7.5 7.5 3.358 7.5 7.5-3.358 7.5-7.5 7.5zm-3.094-5.606l-1.406-1.406 1.406-1.406-1.406-1.406 1.406-1.406L12 11.094l1.406-1.406 1.406 1.406-1.406 1.406 1.406 1.406-1.406 1.406L12 13.894l-1.406-1.406-1.406 1.406 1.406 1.406z" /></svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">Pay with Binance Pay</p>
                        <p className="text-xs text-gray-500 mt-0.5">USDT via TRC-20 / BEP-20 network</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* ====== CONTACT CHECKOUT ====== */
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-white">Contact Checkout</h3>
                  <button onClick={() => setPaymentMethod(null)} className="text-gray-500 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
                    <input type="text" required value={orderForm.name} onChange={e => setOrderForm({ ...orderForm, name: e.target.value })} placeholder="Your name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
                    <input type="email" required value={orderForm.email} onChange={e => setOrderForm({ ...orderForm, email: e.target.value })} placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone / WhatsApp <span className="text-gray-600">(optional)</span></label>
                    <input type="tel" value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} placeholder="+1 234 567 890"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all" />
                  </div>
                  {displayPrice && (
                    <div className="flex items-center justify-between py-3 border-t border-white/[0.06]">
                      <span className="text-sm text-gray-400">Total</span>
                      <span className="text-xl font-bold text-white">{displayPrice}</span>
                    </div>
                  )}
                  <button type="submit" disabled={orderLoading || !orderForm.name.trim() || !orderForm.email.trim()}
                    className="w-full py-4 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-all uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {orderLoading ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing...</>
                    ) : <>{displayPrice ? `Pay ${displayPrice}` : 'Place Order'}</>}
                  </button>
                </form>
                <p className="text-center text-[10px] text-gray-600 mt-4">Secure checkout. We'll reach out to confirm your order.</p>
              </div>
            )}

            {/* Back Link */}
            <Link to="/store" className="flex items-center gap-2 mt-6 text-sm text-gray-500 hover:text-gray-300 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
