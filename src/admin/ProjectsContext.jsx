import { createContext, useContext, useState } from 'react'

const CATEGORIES = [
  { value: 'Website', label: 'Website', ar: 'موقع' },
  { value: 'Store', label: 'Store', ar: 'متجر' },
  { value: 'Theme', label: 'Theme', ar: 'ثيم' },
]

const INITIAL_PROJECTS = [
  { id: 1, title: 'Luxe Fashion', category: 'Store', description: 'Premium fashion e-commerce with immersive product experience and seamless checkout.', tag: 'Shopify', price: '$1,299', videoFile: '', videoUrl: '', images: [], demoUrl: '' },
  { id: 2, title: 'TechGear Pro', category: 'Website', description: 'High-performance electronics store with advanced filtering and comparison features.', tag: 'WooCommerce', price: '$999', videoFile: '', videoUrl: '', images: [], demoUrl: '' },
  { id: 3, title: 'Organic Haven', category: 'Theme', description: 'Organic skincare brand with subscription model and personalized recommendations.', tag: 'Shopify', price: '$799', videoFile: '', videoUrl: '', images: [], demoUrl: '' },
  { id: 4, title: 'Artisan Coffee', category: 'Store', description: 'Specialty coffee roaster with subscription management and origin storytelling.', tag: 'Custom', price: '$1,499', videoFile: '', videoUrl: '', images: [], demoUrl: '' },
  { id: 5, title: 'Home & Canvas', category: 'Website', description: 'Modern home furnishings store with AR preview and room visualization tools.', tag: 'Shopify', price: '$899', videoFile: '', videoUrl: '', images: [], demoUrl: '' },
  { id: 6, title: 'FitCore Gear', category: 'Theme', description: 'Fitness equipment brand with workout integration and performance tracking.', tag: 'WooCommerce', price: '$699', videoFile: '', videoUrl: '', images: [], demoUrl: '' },
]

const ProjectsContext = createContext(null)

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS)

  const addProject = (project) => {
    const newId = Math.max(...projects.map(p => p.id), 0) + 1
    setProjects([...projects, { ...project, id: newId }])
  }

  const updateProject = (id, updates) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
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
