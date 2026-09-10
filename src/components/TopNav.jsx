import { useEffect, useRef } from 'react'

const LINKS = [
  { label: 'HOME', href: '#page-1' },
  { label: 'ABOUT', href: '#page-2' },
  { label: 'SERVICES', href: '#page-2' },
  { label: 'CONTACT', href: '#page-3' },
]

export default function TopNav({ activeSection }) {
  const headerRef = useRef(null)
  const logoRef = useRef(null)
  const linksRef = useRef(null)

  useEffect(() => {
    const positionLinks = () => {
      const header = headerRef.current
      const logo = logoRef.current
      const links = linksRef.current
      if (!header || !logo || !links) return

      /* On the Page 2 layer the nav links slide to the left and rest
         right beside the "Bare" logo, so the exploding card grid owns
         the right half of the screen without collision. */
      if (activeSection === 'page-2' && window.innerWidth >= 768) {
        const headerRect = header.getBoundingClientRect()
        const padRight = parseFloat(getComputedStyle(header).paddingRight)
        const restLeft =
          headerRect.right - padRight - links.getBoundingClientRect().width
        const slide = logo.getBoundingClientRect().right + 28 - restLeft
        links.style.transform = `translateX(${slide}px)`
      } else {
        links.style.transform = 'translateX(0)'
      }
    }

    positionLinks()
    window.addEventListener('resize', positionLinks)
    return () => window.removeEventListener('resize', positionLinks)
  }, [activeSection])

  return (
    <header
      ref={headerRef}
      className="anim-fade-up fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-10 md:py-6"
      style={{ animationDelay: '0.15s' }}
    >
      <a
        ref={logoRef}
        href="#page-1"
        className="font-serif text-xl font-light uppercase tracking-[0.2em] text-ivory"
      >
        Bare
      </a>
      <nav
        ref={linksRef}
        className="flex items-center gap-4 transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] md:gap-8"
      >
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[9px] uppercase tracking-[0.25em] text-zinc-300 transition-colors duration-500 hover:text-ivory md:text-xs"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
