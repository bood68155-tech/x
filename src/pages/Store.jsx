import { useState, useEffect, useCallback } from 'react'
import { useProjects, CATEGORIES } from '../admin/ProjectsContext'
import { useLanguage } from '../i18n/LanguageContext'
import { supabase } from '../lib/supabaseClient'

const GRADIENTS = [
  'from-gray-800 to-gray-900', 'from-gray-900 to-black', 'from-gray-800 to-gray-900',
  'from-gray-900 to-gray-800', 'from-black to-gray-900', 'from-gray-800 to-gray-900',
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

const BINANCE_WALLET_DEFAULT = 'TJKY5CWJ684NVVczFpuTWKnEvHgeb8pcvr'

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

/* ===== BINANCE PAY CHECKOUT MODAL ===== */
function BinancePayModal({ project, onClose }) {
  const [txHash, setTxHash] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [network, setNetwork] = useState('TRC20')

  const walletAddress = project.binanceWallet || BINANCE_WALLET_DEFAULT
  const numericTotal = parsePrice(project.price)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
    } catch {
      const el = document.createElement('textarea')
      el.value = walletAddress
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!txHash.trim()) return
    setLoading(true)
    setError('')
    try {
      const { error: insertError } = await supabase.from('orders').insert({
        items: [{ id: project.id, title: project.title, price: project.price }],
        total: numericTotal,
        payment_method: `BINANCE_PAY_${network}`,
        transaction_id: txHash.trim(),
        status: 'pending_verification',
        project_id: project.id,
        project_title: project.title,
        project_price: project.price,
      })
      if (insertError) throw insertError
      setSuccess(true)
    } catch (err) {
      setError(err?.message || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Payment Submitted!</h3>
        <p className="text-gray-400 text-sm mb-2">Your payment is now <span className="text-yellow-400 font-medium">under verification</span>.</p>
        <p className="text-gray-500 text-xs mb-4">TxID: <span className="font-mono text-gray-300 break-all">{txHash.trim()}</span></p>
        <button onClick={onClose} className="px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all">Done</button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Order Summary */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Order Summary</p>
        <p className="text-sm font-semibold text-white mb-1">{project.title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{formatPrice(project.price) || 'Contact'}</span>
          <span className="text-xs text-gray-500">one-time</span>
        </div>
      </div>

      {/* Network Toggle */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment Network</p>
        <div className="flex gap-2">
          {['TRC20', 'BEP20'].map(n => (
            <button key={n} onClick={() => setNetwork(n)}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-all ${network === n ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-white/[0.03] border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20'}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-3 border-t border-b border-white/[0.06]">
        <span className="text-sm text-gray-400 font-medium">Total to Pay</span>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{numericTotal}</span>
          <span className="text-sm text-gray-500 ml-1">USDT</span>
        </div>
      </div>

      {/* Wallet Address */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deposit Address (USDT · {network})</label>
        <div className="flex items-stretch gap-2">
          <div className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 font-mono break-all leading-relaxed select-all">{walletAddress}</div>
          <button onClick={handleCopy}
            className={`shrink-0 px-4 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${copied ? 'bg-green-500/15 border border-green-500/25 text-green-400' : 'bg-white/[0.06] border border-white/10 text-gray-300 hover:text-white hover:border-white/25'}`}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">How to Pay</p>
        <ol className="space-y-1.5 text-xs text-gray-400 font-light">
          <li className="flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-white/[0.06] text-gray-500 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">1</span> Open your Binance app or wallet.</li>
          <li className="flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-white/[0.06] text-gray-500 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">2</span> Send exactly <span className="text-white font-medium">{numericTotal} USDT</span> on the <span className="text-white font-medium">{network}</span> network.</li>
          <li className="flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-white/[0.06] text-gray-500 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">3</span> Copy the Transaction Hash (TxID) from your wallet.</li>
          <li className="flex items-start gap-2"><span className="w-4 h-4 rounded-full bg-white/[0.06] text-gray-500 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">4</span> Paste it below and confirm payment.</li>
        </ol>
      </div>

      {/* TxID Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Transaction Hash / TxID</label>
          <input type="text" value={txHash} onChange={e => { setTxHash(e.target.value); setError('') }}
            placeholder="Paste your TxID here..." required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all" />
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
            {error}
          </div>
        )}
        <button type="submit" disabled={loading || !txHash.trim()}
          className="w-full py-3.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-all uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting...</> : 'Confirm Payment'}
        </button>
      </form>
      <p className="text-center text-[10px] text-gray-600">Verification takes 1-3 confirmations. You'll receive access once confirmed.</p>
    </div>
  )
}

/* ===== PRODUCT DETAIL MODAL ===== */
function ProductDetailModal({ project, onClose, onBuy }) {
  const { language, t } = useLanguage()
  const ar = language === 'ar'
  const fontClass = ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''
  const [activeImage, setActiveImage] = useState(0)

  const gallerySet = new Set()
  const allMedia = []
  if (project.imageUrl) { allMedia.push({ type: 'image', src: project.imageUrl }); gallerySet.add(project.imageUrl) }
  for (const src of (project.gallery || [])) { if (src && !gallerySet.has(src)) { allMedia.push({ type: 'image', src }); gallerySet.add(src) } }
  if (project.videoUrl) { allMedia.push({ type: 'video', src: project.videoUrl }) }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0f0f12] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Main Media */}
        <div className="relative aspect-video rounded-t-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {allMedia.length > 0 ? (
            allMedia[activeImage]?.type === 'video'
              ? <video src={allMedia[activeImage].src} controls playsInline className="w-full h-full object-cover" poster={project.imageUrl || FALLBACK_IMAGES[0]} />
              : <img src={allMedia[activeImage]?.src} alt={project.title} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
          ) : <img src={FALLBACK_IMAGES[0]} alt="" className="w-full h-full object-cover opacity-40" loading="lazy" />}
        </div>

        {/* Thumbnails */}
        {allMedia.length > 1 && (
          <div className="flex gap-2 px-6 pt-4 overflow-x-auto">
            {allMedia.map((media, idx) => (
              <button key={idx} onClick={() => setActiveImage(idx)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-white scale-105' : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'}`}>
                {media.type === 'video' ? (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center"><svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div>
                ) : <img src={media.src} alt="" className="w-full h-full object-cover" />}
              </button>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-4 gap-3">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold text-white tracking-tight ${fontClass}`}>{project.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{project.category}</p>
            </div>
            {project.tag && (
              <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08] shrink-0 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>{project.tag}</span>
            )}
          </div>

          <p className={`text-gray-400 text-sm sm:text-base leading-relaxed mb-6 ${fontClass}`}>{project.description}</p>

          {/* Features */}
          {project.features?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Features</h4>
              <ul className="space-y-2">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price */}
          {project.price && (
            <div className="flex items-center justify-between py-4 border-t border-b border-white/[0.06] mb-6">
              <span className="text-sm text-gray-400">Price</span>
              <span className="text-2xl font-bold text-white">{formatPrice(project.price)}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3.5 bg-white/5 border border-white/20 text-white font-medium text-sm rounded-xl hover:bg-white/10 hover:border-white/30 transition-all text-center flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                {t('productDemo')}
              </a>
            )}
            {project.sourceCodeUrl && (
              <a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3.5 bg-white/5 border border-white/20 text-white font-medium text-sm rounded-xl hover:bg-white/10 hover:border-white/30 transition-all text-center flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                Source Code
              </a>
            )}
            <button onClick={() => { onClose(); onBuy(project) }}
              className="flex-1 py-3.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-gray-200 transition-all text-center uppercase tracking-wider">
              Buy Now {formatPrice(project.price) ? `— ${formatPrice(project.price)}` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== MAIN STORE PAGE ===== */
export default function Store() {
  const { projects } = useProjects()
  const { language, t } = useLanguage()
  const ar = language === 'ar'
  const fontClass = ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [checkoutProduct, setCheckoutProduct] = useState(null)

  const filteredProjects = activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory)

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') { setSelectedProduct(null); setCheckoutProduct(null) } }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    document.body.style.overflow = (selectedProduct || checkoutProduct) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedProduct, checkoutProduct])

  const handleBuy = useCallback((project) => { setCheckoutProduct(project) }, [])

  return (
    <section className="relative pt-28 pb-24 sm:pt-32 sm:pb-32 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className={`inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4 ${ar ? 'tracking-normal' : ''}`}>
            {t('storeLabel')}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight ${fontClass}`}>
            {t('storeTitle')}
          </h2>
          <p className={`mt-4 text-gray-400 max-w-xl mx-auto text-base sm:text-lg font-light ${fontClass}`}>
            {t('storeSub')}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {['All', ...CATEGORIES.map(c => c.value)].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs font-medium rounded-full border transition-all duration-300 ${activeCategory === cat ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-white/10 hover:text-white hover:border-white/30'} ${fontClass} ${ar ? 'text-sm' : ''}`}>
              {cat === 'All' ? (ar ? 'الكل' : 'All') : cat}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
          {filteredProjects.map((project, i) => (
            <div key={project.id} onClick={() => setSelectedProduct(project)}
              className="group relative bento-card overflow-hidden glow-border-hover cursor-pointer flex flex-col">
              {/* Cover */}
              <div className={`relative h-52 sm:h-56 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} overflow-hidden`}>
                <div className="absolute top-3 left-3 right-3 h-5 rounded-md bg-black/30 flex items-center gap-1.5 px-2 z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                  <div className="flex-1 h-3 rounded-sm bg-white/5 ml-2" />
                </div>

                {project.imageUrl
                  ? <img src={project.imageUrl} alt={project.title} className="absolute inset-0 pt-12 w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                  : project.gallery.length > 0
                    ? <img src={project.gallery[0]} alt={project.title} className="absolute inset-0 pt-12 w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                    : project.videoUrl
                      ? <div className="absolute inset-0 pt-12 flex items-center justify-center"><svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
                      : <img src={FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]} alt="" className="absolute inset-0 pt-12 w-full h-full object-cover opacity-40" loading="lazy" />
                }

                {/* Category Badge */}
                <div className="absolute top-14 right-3 z-10">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-gray-300 border border-white/10 ${ar ? 'tracking-normal normal-case text-xs' : ''}`}>
                    {project.category}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20">
                  <span className="px-5 py-2.5 border border-white/30 text-white text-xs font-medium rounded-xl uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300">
                    View Details
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className={`text-base sm:text-lg font-bold text-white tracking-tight ${fontClass}`}>{project.title}</h3>
                  {project.tag && (
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08] shrink-0 ${ar ? 'tracking-normal normal-case text-xs' : ''}`}>{project.tag}</span>
                  )}
                </div>
                <p className={`text-sm text-gray-400 font-light leading-relaxed mb-5 flex-1 ${fontClass}`}>{project.description}</p>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <div>
                    {formatPrice(project.price)
                      ? <span className={`text-xl font-bold text-white ${fontClass}`}>{formatPrice(project.price)}</span>
                      : <span className="text-sm text-gray-600">Contact for price</span>
                    }
                  </div>
                  <button onClick={e => { e.stopPropagation(); handleBuy(project) }}
                    className={`px-5 py-2 bg-white text-black text-xs font-semibold rounded-full hover:bg-gray-200 transition-all duration-300 uppercase tracking-wider ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-sm">No products in this category yet.</p>
          </div>
        )}
      </div>

      {/* ===== PRODUCT DETAIL MODAL ===== */}
      {selectedProduct && (
        <ProductDetailModal project={selectedProduct} onClose={() => setSelectedProduct(null)} onBuy={handleBuy} />
      )}

      {/* ===== BINANCE PAY CHECKOUT MODAL ===== */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-fade-in" onClick={() => setCheckoutProduct(null)} />
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0f0f12] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 10.894l-1.406 1.406-1.406-1.406-1.406 1.406 1.406 1.406-1.406 1.406 1.406 1.406 1.406-1.406 1.406 1.406 1.406-1.406-1.406-1.406 1.406-1.406-1.406-1.406zM12 19.5c-4.142 0-7.5-3.358-7.5-7.5s3.358-7.5 7.5-7.5 7.5 3.358 7.5 7.5-3.358 7.5-7.5 7.5zm-3.094-5.606l-1.406-1.406 1.406-1.406-1.406-1.406 1.406-1.406L12 11.094l1.406-1.406 1.406 1.406-1.406 1.406 1.406 1.406-1.406 1.406L12 13.894l-1.406-1.406-1.406 1.406 1.406 1.406z"/></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Binance Pay Checkout</h3>
                  <p className="text-xs text-gray-500">Pay with USDT via Binance</p>
                </div>
              </div>
              <button onClick={() => setCheckoutProduct(null)} className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <BinancePayModal project={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
          </div>
        </div>
      )}
    </section>
  )
}
