import { useState } from 'react'
import { useAuth, DEFAULT_PROFILE_IMAGE_URL } from './AuthContext'
import { useProjects, CATEGORIES } from './ProjectsContext'
import { supabase } from '../lib/supabaseClient'

const STORAGE_BUCKET = 'projects'

const EMPTY_PROJECT = {
  title: '',
  category: 'Web Applications',
  description: '',
  tag: '',
  price: '',
  imageUrl: '',
  gallery: [],
  videoUrl: '',
  demoUrl: '',
  features: [],
  sourceCodeUrl: '',
  binancePayEnabled: false,
  binanceWallet: '',
  binancePayId: '',
}

/** Tiny animated spinner SVG */
function Spinner({ className = 'w-4 h-4' }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

/**
 * Upload a File to Supabase Storage under a given folder.
 * Returns the public URL on success, or null on failure.
 */
async function uploadToStorage(file, folder) {
  const ext = file.name.split('.').pop() || 'bin'
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, { cacheControl: '31536000', upsert: false })

  if (error) {
    console.warn('Storage upload failed, falling back to Base64:', error.message)
    return null
  }

  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path)
  return urlData?.publicUrl || null
}

/**
 * Convert a file to a Base64 data URL (fallback when Storage is unavailable).
 */
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AdminDashboard() {
  const { logout, avatarUrl, updateAvatar } = useAuth()
  const profileImage = avatarUrl || DEFAULT_PROFILE_IMAGE_URL
  const { projects, addProject, updateProject, deleteProject, refetchProjects } = useProjects()
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({ ...EMPTY_PROJECT })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [videoPreview, setVideoPreview] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)

  // Toast / feedback state
  const [toast, setToast] = useState(null) // { type: 'success' | 'error', message: string }
  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  // Feature input helper
  const [featureInput, setFeatureInput] = useState('')

  // Profile picture upload handler
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      await updateAvatar(file)
      showToast('success', 'Profile picture updated!')
    } catch (err) {
      console.error('Avatar upload error:', err)
      showToast('error', `Avatar upload failed: ${err.message}`)
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleEdit = (project) => {
    setFormData({
      ...project,
      gallery: project.gallery || [],
      features: project.features || [],
    })
    setVideoPreview(project.videoUrl || null)
    setEditing(project.id)
    setFeatureInput('')
  }

  const handleNew = () => {
    setFormData({ ...EMPTY_PROJECT })
    setVideoPreview(null)
    setEditing('new')
    setFeatureInput('')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing === 'new') {
        await addProject(formData)
        showToast('success', 'Project created successfully!')
      } else {
        await updateProject(editing, formData)
        showToast('success', 'Project updated successfully!')
      }
      setEditing(null)
      setFormData({ ...EMPTY_PROJECT })
      setVideoPreview(null)
      setFeatureInput('')
    } catch (err) {
      console.error('Save failed:', err)
      showToast('error', `Save failed: ${err.message || 'Unknown error. Check RLS policies or column schema.'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setSaving(true)
    try {
      await deleteProject(id)
      setShowDeleteConfirm(null)
      showToast('success', 'Project deleted.')
    } catch (err) {
      console.error('Delete failed:', err)
      showToast('error', `Delete failed: ${err.message || 'Unknown error.'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadMessage('Uploading video to storage...')
    try {
      const publicUrl = await uploadToStorage(file, 'videos')
      if (publicUrl) {
        setFormData(prev => ({ ...prev, videoUrl: publicUrl }))
        setVideoPreview(publicUrl)
        showToast('success', 'Video uploaded successfully!')
      } else {
        const dataUrl = await fileToDataURL(file)
        setFormData(prev => ({ ...prev, videoUrl: dataUrl }))
        setVideoPreview(dataUrl)
        showToast('error', 'Storage unavailable — video saved as Base64. Create a "projects" bucket to fix.')
      }
    } catch (err) {
      console.error('Video upload error:', err)
      showToast('error', `Video upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      setUploadMessage('')
    }
  }

  const handleGalleryUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadMessage(`Uploading ${files.length} image(s)...`)
    try {
      const newImages = []
      for (let i = 0; i < files.length; i++) {
        setUploadMessage(`Uploading image ${i + 1} of ${files.length}...`)
        const publicUrl = await uploadToStorage(files[i], 'gallery')
        if (publicUrl) {
          newImages.push(publicUrl)
        } else {
          const dataUrl = await fileToDataURL(files[i])
          newImages.push(dataUrl)
        }
      }
      setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...newImages] }))
      showToast('success', `${newImages.length} image(s) uploaded!`)
    } catch (err) {
      console.error('Gallery upload error:', err)
      showToast('error', `Image upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      setUploadMessage('')
    }
  }

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadMessage('Uploading cover image...')
    try {
      const publicUrl = await uploadToStorage(file, 'covers')
      if (publicUrl) {
        setFormData(prev => ({ ...prev, imageUrl: publicUrl }))
        showToast('success', 'Cover image uploaded!')
      } else {
        const dataUrl = await fileToDataURL(file)
        setFormData(prev => ({ ...prev, imageUrl: dataUrl }))
        showToast('error', 'Storage unavailable — cover saved as Base64. Create a "projects" bucket to fix.')
      }
    } catch (err) {
      console.error('Cover upload error:', err)
      showToast('error', `Cover upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      setUploadMessage('')
    }
  }

  const removeGalleryImage = (idx) => {
    setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }))
  }

  const addFeature = () => {
    const val = featureInput.trim()
    if (!val) return
    setFormData(prev => ({ ...prev, features: [...prev.features, val] }))
    setFeatureInput('')
  }

  const removeFeature = (idx) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))
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
      <div className="min-h-screen bg-[#161616] pt-20">
        <header className="border-b border-[#B38F6F]/10 bg-[#161616]/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => { setEditing(null); setFormData({ ...EMPTY_PROJECT }); setVideoPreview(null); setFeatureInput('') }}
              className="flex items-center gap-2 text-sm text-[#B38F6F] hover:text-[#F2F1ED] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to projects
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={!formData.title.trim() || saving || uploading}
                className="flex items-center gap-2 px-5 py-2 bg-[#710014] text-[#F2F1ED] text-sm font-semibold  hover:bg-[#5F0B1E] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {saving && <Spinner className="w-4 h-4" />}
                {saving ? 'Saving...' : editing === 'new' ? 'Create Project' : 'Save Changes'}
              </button>
            </div>
          </div>
        </header>

        {/* Upload progress indicator */}
        {uploading && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-4 mb-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#710014]/10 border border-[#710014]/20 ">
              <Spinner className="w-4 h-4 text-[#B38F6F]" />
              <span className="text-sm text-[#B38F6F] font-medium">{uploadMessage}</span>
            </div>
          </div>
        )}

        {/* Toast notification */}
        {toast && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3  text-sm font-medium shadow-xl border animate-fade-in-up ${
            toast.type === 'success'
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-[#710014]/15 text-[#B38F6F] border-[#710014]/30'
          }`}>
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {toast.message}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl font-bold text-[#F2F1ED] mb-8">
            {editing === 'new' ? 'New Project' : 'Edit Project'}
          </h2>

          <div className="space-y-6">
            {/* Title */}
            <Field label="Project Title" value={formData.title} onChange={(v) => setFormData(prev => ({ ...prev, title: v }))} placeholder="Luxe Fashion" />

            {/* Price ($ or USDT) */}
            <div>
              <label className="block text-sm font-medium text-[#B38F6F] mb-2">Price (USD / USDT)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B38F6F]/70 text-sm">$</span>
                <input type="text" value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="999 or 999 USDT"
                  className="w-full pl-8 pr-4 py-3 bg-[#B38F6F]/5 border border-[#B38F6F]/10  text-[#F2F1ED] text-sm placeholder-[#767168] focus:outline-none focus:border-[#B38F6F]/40 transition-all" />
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-[#B38F6F] mb-2">Category</label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full appearance-none px-4 py-3 bg-[#B38F6F]/5 border border-[#B38F6F]/10  text-[#F2F1ED] text-sm focus:outline-none focus:border-[#B38F6F]/40 transition-all cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-[#161616] text-[#F2F1ED]">
                      {cat.label} ({cat.ar})
                    </option>
                  ))}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B38F6F]/70 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Tag */}
            <Field label="Tag" value={formData.tag} onChange={(v) => setFormData(prev => ({ ...prev, tag: v }))} placeholder="Shopify" />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#B38F6F] mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="A brief description of the project..."
                rows={3}
                className="w-full px-4 py-3 bg-[#B38F6F]/5 border border-[#B38F6F]/10  text-[#F2F1ED] text-sm placeholder-[#767168] focus:outline-none focus:border-[#B38F6F]/40 resize-none transition-all"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-[#B38F6F] mb-2">Features <span className="text-[#B38F6F]/50 font-normal">(المميزات)</span></label>
              <div className="space-y-3">
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feat, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#B38F6F]/[0.07] text-[#F2F1ED]/80 border border-[#B38F6F]/[0.08] ">
                        {feat}
                        <button onClick={() => removeFeature(idx)} className="text-[#B38F6F]/70 hover:text-[#B38F6F] transition-colors">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }}
                    placeholder="Add a feature and press Enter"
                    className="flex-1 px-4 py-3 bg-[#B38F6F]/5 border border-[#B38F6F]/10  text-[#F2F1ED] text-sm placeholder-[#767168] focus:outline-none focus:border-[#B38F6F]/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    disabled={!featureInput.trim()}
                    className="px-4 py-3 bg-[#B38F6F]/10 text-[#F2F1ED] text-sm font-medium  hover:bg-[#B38F6F]/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Cover / Main Image */}
            <div>
              <label className="block text-sm font-medium text-[#B38F6F] mb-2">Cover Image / Main Photo <span className="text-[#B38F6F]/50 font-normal">(صورة الغلاف)</span></label>
              <div className="space-y-3">
                {formData.imageUrl && (
                  <div className="relative  overflow-hidden border border-[#B38F6F]/10 bg-[#B38F6F]/5">
                    <img src={formData.imageUrl} alt="Cover preview" className="w-full h-48 object-cover" />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-2 right-2 p-1.5 bg-[#161616]/60  text-[#B38F6F] hover:text-[#B38F6F] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-[#B38F6F]/10  cursor-pointer hover:border-[#B38F6F]/20 hover:bg-[#B38F6F]/[0.03] transition-all group">
                  <svg className="w-5 h-5 text-[#B38F6F]/70 group-hover:text-[#B38F6F] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-[#B38F6F]/70 group-hover:text-[#B38F6F]">
                    {formData.imageUrl ? 'Replace cover image' : 'Upload cover image'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" />
                </label>

                {!formData.imageUrl && (
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Or paste an image URL"
                    className="w-full px-4 py-3 bg-[#B38F6F]/5 border border-[#B38F6F]/10  text-[#F2F1ED] text-sm placeholder-[#767168] focus:outline-none focus:border-[#B38F6F]/40 transition-all"
                  />
                )}
              </div>
            </div>

            {/* Video URL + Upload */}
            <div>
              <label className="block text-sm font-medium text-[#B38F6F] mb-2">Project Video</label>
              <div className="space-y-3">
                {/* Video URL text input */}
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => { setFormData(prev => ({ ...prev, videoUrl: e.target.value })); setVideoPreview(e.target.value || null) }}
                  placeholder="Paste video URL (YouTube, Vimeo, MP4 link, etc.)"
                  className="w-full px-4 py-3 bg-[#B38F6F]/5 border border-[#B38F6F]/10  text-[#F2F1ED] text-sm placeholder-[#767168] focus:outline-none focus:border-[#B38F6F]/40 transition-all"
                />
                {videoPreview && (
                  <div className="relative  overflow-hidden border border-[#B38F6F]/10 bg-[#B38F6F]/5">
                    {videoPreview.startsWith('data:video') || videoPreview.includes('.mp4') || videoPreview.includes('.webm') ? (
                      <video src={videoPreview} controls className="w-full h-48 object-cover" />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3">
                        <svg className="w-5 h-5 text-[#B38F6F]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <span className="text-sm text-[#F2F1ED]/80 truncate">{videoPreview}</span>
                      </div>
                    )}
                    <button
                      onClick={() => { setFormData(prev => ({ ...prev, videoUrl: '' })); setVideoPreview(null) }}
                      className="absolute top-2 right-2 p-1.5 bg-[#161616]/60  text-[#B38F6F] hover:text-[#B38F6F] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-[#B38F6F]/10  cursor-pointer hover:border-[#B38F6F]/20 hover:bg-[#B38F6F]/[0.03] transition-all group">
                  <svg className="w-5 h-5 text-[#B38F6F]/70 group-hover:text-[#B38F6F] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <span className="text-sm text-[#B38F6F]/70 group-hover:text-[#B38F6F]">
                    {videoPreview ? 'Replace video' : 'Upload video file'}
                  </span>
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Live Demo URL */}
            <Field label="Live Demo URL" value={formData.demoUrl} onChange={(v) => setFormData(prev => ({ ...prev, demoUrl: v }))} placeholder="https://example.com" />

            {/* Source Code / Template URL */}
            <Field label="Source Code / Template URL" value={formData.sourceCodeUrl} onChange={(v) => setFormData(prev => ({ ...prev, sourceCodeUrl: v }))} placeholder="https://github.com/... or template download link" />

            {/* Binance Pay Settings */}
            <div>
              <label className="block text-sm font-medium text-[#B38F6F] mb-3">Binance Pay Settings</label>
              <div className="space-y-4 p-4  bg-[#B38F6F]/[0.04] border border-[#B38F6F]/[0.06]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={formData.binancePayEnabled}
                      onChange={(e) => setFormData(prev => ({ ...prev, binancePayEnabled: e.target.checked }))}
                      className="sr-only" />
                    <div className={`w-10 h-5  transition-colors ${formData.binancePayEnabled ? 'bg-yellow-500' : 'bg-[#B38F6F]/10'}`} />
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white  transition-transform ${formData.binancePayEnabled ? 'translate-x-5' : ''}`} />
                  </div>
                  <span className="text-sm text-[#F2F1ED]/80">Enable Binance Pay for this product</span>
                </label>
                {formData.binancePayEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <Field label="USDT Wallet Address (TRC20/BEP20)" value={formData.binanceWallet}
                      onChange={(v) => setFormData(prev => ({ ...prev, binanceWallet: v }))}
                      placeholder="TJKY5CWJ684NVVczFpuTWKnEvHgeb8pcvr" />
                    <Field label="Binance Pay ID (optional)" value={formData.binancePayId}
                      onChange={(v) => setFormData(prev => ({ ...prev, binancePayId: v }))}
                      placeholder="Your Binance Pay ID" />
                  </div>
                )}
              </div>
            </div>

            {/* Image Gallery */}
            <div>
              <label className="block text-sm font-medium text-[#B38F6F] mb-2">Image Gallery</label>
              <div className="space-y-3">
                {formData.gallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.gallery.map((img, idx) => (
                      <div key={idx} className="relative group  overflow-hidden border border-[#B38F6F]/10 aspect-square">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-2 right-2 p-1 bg-[#161616]/60  text-[#B38F6F] hover:text-[#B38F6F] transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-[#B38F6F]/10  cursor-pointer hover:border-[#B38F6F]/20 hover:bg-[#B38F6F]/[0.03] transition-all group">
                  <svg className="w-5 h-5 text-[#B38F6F]/70 group-hover:text-[#B38F6F] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-[#B38F6F]/70 group-hover:text-[#B38F6F]">
                    Upload images (multiple OK)
                  </span>
                  <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
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
    <div className="min-h-screen bg-[#161616] pt-20">
      <header className="border-b border-[#B38F6F]/10 bg-[#161616]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-extrabold text-[#F2F1ED] tracking-tighter hover:opacity-80 transition-opacity">
              X
            </a>
            <div className="h-5 w-px bg-[#B38F6F]/10" />
            <h1 className="text-sm font-semibold text-[#F2F1ED]">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs text-[#B38F6F]/70 hover:text-[#B38F6F] transition-colors hidden sm:block">
              View Site
            </a>
            <button
              onClick={logout}
              className="px-4 py-2 text-xs font-medium text-[#B38F6F] border border-[#B38F6F]/10  hover:text-[#F2F1ED] hover:border-[#B38F6F]/20 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3  text-sm font-medium shadow-xl border animate-fade-in-up ${
          toast.type === 'success'
            ? 'bg-green-500/10 text-green-400 border-green-500/20'
            : 'bg-[#710014]/15 text-[#B38F6F] border-[#710014]/30'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Profile Picture Section */}
        <div className="border border-[#B38F6F]/[0.08]  p-6 mb-8 bg-[#B38F6F]/[0.03]">
          <div className="flex items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative">
              <div className="w-20 h-20  overflow-hidden border border-[#B38F6F]/[0.10] bg-[#B38F6F]/[0.06]">
                {(avatarPreview || profileImage) ? (
                  <img
                    src={avatarPreview || profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#B38F6F]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
              </div>
              {avatarUploading && (
                <div className="absolute inset-0 bg-[#161616]/60  flex items-center justify-center">
                  <Spinner className="w-5 h-5 text-[#F2F1ED]" />
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#F2F1ED] mb-1">Profile Picture</h3>
              <p className="text-xs text-[#B38F6F]/70 mb-3">Upload a profile image to display in the Navbar and Hero section.</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#B38F6F]/5 border border-[#B38F6F]/[0.10]  text-sm text-[#F2F1ED]/80 hover:text-[#F2F1ED] hover:border-[#B38F6F]/20 hover:bg-[#B38F6F]/10 transition-all cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {avatarUploading ? 'Uploading...' : avatarUrl ? 'Change Picture' : 'Upload Picture'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={avatarUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#F2F1ED]">Projects</h2>
            <p className="text-sm text-[#B38F6F]/70 mt-1">{projects.length} portfolio projects</p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#710014] text-[#F2F1ED] text-sm font-semibold  hover:bg-[#5F0B1E] transition-all"
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
              className={`px-4 py-1.5 text-xs font-medium  border transition-all duration-300 ${
                filterCategory === cat.value
                  ? 'bg-[#710014] text-[#F2F1ED] border-[#B38F6F]'
                  : 'bg-transparent text-[#B38F6F]/70 border-[#B38F6F]/10 hover:text-[#F2F1ED] hover:border-[#B38F6F]/20'
              }`}
            >
              {cat.value === 'All' ? `All (${cat.ar})` : `${cat.label} (${cat.ar})`}
            </button>
          ))}
        </div>

        <div className="border border-[#B38F6F]/10  overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#B38F6F]/[0.04] border-b border-[#B38F6F]/[0.06] text-xs font-semibold uppercase tracking-wider text-[#B38F6F]/70">
            <div className="col-span-3">Project</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-2">Tag</div>
            <div className="col-span-2">Media</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {filteredProjects.map((project) => (
            <div key={project.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#B38F6F]/[0.04] last:border-b-0 hover:bg-[#B38F6F]/[0.03] transition-colors items-center">
              <div className="col-span-3">
                <p className="text-sm font-medium text-[#F2F1ED] truncate">{project.title}</p>
                <p className="text-xs text-[#B38F6F]/70 truncate mt-0.5">{project.description}</p>
              </div>

              <div className="col-span-2">
                <span className="text-xs font-medium px-2 py-1  bg-[#B38F6F]/[0.07] text-[#B38F6F] border border-[#B38F6F]/[0.08]">
                  {getCategoryLabel(project.category)}
                </span>
              </div>

              <div className="col-span-1">
                <span className="text-xs font-medium text-[#B38F6F]">
                  {project.price || '—'}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-xs font-medium px-2 py-1  bg-[#B38F6F]/[0.07] text-[#B38F6F] border border-[#B38F6F]/[0.08]">
                  {project.tag}
                </span>
              </div>

              <div className="col-span-2 flex items-center gap-2">
                {project.videoUrl && (
                  <span className="inline-flex items-center gap-1 text-xs text-[#B38F6F]/70">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    Video
                  </span>
                )}
                {project.gallery.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-[#B38F6F]/70">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    {project.gallery.length} imgs
                  </span>
                )}
                {project.features?.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-[#B38F6F]/70">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                    {project.features.length} feat
                  </span>
                )}
                {project.demoUrl && (
                  <span className="inline-flex items-center gap-1 text-xs text-[#B38F6F]/70">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Demo
                  </span>
                )}
                {!project.videoUrl && project.gallery.length === 0 && (!project.features || project.features.length === 0) && !project.demoUrl && (
                  <span className="text-xs text-[#B38F6F]/50">—</span>
                )}
              </div>

              <div className="col-span-3 flex items-center justify-end gap-2">
                {showDeleteConfirm === project.id ? (
                  <>
                    <span className="text-xs text-[#B38F6F] mr-2">Delete?</span>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={saving}
                      className="px-3 py-1.5 text-xs font-medium text-[#F2F1ED] bg-[#710014]/20 border border-[#710014]/40  hover:bg-[#710014]/30 transition-all disabled:opacity-50"
                    >
                      {saving ? '...' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-3 py-1.5 text-xs font-medium text-[#B38F6F] border border-[#B38F6F]/10  hover:text-[#F2F1ED] transition-all"
                    >
                      No
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1.5 text-xs font-medium text-[#B38F6F] border border-[#B38F6F]/10  hover:text-[#F2F1ED] hover:border-[#B38F6F]/20 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(project.id)}
                      className="px-3 py-1.5 text-xs font-medium text-[#B38F6F]/70 border border-[#710014]/15  hover:text-[#B38F6F] hover:border-[#710014]/30 transition-all"
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
              <p className="text-[#B38F6F]/50 text-sm">{filterCategory === 'All' ? 'No projects yet. Create your first one!' : `No ${filterCategory} projects found.`}</p>
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
      <label className="block text-sm font-medium text-[#B38F6F] mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[#B38F6F]/5 border border-[#B38F6F]/10  text-[#F2F1ED] text-sm placeholder-[#767168] focus:outline-none focus:border-[#B38F6F]/40 transition-all"
      />
    </div>
  )
}
