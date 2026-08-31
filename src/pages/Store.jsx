import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProjects, CATEGORIES } from '../admin/ProjectsContext'
import { useLanguage } from '../i18n/LanguageContext'
import OrderFormModal from '../components/OrderFormModal'

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

export default function Store() {
  const { projects } = useProjects()
  const { language, t } = useLanguage()
  const ar = language === 'ar'
  const fontClass = ar ? "font-['Noto_Kufi_Arabic',sans-serif]" : ''
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderProduct, setOrderProduct] = useState(null)

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null)
        setOrderModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const handleOrder = (project) => {
    setOrderProduct(project)
    setOrderModalOpen(true)
  }

  const getCategoryLabel = (value) => {
    const cat = CATEGORIES.find(c => c.value === value)
    if (!cat) return value
    return `${cat.label} (${cat.ar})`
  }

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
              {cat === 'All' ? (ar ? 'الكل' : 'All') : getCategoryLabel(cat)}
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
                  <img src={project.images[0]} alt={project.title} className="absolute inset-0 pt-12 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                ) : project.videoFile ? (
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
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOrder(project) }}
                    className={`px-5 py-2 bg-white text-black text-xs font-semibold rounded-full hover:bg-gray-200 transition-all duration-300 uppercase tracking-wider ${ar ? 'tracking-normal normal-case text-sm' : ''}`}
                  >
                    {t('storeOrder')}
                  </button>
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

      {/* ===== PRODUCT DETAIL MODAL ===== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 animate-fade-in-up">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {selectedProduct.images.length > 0 ? (
              <img src={selectedProduct.images[0]} alt={selectedProduct.title} className="w-full h-64 sm:h-80 object-cover rounded-t-2xl" onError={(e) => { e.target.style.display = 'none' }} />
            ) : selectedProduct.videoFile ? (
              <div className="relative w-full h-64 sm:h-80 rounded-t-2xl overflow-hidden bg-black flex items-center justify-center">
                <video src={selectedProduct.videoFile} controls className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="relative w-full h-64 sm:h-80 rounded-t-2xl overflow-hidden">
                <img src={FALLBACK_IMAGES[0]} alt="" className="w-full h-full object-cover opacity-40" loading="lazy" />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-4 gap-3">
                <div>
                  <h2 className={`text-2xl sm:text-3xl font-bold text-white tracking-tight ${fontClass}`}>{selectedProduct.title}</h2>
                  <p className={`text-sm text-gray-500 mt-1 ${fontClass}`}>{selectedProduct.category}</p>
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08] shrink-0 ${ar ? 'tracking-normal normal-case text-sm' : ''}`}>{selectedProduct.tag}</span>
              </div>
              <p className={`text-gray-400 text-sm sm:text-base leading-relaxed mb-6 ${fontClass}`}>{selectedProduct.description}</p>
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Price</p>
                  {selectedProduct.price ? (
                    <span className={`text-2xl font-bold text-white ${fontClass}`}>{selectedProduct.price}</span>
                  ) : (
                    <span className="text-sm text-gray-500">Contact for pricing</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => { setSelectedProduct(null); handleOrder(selectedProduct) }} className={`flex-1 py-3.5 bg-white text-black font-semibold text-sm rounded-full hover:bg-gray-200 transition-all duration-300 uppercase tracking-widest ${fontClass} ${ar ? 'tracking-normal normal-case text-base' : ''}`}>{t('productOrderThis')}</button>
                {selectedProduct.demoUrl && (
                  <a href={selectedProduct.demoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`flex-1 py-3.5 border border-white/20 text-white font-medium text-sm rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300 text-center uppercase tracking-widest ${fontClass} ${ar ? 'tracking-normal normal-case text-base' : ''}`}>{t('productDemo')} ↗</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== ORDER FORM MODAL ===== */}
      <OrderFormModal isOpen={orderModalOpen} onClose={() => { setOrderModalOpen(false); setOrderProduct(null) }} preselectedProduct={orderProduct} />
    </section>
  )
}
