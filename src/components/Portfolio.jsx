const projects = [
  {
    title: 'Luxe Fashion',
    category: 'Shopify Theme',
    description: 'Premium fashion e-commerce with immersive product galleries',
    gradient: 'from-gray-800 to-gray-900',
    tag: 'Live',
  },
  {
    title: 'TechVault',
    category: 'Custom Build',
    description: 'High-tech electronics store with comparison tools',
    gradient: 'from-gray-900 to-black',
    tag: 'Featured',
  },
  {
    title: 'Artisan Coffee',
    category: 'WooCommerce',
    description: 'Subscription-based coffee store with dynamic pricing',
    gradient: 'from-gray-800 to-gray-900',
    tag: 'Live',
  },
  {
    title: 'Bloom Studio',
    category: 'Shopify Plus',
    description: 'Botanical brand with AR product preview integration',
    gradient: 'from-gray-900 to-gray-800',
    tag: 'Case Study',
  },
  {
    title: 'Noir Watches',
    category: 'Custom Theme',
    description: 'Luxury timepiece showcase with 360° product views',
    gradient: 'from-black to-gray-900',
    tag: 'Featured',
  },
  {
    title: 'Urban Nest',
    category: 'Shopify',
    description: 'Home decor marketplace with room visualizer tools',
    gradient: 'from-gray-800 to-gray-900',
    tag: 'Live',
  },
]

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      {/* Subtle divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4">
            Our Work
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Portfolio Showcase
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-base sm:text-lg font-light">
            A curated selection of stores we've designed and developed for our clients.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, i) => (
            <div
              key={i}
              className="group relative border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500"
            >
              {/* Preview Area */}
              <div
                className={`relative h-56 sm:h-64 bg-gradient-to-br ${project.gradient} overflow-hidden`}
              >
                {/* Fake Browser Chrome */}
                <div className="absolute top-3 left-3 right-3 h-5 rounded-md bg-black/30 flex items-center gap-1.5 px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                  <div className="flex-1 h-3 rounded-sm bg-white/5 ml-2" />
                </div>

                {/* Fake Page Content */}
                <div className="absolute inset-0 pt-12 px-4">
                  <div className="w-16 h-3 bg-white/10 rounded-sm mb-3" />
                  <div className="w-24 h-2 bg-white/5 rounded-sm mb-6" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-16 bg-white/[0.03] rounded-lg border border-white/[0.05]" />
                    <div className="h-16 bg-white/[0.03] rounded-lg border border-white/[0.05]" />
                    <div className="h-16 bg-white/[0.03] rounded-lg border border-white/[0.05]" />
                    <div className="h-16 bg-white/[0.03] rounded-lg border border-white/[0.05]" />
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="px-5 py-2.5 border border-white/30 text-white text-xs font-medium rounded-full uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300">
                    View Project
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {project.title}
                  </h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08]">
                    {project.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  {project.category}
                </p>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
