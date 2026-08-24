import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import { AuthProvider } from './admin/AuthContext'
import { ProjectsProvider } from './admin/ProjectsContext'
import ProtectedRoute from './admin/ProtectedRoute'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminDashboard from './admin/AdminDashboard'

function HomeSite() {
  return (
    <>
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectsProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-black text-white antialiased">
              <Navbar />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomeSite />} />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </LanguageProvider>
        </ProjectsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
