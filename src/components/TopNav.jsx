const LINKS = [
  { label: 'HOME', href: '#page-1' },
  { label: 'ABOUT', href: '#page-2' },
  { label: 'SERVICES', href: '#page-2' },
  { label: 'CONTACT', href: '#page-3' },
]

export default function TopNav() {
  return (
    <header
      className="anim-fade-up fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-10 md:py-6"
      style={{ animationDelay: '0.15s' }}
    >
      <a
        href="#page-1"
        className="font-serif text-xl font-light uppercase tracking-[0.2em] text-ivory"
      >
        Bare
      </a>
      <nav className="flex items-center gap-4 md:gap-8">
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
