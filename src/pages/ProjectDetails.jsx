import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjects } from '../admin/ProjectsContext'
import { supabase } from '../lib/supabaseClient'
import ProjectDetailModal from '../components/ProjectDetailModal'

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

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects } = useProjects()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#08080a]/80 backdrop-blur-md">
      <div className="flex items-center gap-3 text-[#c29b7f]/70">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  )

  if (!project) return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#08080a]/80 backdrop-blur-md">
      <div className="text-center">
        <p className="text-[#c29b7f] text-lg mb-4">Project not found</p>
        <button onClick={() => navigate('/store')} className="px-5 py-2 bg-[#800020] text-white text-sm font-semibold rounded-lg hover:bg-[#6b0c22] transition-all">Back to Store</button>
      </div>
    </div>
  )

  return <ProjectDetailModal project={project} onClose={() => navigate('/store')} />
}
