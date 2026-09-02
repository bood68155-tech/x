import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const CATEGORIES = [
  { value: 'Website', label: 'Website', ar: 'موقع' },
  { value: 'Store', label: 'Store', ar: 'متجر' },
  { value: 'Theme', label: 'Theme', ar: 'ثيم' },
]

const ProjectsContext = createContext(null)

/*
 * Canonical DB columns (snake_case):
 *   id, title, description, price, category, tag,
 *   features (JSONB), image_url, gallery (JSONB),
 *   video_url, demo_url, created_at, updated_at
 *
 * Canonical React state fields (camelCase):
 *   id, title, description, price, category, tag,
 *   features, imageUrl, gallery, videoUrl, demoUrl
 */

/** Map a Supabase row → React project object */
function rowToProject(row) {
  return {
    id: row.id,
    title: row.title ?? '',
    category: row.category ?? 'Website',
    description: row.description ?? '',
    tag: row.tag ?? '',
    price: row.price ?? '',
    imageUrl: row.image_url ?? '',
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    videoUrl: row.video_url ?? '',
    demoUrl: row.demo_url ?? '',
    features: Array.isArray(row.features) ? row.features : [],
  }
}

/** Map a React project object → Supabase-ready row */
function projectToRow(project) {
  return {
    title: project.title ?? '',
    category: project.category ?? 'Website',
    description: project.description ?? '',
    tag: project.tag ?? '',
    price: project.price ?? '',
    features: project.features ?? [],
    image_url: project.imageUrl ?? '',
    gallery: project.gallery ?? [],
    video_url: project.videoUrl ?? '',
    demo_url: project.demoUrl ?? '',
  }
}

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

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
