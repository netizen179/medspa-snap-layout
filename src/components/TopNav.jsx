const LINKS = [
  { label: 'HOME', href: '#page-1' },
  { label: 'ABOUT', href: '#page-2' },
  { label: 'SERVICES', href: '#page-2' },
  { label: 'CONTACT', href: '#page-3' },
]

/*
 * Global sticky header. On the Page 2 layer the navbar is removed
 * entirely (faded out, non-interactive) so the exploding card grid
 * owns the full plane without collision.
 */
export default function TopNav({ activeSection }) {
  const hidden = activeSection === 'page-2'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-opacity duration-700 ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Inner wrapper carries the load-in animation so the hide/show
          opacity toggle above is never overridden by keyframe fill. */}
      <div
        className="anim-fade-up flex items-center justify-between px-4 py-4 md:px-10 md:py-6"
        style={{ animationDelay: '0.15s' }}
      >
        <a
          href="#page-1"
          className="font-serif text-lg font-light uppercase tracking-[0.2em] text-ivory md:text-xl"
        >
          Bare
        </a>
        <nav className="flex items-center gap-3 md:gap-8">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[8px] uppercase tracking-[0.2em] text-zinc-300 transition-colors duration-500 hover:text-ivory md:text-xs md:tracking-[0.25em]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
