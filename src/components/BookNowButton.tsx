import { useEffect, useState } from 'react'

export function BookNowButton({ visible }: { visible: boolean }) {
  return (
    <a
      href="#booking"
      className={`fixed bottom-6 right-6 z-[9998] flex items-center gap-2 px-6 py-3 bg-gold text-black text-xs uppercase tracking-widest font-sans font-medium rounded-full shadow-2xl hover:bg-[#E8C84A] transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
    >
      Book Now
      <span className="text-sm">→</span>
    </a>
  )
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return scrollProgress
}

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    const sections = document.querySelectorAll('.snap-section')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(sections).indexOf(entry.target)
            setActiveSection(index)
          }
        })
      },
      { threshold: 0.5 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return activeSection
}
