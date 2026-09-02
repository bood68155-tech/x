import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const CATEGORIES = [
  { value: 'Website', label: 'Website', ar: 'موقع' },
  { value: 'Store', label: 'Store', ar: 'متجر' },
  { value: 'Theme', label: 'Theme', ar: 'ثيم' },
]

const ProjectsContext = createContext(null)

/** Map a Supabase row (snake_case) to the app's camelCase shape */
function rowToProject(row) {
  // Normalize video URL: try video_url, then video, then media
  const videoUrl = row.video_url || row.video || row.media || ''
  // Normalize demo URL: try demo_url, then live_demo_url, then demo
  const demoUrl = row.demo_url || row.live_demo_url || row.demo || ''
  // Normalize gallery: try gallery, then images, then image_gallery
  const images = Array.isArray(row.images) ? row.images : []
  const gallery = Array.isArray(row.gallery) ? row.gallery : Array.isArray(row.image_gallery) ? row.image_gallery : []

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    tag: row.tag,
    price: row.price,
    videoFile: '',
    videoUrl,
    imageUrl: row.image_url || row.cover_image || '',
    images,
    gallery,
    features: Array.isArray(row.features) ? row.features : [],
    demoUrl,
  }
}

/** Map the app's project object to a Supabase-ready row (snake_case) */
function projectToRow(project) {
  return {
    title: project.title || '',
    category: project.category || 'Website',
    description: project.description || '',
    tag: project.tag || '',
    price: project.price || '',
    video_url: project.videoUrl || '',
    image_url: project.imageUrl || '',
    demo_url: project.demoUrl || '',
    features: project.features || [],
    images: project.images || [],
    gallery: project.gallery || [],
  }
}

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch all projects from Supabase on mount
  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching projects:', error.message)
        return
      }

      setProjects(data.map(rowToProject))
    } catch (err) {
      console.error('Unexpected error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const addProject = async (project) => {
    const row = projectToRow(project)
    const { data, error } = await supabase
      .from('projects')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('Error adding project:', error.message)
      throw new Error(error.message || 'Failed to create project')
    }

    const newProject = rowToProject(data)
    setProjects(prev => [...prev, newProject])
    return newProject
  }

  const updateProject = async (id, updates) => {
    const row = projectToRow(updates)
    const { data, error } = await supabase
      .from('projects')
      .update(row)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error.message)
      throw new Error(error.message || 'Failed to update project')
    }

    const updated = rowToProject(data)
    setProjects(prev => prev.map(p => p.id === id ? updated : p))
    return updated
  }

  const deleteProject = async (id) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error.message)
      throw new Error(error.message || 'Failed to delete project')
    }

    setProjects(prev => prev.filter(p => p.id !== id))
    return true
  }

  return (
    <ProjectsContext.Provider value={{ projects, loading, addProject, updateProject, deleteProject, refetchProjects: fetchProjects }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}

export { CATEGORIES }
