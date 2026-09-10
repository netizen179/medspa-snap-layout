import { useEffect, useState } from 'react'

export function Navigation() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-[5vw] py-6 transition-opacity duration-1000"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <a
        href="#hero"
        className="font-serif text-xl tracking-[0.15em] text-ivory lowercase"
      >
        Bare
      </a>
      <div className="hidden md:flex items-center gap-8">
        <a href="#hero" className="nav-link">Home</a>
        <a href="#services" className="nav-link">About</a>
        <a href="#testimonials" className="nav-link">Services</a>
        <a href="#booking" className="nav-link">Contact</a>
      </div>
      <div className="md:hidden">
        <span className="text-xs uppercase tracking-widest text-zinc-400">Menu</span>
      </div>
    </nav>
  )
}
