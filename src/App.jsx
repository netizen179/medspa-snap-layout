import { useEffect, useState } from 'react'
import { useSmoothSnap } from './hooks/useSmoothSnap'
import TopNav from './components/TopNav'
import BookNowButton from './components/BookNowButton'
import Hero from './pages/Hero'
import Services from './pages/Services'
import Testimonials from './pages/Testimonials'
import Footer from './pages/Footer'

/*
 * 4-layer vertical snap application. The scroll container uses the
 * template's `.fullpage-wrapper` class (see webflow_scroll_snap.webflow.io
     template CSS) while each 100vh layer is a `.section` snap point.
 *
 * The standalone Page 4 booking portal has been removed globally: the
 * stack now glides from Page 3 (Testimonials) straight into Page 5
 * (the final contact panel / footer hub).
 */
const SECTION_IDS = ['page-1', 'page-2', 'page-3', 'page-5']

export default function App() {
  const [activeSection, setActiveSection] = useState('page-1')

  /* Slow, buttery snap gliding between every layer */
  useSmoothSnap(SECTION_IDS)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          /* Drives the global grayscale → ivory contrast fade */
          entry.target.classList.toggle('is-active', entry.isIntersecting)
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
      <TopNav activeSection={activeSection} />
      <main>
        <Hero />
        <Services />
        <Testimonials />
        <Footer />
      </main>
      {/* Persistent floating action — the booking journey is now a direct
          Square handoff from the cards, so it is always available. */}
      <BookNowButton />
    </div>
  )
}
