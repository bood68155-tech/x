import { useState } from 'react'
import { useAuth } from './AuthContext'

const INITIAL_PROJECTS = [
  { id: 1, title: 'Luxe Fashion', category: 'Fashion & Apparel', description: 'Premium fashion e-commerce with immersive product experience and seamless checkout.', tag: 'Shopify', videoUrl: '', images: [], demoUrl: '' },
  { id: 2, title: 'TechGear Pro', category: 'Electronics', description: 'High-performance electronics store with advanced filtering and comparison features.', tag: 'WooCommerce', videoUrl: '', images: [], demoUrl: '' },
  { id: 3, title: 'Organic Haven', category: 'Health & Beauty', description: 'Organic skincare brand with subscription model and personalized recommendations.', tag: 'Shopify', videoUrl: '', images: [], demoUrl: '' },
  { id: 4, title: 'Artisan Coffee', category: 'Food & Beverage', description: 'Specialty coffee roaster with subscription management and origin storytelling.', tag: 'Custom', videoUrl: '', images: [], demoUrl: '' },
  { id: 5, title: 'Home & Canvas', category: 'Home Decor', description: 'Modern home furnishings store with AR preview and room visualization tools.', tag: 'Shopify', videoUrl: '', images: [], demoUrl: '' },
  { id: 6, title: 'FitCore Gear', category: 'Sports & Fitness', description: 'Fitness equipment brand with workout integration and performance tracking.', tag: 'WooCommerce', videoUrl: '', images: [], demoUrl: '' },
]

const EMPTY_PROJECT = { title: '', category: '', description: '', tag: '', videoUrl: '', images: [], demoUrl: '' }

export default function AdminDashboard() {
  const { logout } = useAuth()
  const [projects, setProjects] = useState(INITIAL_PROJECTS)
  const [editing, setEditing] = useState(null) // null = list view, 'new' = create, number = edit id
  const [formData, setFormData] = useState({ ...EMPTY_PROJECT })
  const [newImageUrl, setNewImageUrl] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [saved, setSaved] = useState(false)

  const handleEdit = (project) => {
    setFormData({ ...project })
    setEditing(project.id)
  }

  const handleNew = () => {
    setFormData({ ...EMPTY_PROJECT })
    setEditing('new')
  }

  const handleSave = () => {
    if (editing === 'new') {
      const newId = Math.max(...projects.map(p => p.id), 0) + 1
      setProjects([...projects, { ...formData, id: newId }])
    } else {
      setProjects(projects.map(p => p.id === editing ? { ...formData } : p))
    }
    setEditing(null)
    setFormData({ ...EMPTY_PROJECT })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id))
    setShowDeleteConfirm(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] })
      setNewImageUrl('')
    }
  }

  const removeImage = (idx) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })
  }

  // === EDITOR VIEW ===
  if (editing !== null) {
    return (
      <div className="min-h-screen bg-black pt-20">
        {/* Top Bar */}
        <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => { setEditing(null); setFormData({ ...EMPTY_PROJECT }) }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to projects
            </button>
            <div className="flex items-center gap-3">
              {saved && (
                <span className="text-xs text-green-400 font-medium animate-fade-in">Saved!</span>
              )}
              <button
                onClick={handleSave}
                disabled={!formData.title.trim()}
                className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {editing === 'new' ? 'Create Project' : 'Save Changes'}
              </button>
            </div>
          </div>
        </header>

        {/* Editor Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl font-bold text-white mb-8">
            {editing === 'new' ? 'New Project' : 'Edit Project'}
          </h2>

          <div className="space-y-6">
            {/* Title */}
            <Field label="Project Title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} placeholder="Luxe Fashion" />

            {/* Category */}
            <Field label="Category" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} placeholder="Fashion & Apparel" />

            {/* Tag */}
            <Field label="Tag" value={formData.tag} onChange={(v) => setFormData({ ...formData, tag: v })} placeholder="Shopify" />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A brief description of the project..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 resize-none transition-all"
              />
            </div>

            {/* Video URL */}
            <Field label="Video URL" value={formData.videoUrl} onChange={(v) => setFormData({ ...formData, videoUrl: v })} placeholder="https://youtube.com/watch?v=..." />

            {/* Live Demo URL */}
            <Field label="Live Demo URL" value={formData.demoUrl} onChange={(v) => setFormData({ ...formData, demoUrl: v })} placeholder="https://example.com" />

            {/* Image Gallery */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Image Gallery</label>
              <div className="space-y-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl">
                      <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span className="text-sm text-gray-300 truncate">{img}</span>
                    </div>
                    <button
                      onClick={() => removeImage(idx)}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    placeholder="Paste image URL..."
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all"
                  />
                  <button
                    onClick={addImage}
                    disabled={!newImageUrl.trim()}
                    className="px-4 py-2.5 bg-white/10 border border-white/10 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/15 transition-all disabled:opacity-30"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // === LIST VIEW ===
  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-black text-white tracking-tighter hover:opacity-80 transition-opacity">
              X
            </a>
            <div className="h-5 w-px bg-white/10" />
            <h1 className="text-sm font-semibold text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors hidden sm:block">
              View Site
            </a>
            <button
              onClick={logout}
              className="px-4 py-2 text-xs font-medium text-gray-400 border border-white/10 rounded-lg hover:text-white hover:border-white/20 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Projects</h2>
            <p className="text-sm text-gray-500 mt-1">{projects.length} portfolio projects</p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>

        {/* Projects Table */}
        <div className="border border-white/10 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/[0.03] border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-gray-500">
            <div className="col-span-3">Project</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Tag</div>
            <div className="col-span-2">Media</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {/* Rows */}
          {projects.map((project) => (
            <div key={project.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors items-center">
              {/* Project Name */}
              <div className="col-span-3">
                <p className="text-sm font-medium text-white truncate">{project.title}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{project.description}</p>
              </div>

              {/* Category */}
              <div className="col-span-2">
                <span className="text-sm text-gray-400">{project.category}</span>
              </div>

              {/* Tag */}
              <div className="col-span-2">
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/[0.06] text-gray-400 border border-white/[0.08]">
                  {project.tag}
                </span>
              </div>

              {/* Media */}
              <div className="col-span-2 flex items-center gap-2">
                {project.videoUrl && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    Video
                  </span>
                )}
                {project.images.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    {project.images.length} imgs
                  </span>
                )}
                {project.demoUrl && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Demo
                  </span>
                )}
                {!project.videoUrl && project.images.length === 0 && !project.demoUrl && (
                  <span className="text-xs text-gray-600">—</span>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-3 flex items-center justify-end gap-2">
                {showDeleteConfirm === project.id ? (
                  <>
                    <span className="text-xs text-red-400 mr-2">Delete?</span>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-400 border border-white/10 rounded-lg hover:text-white transition-all"
                    >
                      No
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-400 border border-white/10 rounded-lg hover:text-white hover:border-white/20 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(project.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-400/70 border border-red-500/10 rounded-lg hover:text-red-400 hover:border-red-500/20 transition-all"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-gray-600 text-sm">No projects yet. Create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all"
      />
    </div>
  )
}
