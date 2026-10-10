import { useEffect, useState } from 'react'
import { useSmoothSnap } from './hooks/useSmoothSnap'
import TopNav from './components/TopNav'
import Hero from './pages/Hero'
import Services from './pages/Services'
import Testimonials from './pages/Testimonials'
import MindRelaxEnclave from './components/MindRelaxEnclave'
import Footer from './pages/Footer'

/*
 * Vertical snap application. `.fullpage-wrapper` hosts the template's snap
 * system; each 100vh layer is a `.section` snap point.
 *
 * Mobile/tablet only, the old "Page 4" is split into two full-screen layers:
 * Page 3 (4A — the review carousel) and #page-4b (4B — the Mindful AI
 * Enclave). <MindRelaxEnclave /> returns null at lg+, so desktop keeps its
 * original Page 3 → Page 5 flow completely untouched.
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
        <MindRelaxEnclave />
        <Footer />
      </main>
    </div>
  )
}
