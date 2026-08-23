import { LanguageProvider } from './i18n/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-black text-white antialiased">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Portfolio />
          <Pricing />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
