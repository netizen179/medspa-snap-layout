import { useEffect, useState } from 'react'
import TopNav from './components/TopNav'
import BookNowButton from './components/BookNowButton'
import Hero from './pages/Hero'
import Services from './pages/Services'
import Testimonials from './pages/Testimonials'
import Booking from './pages/Booking'
import Footer from './pages/Footer'

/*
 * 5-layer vertical snap application. The scroll container uses the
 * template's `.fullpage-wrapper` class (see webflow_scroll_snap.webflow.io
     template CSS) while each 100vh layer is a `.section` snap point.
 */
export default function App() {
  const [activeSection, setActiveSection] = useState('page-1')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )
    document.querySelectorAll('.section').forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="fullpage-wrapper min-h-screen bg-black font-sans text-zinc-100 antialiased">
      <TopNav />
      <main>
        <Hero />
        <Services />
        <Testimonials />
        <Booking />
        <Footer />
      </main>
      {/* Persistent floating action — fades out only inside the booking layer */}
      <BookNowButton hidden={activeSection === 'page-4'} />
    </div>
  )
}
