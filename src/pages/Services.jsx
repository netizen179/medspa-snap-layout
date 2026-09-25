import { useEffect, useRef, useState } from 'react'
import Reveal from '../components/Reveal'
import { SQUARE_BOOKING_URL, TREATMENTS } from '../config/links'

/* ==========================================================================
   PAGE 2 — THE INTERACTIVE SERVICE HIGHLIGHTS LAYER
   Desktop (lg+): strict 50/50 split — philosophy LEFT, card deck RIGHT.
   Mobile & tablet (< lg): TWO independent full-screen 100dvh snap layers —
     2A hosts the About text, 2B hosts the card deck on its own plane, so
     the vertical page-length overflow on phones is gone entirely.
   The 5 cascading cards rest as an angled, tilted tray (task-view
   aesthetic) and explode into a spacious 3+2 grid on container hover —
   scaled per breakpoint (.deck-zone vars) and re-centered on the
   viewport so the matrix always fits inside the screen boundaries.
   ========================================================================== */

/* The deck shows the 5 services exactly as named in the live Square
   booking directory (titles hardcoded to match the client-facing portal). */
const DECK_TITLES = [
  'EY Classic PMU Technique',
  'Paramedical Camouflage Revision',
  'Clinical Laser Precision Hair Removal',
  'Advanced Cellular Medi-Peels',
  'Scalp Micropigmentation & Hairline Restoration',
]

const CARDS = TREATMENTS.slice(0, 5).map((treatment, i) => ({
  ...treatment,
  title: DECK_TITLES[i],
}))

/* Angled stack: cards tilt and fan programmatically in 3D while
   cascading back into infinite depth (center-anchored offsets). */
const STACKED = [
  'z-[50] translate-y-[55px] rotate-0 scale-100 opacity-100',
  'z-[45] translate-y-[43px] rotate-[2.5deg] scale-[0.95] opacity-90',
  'z-[40] translate-y-[31px] rotate-[-2.5deg] scale-[0.90] opacity-80',
  'z-[35] translate-y-[19px] rotate-[5deg] scale-[0.85] opacity-70',
  'z-[30] translate-y-[7px] rotate-[-5deg] scale-[0.80] opacity-60',
]

/* Mobile & tablet stack: the same cascade expressed with true 3D rotational
   scale-down values (rotateY + perspective) and matching layer indexes. */
const MOBILE_STACKED = [
  'z-[50] opacity-100',
  'z-[45] opacity-90',
  'z-[40] opacity-80',
  'z-[35] opacity-70',
  'z-[30] opacity-60',
]
const MOBILE_STACKED_TRANSFORM = [
  'translate3d(0, 52px, 0) rotateY(0deg) scale(1)',
  'translate3d(0, 39px, 0) rotateY(6deg) scale(0.95)',
  'translate3d(0, 26px, 0) rotateY(-6deg) scale(0.90)',
  'translate3d(0, 13px, 0) rotateY(8deg) scale(0.85)',
  'translate3d(0, 0px, 0) rotateY(-8deg) scale(0.80)',
]

/* Exploding grid slots: 3 cards across the top row, 2 centered below.
   Offsets/scale come from the .deck-zone breakpoint variables so the
   grid scales down and fits the viewport with no cut-off cards. */
const EXPLODED = [
  'z-10 -translate-x-[var(--deck-x)] -translate-y-[var(--deck-y)] rotate-0 scale-[var(--deck-s)] opacity-100',
  'z-10 -translate-y-[var(--deck-y)] rotate-0 scale-[var(--deck-s)] opacity-100',
  'z-10 translate-x-[var(--deck-x)] -translate-y-[var(--deck-y)] rotate-0 scale-[var(--deck-s)] opacity-100',
  'z-10 -translate-x-[calc(var(--deck-x)/2)] translate-y-[var(--deck-y)] rotate-0 scale-[var(--deck-s)] opacity-100',
  'z-10 translate-x-[calc(var(--deck-x)/2)] translate-y-[var(--deck-y)] rotate-0 scale-[var(--deck-s)] opacity-100',
]

/* Front-card exit state: slides 150px right, shrinks, fades — then
   glides back into the deepest base position. */
const LEAVING = 'z-[60] translate-y-[55px] translate-x-[150px] scale-[0.8] opacity-0'

/* Mobile & tablet exit: a crisp 3D translate-x sweep to the side, then the
   card slides back into the absolute bottom of the pile. */
const MOBILE_LEAVING = 'z-[60] opacity-0'
const MOBILE_LEAVING_TRANSFORM =
  'translate3d(150px, 52px, 0) rotateY(-55deg) scale(0.8)'

const TRANSITION_MS = 700
const EASE = 'ease-[cubic-bezier(0.65,0,0.35,1)]'

/* Full-screen envelope shared by both mobile/tablet snap layers — dynamic
   viewport units auto-fit any hardware box (Samsung S20, iPhone 14, iPad)
   with no boundary clips or overlapping wrappers. */
const MOBILE_LAYER =
  'snap-start flex h-screen min-h-[100dvh] max-h-[100dvh] flex-col justify-center overflow-hidden px-6 lg:block lg:h-auto lg:min-h-0 lg:max-h-none lg:overflow-visible lg:px-0 lg:[scroll-snap-align:none]'

const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover)').matches

const isCompactViewport = () =>
  typeof window !== 'undefined' && window.innerWidth < 1024

export default function Services() {
  const [cards, setCards] = useState(CARDS)
  const [leaving, setLeaving] = useState(null)
  const [exploded, setExploded] = useState(false)
  const [isCompact, setIsCompact] = useState(isCompactViewport)
  const [zoneShift, setZoneShift] = useState(0)
  const zoneRef = useRef(null)
  const shiftRef = useRef(0)
  const busyRef = useRef(false)

  /* Tablet & mobile share the compact (3D cascade) deck treatment */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const update = () => setIsCompact(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  /* Re-center the exploded matrix on the viewport so it always fits
     inside the screen boundaries, regardless of the right-column
     position. Measured against the un-shifted container position. */
  useEffect(() => {
    if (!exploded) {
      shiftRef.current = 0
      setZoneShift(0)
      return
    }
    const recenter = () => {
      const zone = zoneRef.current
      if (!zone) return
      const rect = zone.getBoundingClientRect()
      const unshiftedCenter = rect.left + rect.width / 2 - shiftRef.current
      shiftRef.current = Math.round(window.innerWidth / 2 - unshiftedCenter)
      setZoneShift(shiftRef.current)
    }
    recenter()
    window.addEventListener('resize', recenter)
    return () => window.removeEventListener('resize', recenter)
  }, [exploded])

  /* TRUE ROTATIONAL REACTION LOOP — the whole array rotates together:
     the front card sweeps out, then every card steps one slot forward. */
  const shuffle = () => {
    if (busyRef.current || exploded) return
    busyRef.current = true
    setLeaving(cards[0].id)
    setTimeout(() => {
      setCards((current) => [...current.slice(1), current[0]])
      setLeaving(null)
      busyRef.current = false
    }, TRANSITION_MS)
  }

  return (
    <section id="page-2" className="section relative bg-black">
      <div className="mx-auto flex max-w-7xl flex-col lg:grid lg:min-h-screen lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-10 lg:py-0">
        {/* ---- 2A / LEFT half: identity & philosophy ---- */}
        <Reveal className={MOBILE_LAYER} delay={100}>
          <div className="mx-auto max-w-md lg:pl-[2vw] lg:pr-10">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              The Clinic
            </p>
            <h2 className="mt-4 mb-6 font-serif text-2xl font-medium shift-contrast md:text-3xl lg:text-4xl">
              Artistry Meets Innovation
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400">
              Bare Esthetics is a premier clinical medical aesthetics lounge
              located in Forest Hills, Queens. Specialized in advanced
              paramedical camouflage tattooing, medical-grade laser hair
              removal, and high-performance skin treatments, we fuse strict
              medical precision with bespoke aesthetic artistry to reveal
              your most flawless skin.
            </p>
            <a
              href="#page-5"
              className="group mt-8 inline-flex items-baseline gap-3 text-[11px] uppercase tracking-[0.25em] text-zinc-200 transition-colors duration-500 hover:text-ivory"
            >
              Learn More About Us
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </a>
          </div>
        </Reveal>

        {/* ---- 2B / RIGHT half: the angled 5-card deck + exploding grid ---- */}
        <Reveal className={MOBILE_LAYER} delay={250}>
          <div className="flex flex-col items-center">
            {/* Hover zone covers the full exploded matrix so cards
                never leave the interactive area while expanded */}
            <div
              ref={zoneRef}
              className={`deck-zone relative h-[min(560px,80dvh)] w-[740px] max-w-full transition-transform duration-700 lg:h-[560px] ${EASE}`}
              style={{ transform: `translateX(${zoneShift}px)` }}
              onMouseEnter={() => canHover() && setExploded(true)}
              onMouseLeave={() => setExploded(false)}
              /* Mobile & tablet viewports: a physical tap on the deck
                 rotates the whole cascade — every card steps forward */
              onClick={() => {
                if (isCompactViewport()) shuffle()
              }}
            >
              {cards.map((t, pos) => {
                const isFront = pos === 0
                const isLeaving = leaving === t.id
                const desktopMode = exploded
                  ? EXPLODED[pos]
                  : isLeaving
                    ? LEAVING
                    : STACKED[pos]
                return (
                  /* Zero-size anchor point at the zone center: the card
                     centers on it via translate, so the wrapper's layout
                     box never overflows the section (mobile-safe). */
                  <div key={t.id} className="absolute top-1/2 left-1/2 h-0 w-0">
                    <div
                      className="-translate-x-1/2 -translate-y-1/2"
                      style={isCompact ? { perspective: '900px' } : undefined}
                    >
                      <article
                        onClick={
                          isFront && !exploded && !isLeaving
                            ? (e) => {
                                e.stopPropagation()
                                shuffle()
                              }
                            : undefined
                        }
                        style={
                          isCompact
                            ? {
                                transform: isLeaving
                                  ? MOBILE_LEAVING_TRANSFORM
                                  : MOBILE_STACKED_TRANSFORM[pos],
                              }
                            : undefined
                        }
                        className={`h-[min(430px,64dvh)] w-[min(330px,84vw)] border border-champagne/40 bg-black p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-700 lg:h-[430px] lg:w-[330px] ${EASE} ${
                          isCompact
                            ? isLeaving
                              ? MOBILE_LEAVING
                              : MOBILE_STACKED[pos]
                            : desktopMode
                        } ${
                          isFront && !exploded && !isLeaving
                            ? 'cursor-pointer'
                            : 'pointer-events-auto'
                        }`}
                      >
                        <div className="flex h-full flex-col">
                          <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                            {String(pos + 1).padStart(2, '0')} / 05
                          </span>
                          <h3 className="mt-3 font-serif text-lg font-normal shift-contrast">
                            {t.title}
                          </h3>
                          <p className="mt-4 text-xs leading-relaxed text-zinc-300">
                            {t.description}
                          </p>
                          <div className="mt-auto pt-5">
                            <a
                              href={t.link || SQUARE_BOOKING_URL}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 border border-champagne/50 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-ivory transition-colors duration-300 hover:bg-champagne hover:text-black"
                            >
                              Book This Treatment
                              <span>→</span>
                            </a>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={shuffle}
              disabled={exploded}
              className="mt-8 inline-flex items-center gap-3 border-b border-champagne/40 pb-1 text-[11px] uppercase tracking-[0.25em] text-zinc-200 transition-colors duration-300 hover:border-ivory hover:text-ivory disabled:opacity-40"
            >
              Next
              <span>→</span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
