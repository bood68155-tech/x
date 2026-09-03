import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'
import { LanguageProvider } from './i18n/LanguageContext'
import { AuthProvider } from './admin/AuthContext'
import { ProjectsProvider } from './admin/ProjectsContext'
import ProtectedRoute from './admin/ProtectedRoute'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Education from './components/Education'
import Portfolio from './components/Portfolio'
import Services from './components/Services'
import Footer from './components/Footer'
import AdminDashboard from './admin/AdminDashboard'
import Store from './pages/Store'
import CryptoPaymentCheckout from './components/CryptoPaymentCheckout'
import ProjectDetails from './pages/ProjectDetails'
import OrderFormModal from './components/OrderFormModal'

const OrderModalContext = createContext(null)

export function useOrderModal() {
  return useContext(OrderModalContext)
}

function HomeSite() {
  const { openOrderModal } = useOrderModal()
  return (
    <>
      <main>
        <Hero onGetStarted={() => openOrderModal(null)} />
        <Education />
        <Portfolio />
        <Services />
      </main>
      <Footer />
    </>
  )
}

function OrderModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState(null)

  const openOrderModal = (productData) => {
    setProduct(productData)
    setIsOpen(true)
  }

  const closeOrderModal = () => {
    setIsOpen(false)
    setProduct(null)
  }

  return (
    <OrderModalContext.Provider value={{ openOrderModal }}>
      {children}
      <OrderFormModal isOpen={isOpen} onClose={closeOrderModal} preselectedProduct={product} />
    </OrderModalContext.Provider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectsProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-[#09090b] text-white antialiased">
              <OrderModalProvider>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomeSite />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/checkout/crypto" element={<CryptoPaymentCheckout />} />
                  <Route path="/project/:id" element={<ProjectDetails />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </OrderModalProvider>
            </div>
          </LanguageProvider>
        </ProjectsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
