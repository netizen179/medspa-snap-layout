import { useEffect, useState, useRef } from 'react'
import { Navigation } from './components/Navigation'
import { BookNowButton, useActiveSection } from './components/BookNowButton'
import { HeroPage } from './pages/HeroPage'
import { ServicesPage } from './pages/ServicesPage'
import { TestimonialsPage } from './pages/TestimonialsPage'
import { BookingPage } from './pages/BookingPage'
import { FooterPage } from './pages/FooterPage'

export default function App() {
  const activeSection = useActiveSection()
  const [heroOpacity, setHeroOpacity] = useState(1)
  const [servicesOpacity, setServicesOpacity] = useState(1)
  const [testimonialsOpacity, setTestimonialsOpacity] = useState(1)
  const [bookingOpacity, setBookingOpacity] = useState(1)
  const heroRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const heroEl = document.getElementById('hero')
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect()
        const heroHeight = heroEl.offsetHeight
        const scrolled = Math.min(1, Math.max(0, -rect.top / heroHeight))
        setHeroOpacity(1 - scrolled * 0.8)
      }

      const servicesEl = document.getElementById('services')
      if (servicesEl) {
        const rect = servicesEl.getBoundingClientRect()
        const elHeight = servicesEl.offsetHeight
        const scrolled = Math.min(1, Math.max(0, -rect.top / elHeight))
        setServicesOpacity(1 - scrolled * 0.5)
      }

      const testimonialsEl = document.getElementById('testimonials')
      if (testimonialsEl) {
        const rect = testimonialsEl.getBoundingClientRect()
        const elHeight = testimonialsEl.offsetHeight
        const scrolled = Math.min(1, Math.max(0, -rect.top / elHeight))
        setTestimonialsOpacity(1 - scrolled * 0.5)
      }

      const bookingEl = document.getElementById('booking')
      if (bookingEl) {
        const rect = bookingEl.getBoundingClientRect()
        const elHeight = bookingEl.offsetHeight
        const scrolled = Math.min(1, Math.max(0, -rect.top / elHeight))
        setBookingOpacity(1 - scrolled * 0.5)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Show BOOK NOW on all pages except the booking page itself (page 4)
  const showBookNow = activeSection !== 3 && activeSection !== 4

  return (
    <>
      <Navigation />
      <BookNowButton visible={showBookNow} />
      <main>
        <HeroPage scrollOpacity={heroOpacity} />
        <ServicesPage scrollOpacity={servicesOpacity} />
        <TestimonialsPage scrollOpacity={testimonialsOpacity} />
        <BookingPage scrollOpacity={bookingOpacity} />
        <FooterPage />
      </main>
    </>
  )
}
