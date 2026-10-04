import { useEffect, useRef, useState } from 'react'
import Reveal from '../components/Reveal'
import Typewriter from '../components/Typewriter'
import { SQUARE_BOOKING_URL, TREATMENTS } from '../config/links'

/* ==========================================================================
   PAGE 2 — THE INTERACTIVE SERVICE HIGHLIGHTS LAYER
   Desktop (lg+): strict 50/50 split — philosophy LEFT, card deck RIGHT.
   Mobile & tablet (< lg): TWO independent full-screen 100dvh snap layers —
     2A hosts the About text, 2B hosts the card deck on its own plane,
     centred in the dead centre of the viewport with no padding caps.
   The 5 cascading cards rest as an angled, tilted tray (task-view
   aesthetic) and explode into a spacious 3+2 grid on container hover —
   scaled per breakpoint (.deck-zone vars) and re-centered on the
   viewport so the matrix always fits inside the screen boundaries.

   DESKTOP SHUFFLE LOOP: tapping/clicking the card area runs a true
   sequential cycle — the front card slides right, drops its depth index
   and translates to the absolute back of the pile while every remaining
   card steps one slot forward (1 → 2 → 3 → 4 → 5 → 1).

   COMPACT ZOOM-LOOP (< lg): the first tap on the deck scales the front
   card up to Max Zoom (scale 1.12 — strictly inside the layer, never
   full-screen) while the 4 cards behind fan out in strict spatial rotation
   order (rotateZ -6 / +6 / -3 / +3) and their TEXT layers alone drop to
   exactly 5% — the card containers stay fully visible. Once stable, 3s of
   stillness tilts the zoomed card one way and the next 3s tilts it back,
   rolling on a loop. A second tap scales it back down, slides it to the
   absolute back of the pile and zooms the next card.

   All 5 cards are transparent (no solid background) at every breakpoint, so
   their thin champagne borders visibly overlap in a real 3D deck at rest.

   BOOKING: only the active front card's BOOK NOW button leaves the site —
   it opens that service's Square checkout in a fresh browser tab.
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

/* Angled stack (desktop rest): the cards tilt and fan programmatically in
   3D, spread wide enough that every title row stays legible while they stay
   visibly stacked. The containers carry NO opacity and NO background — the
   thin champagne borders simply overlap, so all five read at once. */
const STACKED = [
  'z-[50] translate-y-[52px] rotate-0 scale-100',
  'z-[45] translate-y-[26px] -translate-x-[14px] rotate-[2.5deg] scale-[0.96]',
  'z-[40] translate-y-0 translate-x-[12px] rotate-[-2.5deg] scale-[0.92]',
  'z-[35] -translate-y-[26px] -translate-x-[8px] rotate-[5deg] scale-[0.88]',
  'z-[30] -translate-y-[52px] translate-x-[16px] rotate-[-5deg] scale-[0.84]',
]

/* Mobile & tablet stack: the same cascade expressed with true 3D rotational
   scale-down values (rotateY + perspective) and matching layer indexes.
   Offsets are symmetric around the centre so the pile sits dead-centre, and
   the containers stay fully opaque (only their TEXT layers ever fade). */
const MOBILE_STACKED = ['z-[50]', 'z-[45]', 'z-[40]', 'z-[35]', 'z-[30]']
const MOBILE_STACKED_TRANSFORM = [
  'translate3d(0, 26px, 0) rotateY(0deg) scale(1)',
  'translate3d(0, 13px, 0) rotateY(6deg) scale(0.95)',
  'translate3d(0, 0px, 0) rotateY(-6deg) scale(0.90)',
  'translate3d(0, -13px, 0) rotateY(8deg) scale(0.85)',
  'translate3d(0, -26px, 0) rotateY(-8deg) scale(0.80)',
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

/* Front-card exit state: slides right, drops its layer index, then
   glides into the absolute back of the pile. */
const LEAVING = 'z-[60] translate-y-[55px] translate-x-[150px] scale-[0.8] opacity-0'

/* Mobile & tablet exit: a crisp 3D translate-x sweep to the right, then the
   card slides back into the absolute bottom of the pile. */
const MOBILE_LEAVING = 'z-[60] opacity-0'
const MOBILE_LEAVING_TRANSFORM =
  'translate3d(150px, 26px, 0) rotateY(-55deg) scale(0.8)'

/* ZOOM-MAX FACTOR (compact only): the tapped front card scales up toward
   the user (strictly inside the layer, never full-screen) while the 4 cards
   behind fan out in strict spatial rotation order and their typography drops
   to exactly 5% — deep background context. */
const MOBILE_ZOOM_SCALE = 1.12
const MOBILE_BACK_OPACITY = 0.05
const MOBILE_FAN = [
  'rotateZ(0deg)',
  'rotateZ(-6deg)',
  'rotateZ(6deg)',
  'rotateZ(-3deg)',
  'rotateZ(3deg)',
]

const TRANSITION_MS = 700
/* Inactivity breathing cycle: 3s of stillness tilts the zoomed front card
   one way, the next 3s tilts it back, rolling on a loop. */
const INACTIVITY_MS = 3000
const TILT_DEG = 7
const EASE = 'ease-[cubic-bezier(0.65,0,0.35,1)]'

/* Shared full-screen envelope — dynamic viewport units auto-fit any
   hardware box (Samsung S20, iPhone 14 Pro Max, iPad) with no boundary
   clips or overlapping wrappers. 2B drops the outer padding so the
   angled deck loops freely inside the screen frame. */
const LAYER_BASE =
  'snap-start flex h-screen min-h-[100dvh] max-h-[100dvh] flex-col justify-center overflow-hidden lg:block lg:h-auto lg:min-h-0 lg:max-h-none lg:overflow-visible lg:[scroll-snap-align:none]'
const MOBILE_LAYER_A = `${LAYER_BASE} px-6 lg:px-0`
const MOBILE_LAYER_B = `${LAYER_BASE} relative`

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
  const [mobileZoomed, setMobileZoomed] = useState(false)
  const [tilt, setTilt] = useState(0)
  const [interactionKey, setInteractionKey] = useState(0)
  const [typing, setTyping] = useState(false)
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

  /* The 2B "TAP TO SHUFFLE SERVICES" directive prints itself
     letter-by-letter every time the cards viewport snaps into view. */
  useEffect(() => {
    if (!isCompact) return
    const el = document.getElementById('page-2b')
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setTyping(entry.isIntersecting),
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isCompact])

  /* Inactivity breathing cycle: while the front card rests at Max Zoom,
     after 3s of stillness it tilts one way, then back the other way every
     3s on a rolling loop. Any deck interaction restarts the cycle. */
  useEffect(() => {
    if (!isCompact || !mobileZoomed) {
      setTilt(0)
      return
    }
    let dir = 1
    let timer
    const tick = () => {
      setTilt(TILT_DEG * dir)
      dir = -dir
      timer = setTimeout(tick, INACTIVITY_MS)
    }
    timer = setTimeout(tick, TRANSITION_MS + INACTIVITY_MS)
    return () => clearTimeout(timer)
  }, [isCompact, mobileZoomed, interactionKey])

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

  /* TRUE SEQUENTIAL SHUFFLE LOOP — the whole array rotates together:
     the front card sweeps out, drops its layer index, and every card
     steps one slot forward (1 → 2 → 3 → 4 → 5 → 1). `keepZoom` keeps the
     compact Max-Zoom pipeline alive so the advancing card scales straight
     back up to repeat it. */
  const advance = (keepZoom) => {
    if (busyRef.current) return
    busyRef.current = true
    setLeaving(cards[0].id)
    setTimeout(() => {
      setCards((current) => [...current.slice(1), current[0]])
      setLeaving(null)
      busyRef.current = false
      setMobileZoomed(keepZoom)
    }, TRANSITION_MS)
  }

  /* Compact deck tap pipeline: the first tap scales the front card to Max
     Zoom; a second tap scales it back down, shuffles it to the absolute
     back of the pile and zooms the next card. Desktop keeps its plain
     shuffle untouched. */
  const handleDeckTap = () => {
    setInteractionKey((k) => k + 1)
    if (!isCompact) {
      advance(false)
      return
    }
    if (!mobileZoomed) {
      setMobileZoomed(true)
      return
    }
    advance(true)
  }

  const handleNext = () => {
    setInteractionKey((k) => k + 1)
    advance(isCompact)
  }

  return (
    <section id="page-2" className="section relative bg-black">
      <div className="mx-auto flex max-w-7xl flex-col lg:grid lg:min-h-screen lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-10 lg:py-0">
        {/* ---- 2A / LEFT half: identity & philosophy ---- */}
        <Reveal className={MOBILE_LAYER_A} delay={100}>
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
        <Reveal id="page-2b" className={MOBILE_LAYER_B} delay={250}>
          {/* Dead-centre flex grid: the deck sits in the exact horizontal
              and vertical middle of Page 2B on mobile & tablet. */}
          <div className="flex h-full w-full flex-col items-center justify-center">
            {/* Hover zone covers the full exploded matrix so cards
                never leave the interactive area while expanded */}
            <div
              ref={zoneRef}
              className={`deck-zone relative h-[min(560px,80dvh)] w-full transition-transform duration-700 lg:h-[560px] lg:w-[740px] lg:max-w-full ${EASE}`}
              style={{ transform: `translateX(${zoneShift}px)` }}
              onMouseEnter={() => canHover() && setExploded(true)}
              onMouseLeave={() => setExploded(false)}
              /* Tapping/clicking the card area runs the compact zoom-loop
                 (or the plain desktop shuffle). */
              onClick={handleDeckTap}
            >
              {cards.map((t, pos) => {
                const isFront = pos === 0
                /* TEXT-ONLY fade. The card containers stay fully visible at
                   all times — only their inner typography layers change.
                   Desktop: every title stays at 100% (a legible angular stack
                   at rest, unchanged when the grid explodes). Compact: the
                   front card reads at 100% while the 4 cards behind drop to
                   exactly 5% the instant it reaches Max Zoom (0% at rest). */
                /* Desktop: the stationary angled stack rests with every
                   wording layer muted to 30% so the overlapping copy never
                   clutters; hovering explodes the grid and the wording
                   brightens to 85% (readable), easing back on leave. */
                const textOpacity = isCompact
                  ? isFront
                    ? 1
                    : mobileZoomed
                      ? MOBILE_BACK_OPACITY
                      : 0
                  : exploded
                    ? 0.85
                    : 0.3
                const isLeaving = leaving === t.id
                const desktopMode = exploded
                  ? EXPLODED[pos]
                  : isLeaving
                    ? LEAVING
                    : STACKED[pos]
                /* Compact 3D transform: at rest the pile cascades; at Max
                   Zoom the front card scales up and breathes on the tilt
                   cycle while the 4 behind fan out in strict rotation order. */
                const compactTransform = isLeaving
                  ? MOBILE_LEAVING_TRANSFORM
                  : !mobileZoomed
                    ? MOBILE_STACKED_TRANSFORM[pos]
                    : isFront
                      ? `translate3d(0, 26px, 0) rotateY(${tilt}deg) scale(${MOBILE_ZOOM_SCALE})`
                      : `${MOBILE_STACKED_TRANSFORM[pos]} ${MOBILE_FAN[pos]}`
                return (
                  /* Zero-size anchor point at the zone center: the card
                     centers on it via translate, so the wrapper's layout
                     box never overflows the section (mobile-safe). */
                  <div key={t.id} className="absolute top-1/2 left-1/2 h-0 w-0">
                    {/* w-fit gives the wrapper a real width so
                        -translate-x-1/2 truly centres the card on the
                        anchor (a zero-width parent makes it a no-op). */}
                    <div
                      className={`-translate-x-1/2 -translate-y-1/2 ${isCompact ? 'w-fit' : ''}`}
                      style={isCompact ? { perspective: '900px' } : undefined}
                    >
                      <article
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeckTap()
                        }}
                        style={isCompact ? { transform: compactTransform } : undefined}
                        className={`h-[min(430px,64dvh)] w-[min(330px,84vw)] cursor-pointer border bg-transparent p-6 shadow-[0_18px_45px_rgba(0,0,0,0.55)] transition-all duration-700 lg:h-[430px] lg:w-[330px] ${EASE} ${
                          isFront ? 'border-champagne/60' : 'border-champagne/25'
                        } ${
                          isCompact
                            ? isLeaving
                              ? MOBILE_LEAVING
                              : MOBILE_STACKED[pos]
                            : desktopMode
                        }`}
                      >
                        <div className="flex h-full flex-col">
                          <div
                            className={`transition-opacity ${EASE} ${isCompact ? 'duration-700' : 'duration-500'}`}
                            style={{ opacity: textOpacity }}
                          >
                            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                              {String(pos + 1).padStart(2, '0')} / 05
                            </span>
                            <h3 className="mt-3 font-serif text-lg font-normal shift-contrast">
                              {t.title}
                            </h3>
                            <p className="mt-4 text-xs leading-relaxed text-zinc-300">
                              {t.description}
                            </p>
                          </div>
                          <div
                            className={`mt-auto pt-5 transition-opacity ${EASE} ${isCompact ? 'duration-700' : 'duration-500'}`}
                            style={{ opacity: textOpacity }}
                          >
                            {isCompact && !isFront ? (
                              /* Compact: only the active front card routes to
                                 Square — the cards behind carry an inert CTA. */
                              <span className="inline-flex items-center gap-2 border border-champagne/50 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-ivory">
                                Book Now
                                <span>→</span>
                              </span>
                            ) : (
                              <a
                                href={t.link || SQUARE_BOOKING_URL}
                                target="_blank"
                                rel="noreferrer"
                                /* Direct Square handoff: the BOOK NOW button
                                   bypasses every internal page and opens the
                                   checkout in a fresh browser tab. */
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-2 border border-champagne/50 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-ivory transition-colors duration-300 hover:bg-champagne hover:text-black"
                              >
                                Book Now
                                <span>→</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Typewriter directive — prints letter-by-letter at the bottom
                of the card workspace, just above the Next control. */}
            <p className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap font-sans text-xs uppercase tracking-[0.3em] text-zinc-400 lg:hidden">
              <Typewriter text="TAP TO SHUFFLE SERVICES" active={typing} />
            </p>

            {/* Shuffle trigger — pinned to the bottom on mobile so it never
                pulls the deck off the vertical centre of Page 2B. */}
            <button
              onClick={handleNext}
              disabled={exploded}
              className="absolute bottom-8 left-1/2 inline-flex -translate-x-1/2 items-center gap-3 border-b border-champagne/40 pb-1 text-[11px] uppercase tracking-[0.25em] text-zinc-200 transition-colors duration-300 hover:border-ivory hover:text-ivory disabled:opacity-40 lg:static lg:bottom-auto lg:left-auto lg:mt-8 lg:translate-x-0"
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
