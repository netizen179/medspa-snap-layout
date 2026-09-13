import { useEffect, useRef, useState } from 'react'
import { gridSlices } from '../data/content'

// Black-and-white portrait with vertical ripple/line distortion effect.
// The visible vertical ripple divisions in this image are the geometric
// reference for the 9 interaction columns below.
const HERO_IMAGE = 'https://images.pexels.com/photos/16241275/pexels-photo-16241275.jpeg?auto=compress&cs=tinysrgb&w=1400'

export function HeroPage({ scrollOpacity }: { scrollOpacity: number }) {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (v) {
        if (hoveredSlice === i + 1) {
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      }
    })
  }, [hoveredSlice])

  // The grid slice widths are proportionally mapped to the visible vertical
  // ripple divisions in the portrait — NOT equal 11.11% columns.
  // The image is the source of truth for the grid geometry.
  const totalWidth = gridSlices.reduce((sum, s) => sum + s.widthPct, 0)

  return (
    <section id="hero" className="snap-section bg-black">
      {/* Portrait background — the source of truth for the grid geometry */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Portrait"
          className="w-full h-full object-cover object-center opacity-95"
          style={{ filter: 'grayscale(1) contrast(1.08) brightness(0.9)' }}
        />
        {/* Darkening on the left for text readability; face stays unobstructed on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
      </div>

      {/* Desktop interaction grid — invisible interaction layer registered to ripple slices */}
      {!isMobile && (
        <div className="absolute inset-y-0 left-[29%] right-0 z-10 flex overflow-hidden">
          {gridSlices.map((slice, index) => {
            // Proportional flex-basis from the ripple geometry, not equal divisions
            const flexBasis = (slice.widthPct / totalWidth) * 100
            const isHovered = hoveredSlice === slice.id
            const isOtherHovered = hoveredSlice !== null && hoveredSlice !== slice.id

            return (
              <div
                key={slice.id}
                className="relative h-full transition-all duration-500 ease-in-out cursor-pointer"
                style={{
                  flexBasis: `${flexBasis}%`,
                  flexGrow: isHovered ? 2.5 : isOtherHovered ? 0.25 : 1,
                  flexShrink: 1,
                }}
                onMouseEnter={() => setHoveredSlice(slice.id)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                {/* Hover media overlay — fades to full opacity on hover */}
                <div
                  className="absolute inset-0 overflow-hidden bg-black transition-opacity duration-500"
                  style={{ opacity: isHovered ? 1 : 0 }}
                >
                  {slice.type === 'video' ? (
                    <video
                      ref={(el) => { videoRefs.current[index] = el }}
                      src={slice.src}
                      className="w-full h-full object-cover object-center"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={slice.src}
                      alt={slice.label}
                      className="w-full h-full object-cover object-center"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Subtle slice label on hover */}
                <div
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-widest text-white/70 transition-opacity duration-500"
                  style={{ opacity: isHovered ? 1 : 0 }}
                >
                  {slice.label}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Mobile accordion fallback */}
      {isMobile && (
        <div className="absolute inset-0 z-10 flex flex-col justify-end pb-20 px-6 overflow-y-auto">
          <div className="space-y-2 mb-4">
            {gridSlices.map((slice) => {
              const isOpen = openAccordion === slice.id
              return (
                <div
                  key={slice.id}
                  className="border border-white/10 rounded-lg overflow-hidden bg-black/60 backdrop-blur-sm"
                >
                  <button
                    onClick={() => setOpenAccordion(isOpen ? null : slice.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest text-zinc-300"
                  >
                    {slice.label}
                    <span className="text-gold">{isOpen ? '−' : '+'}</span>
                  </button>
                  <div
                    className="transition-all duration-500 overflow-hidden"
                    style={{
                      maxHeight: isOpen ? '300px' : '0px',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    {slice.type === 'video' ? (
                      <video src={slice.src} className="w-full h-48 object-cover" muted loop playsInline autoPlay />
                    ) : (
                      <img src={slice.src} alt={slice.label} className="w-full h-48 object-cover" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Left-aligned content — sits over the dark negative space, not the face */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-center pl-[5vw] md:pl-[7vw] pr-6 md:pr-0 max-w-[600px]"
        style={{ opacity: scrollOpacity }}
      >
        <p className="eyebrow anim-fade-up anim-delay-1 mb-6">
          Redefining Perfection
        </p>
        <h1 className="anim-fade-up anim-delay-2 font-serif uppercase text-ivory font-light leading-[1.05] text-[56px] md:text-[88px] lg:text-[96px] tracking-tight">
          Beyond<br />Surface
        </h1>
        <p className="anim-fade-up anim-delay-3 mt-8 text-sm md:text-base text-zinc-300 font-sans font-light leading-relaxed max-w-[380px]">
          Where artistry meets innovation.<br />
          Elevating beauty through precision and vision.
        </p>
        <a
          href="#services"
          className="cta-link anim-fade-up anim-delay-4 mt-10 self-start"
        >
          Discover More <span className="arrow">→</span>
        </a>
      </div>
    </section>
  )
}
