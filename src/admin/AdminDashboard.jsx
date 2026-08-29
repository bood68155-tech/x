import { useState } from 'react'
import { useAuth } from './AuthContext'
import { useProjects, CATEGORIES } from './ProjectsContext'


function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const EMPTY_PROJECT = { title: '', category: 'Website', description: '', tag: '', price: '', videoFile: '', videoUrl: '', images: [], demoUrl: '' }

export default function AdminDashboard() {
  const { logout } = useAuth()
  const { projects, addProject, updateProject, deleteProject } = useProjects()
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ ...EMPTY_PROJECT })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [videoPreview, setVideoPreview] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')

  const handleEdit = (project) => {
    setFormData({ ...project })
    setVideoPreview(project.videoFile || project.videoUrl || null)
    setEditing(project.id)
  }

  const handleNew = () => {
    setFormData({ ...EMPTY_PROJECT })
    setVideoPreview(null)
    setEditing('new')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing === 'new') {
        await addProject(formData)
      } else {
        await updateProject(editing, formData)
      }
      setEditing(null)
      setFormData({ ...EMPTY_PROJECT })
      setVideoPreview(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setSaving(true)
    try {
      await deleteProject(id)
      setShowDeleteConfirm(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataURL(file)
    setFormData({ ...formData, videoFile: dataUrl })
    setVideoPreview(dataUrl)
  }

  const handleImageUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const newImages = []
    for (const file of files) {
      const dataUrl = await fileToDataURL(file)
      newImages.push(dataUrl)
    }
    setFormData({ ...formData, images: [...formData.images, ...newImages] })
  }

  const removeImage = (idx) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })
  }

  const getCategoryLabel = (value) => {
    const cat = CATEGORIES.find(c => c.value === value)
    return cat ? `${cat.label} (${cat.ar})` : value
  }

  const filteredProjects = filterCategory === 'All'
    ? projects
    : projects.filter(p => p.category === filterCategory)

  // === EDITOR VIEW ===
  if (editing !== null) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => { setEditing(null); setFormData({ ...EMPTY_PROJECT }); setVideoPreview(null) }}
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
                disabled={!formData.title.trim() || saving}
                className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : editing === 'new' ? 'Create Project' : 'Save Changes'}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl font-bold text-white mb-8">
            {editing === 'new' ? 'New Project' : 'Edit Project'}
          </h2>

          <div className="space-y-6">
            {/* Title */}
            <Field label="Project Title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} placeholder="Luxe Fashion" />

            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full appearance-none px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-all cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-black text-white">
                      {cat.label} ({cat.ar})
                    </option>
                  ))}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Tag */}
            <Field label="Tag" value={formData.tag} onChange={(v) => setFormData({ ...formData, tag: v })} placeholder="Shopify" />

            {/* Price */}
            <Field label="Price (السعر)" value={formData.price} onChange={(v) => setFormData({ ...formData, price: v })} placeholder="$999" />

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

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Project Video</label>
              <div className="space-y-3">
                {videoPreview && (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    {videoPreview.startsWith('data:video') ? (
                      <video src={videoPreview} controls className="w-full h-48 object-cover" />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <span className="text-sm text-gray-300 truncate">{videoPreview}</span>
                      </div>
                    )}
                    <button
                      onClick={() => { setFormData({ ...formData, videoFile: '', videoUrl: '' }); setVideoPreview(null) }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-white/20 hover:bg-white/[0.02] transition-all group">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <span className="text-sm text-gray-500 group-hover:text-gray-400">
                    {videoPreview ? 'Replace video' : 'Upload video file'}
                  </span>
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Live Demo URL */}
            <Field label="Live Demo URL" value={formData.demoUrl} onChange={(v) => setFormData({ ...formData, demoUrl: v })} placeholder="https://example.com" />

            {/* Image Gallery */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Image Gallery</label>
              <div className="space-y-3">
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-square">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 p-1 bg-black/60 rounded-lg text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-white/20 hover:bg-white/[0.02] transition-all group">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-500 group-hover:text-gray-400">
                    Upload images (multiple OK)
                  </span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
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

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {[{ value: 'All', label: 'All', ar: 'الكل' }, ...CATEGORIES].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 ${
                filterCategory === cat.value
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-gray-500 border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              {cat.value === 'All' ? `All (${cat.ar})` : `${cat.label} (${cat.ar})`}
            </button>
          ))}
        </div>

        <div className="border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/[0.03] border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-gray-500">
            <div className="col-span-3">Project</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-2">Tag</div>
            <div className="col-span-2">Media</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {filteredProjects.map((project) => (
            <div key={project.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors items-center">
              <div className="col-span-3">
                <p className="text-sm font-medium text-white truncate">{project.title}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{project.description}</p>
              </div>

              <div className="col-span-2">
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/[0.06] text-gray-400 border border-white/[0.08]">
                  {getCategoryLabel(project.category)}
                </span>
              </div>

              <div className="col-span-1">
                <span className="text-xs font-medium text-gray-400">
                  {project.price || '—'}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/[0.06] text-gray-400 border border-white/[0.08]">
                  {project.tag}
                </span>
              </div>

              <div className="col-span-2 flex items-center gap-2">
                {(project.videoFile || project.videoUrl) && (
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
                {!project.videoFile && !project.videoUrl && project.images.length === 0 && !project.demoUrl && (
                  <span className="text-xs text-gray-600">—</span>
                )}
              </div>

              <div className="col-span-3 flex items-center justify-end gap-2">
                {showDeleteConfirm === project.id ? (
                  <>
                    <span className="text-xs text-red-400 mr-2">Delete?</span>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={saving}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                    >
                      {saving ? '...' : 'Yes'}
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

          {filteredProjects.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-gray-600 text-sm">{filterCategory === 'All' ? 'No projects yet. Create your first one!' : `No ${filterCategory} projects found.`}</p>
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
