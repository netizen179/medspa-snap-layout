import { useState } from 'react'
import Reveal from '../components/Reveal'
import { TREATMENTS } from '../config/links'

/* ==========================================================================
   PAGE 2 — THE INTERACTIVE SERVICE HIGHLIGHTS LAYER
   Strict 50/50 desktop split: philosophy LEFT, card deck RIGHT.
   The 5 cascading cards rest as an angled, tilted tray (task-view
   aesthetic) and explode into a spacious 3+2 grid on container hover.
   ========================================================================== */

/* The deck shows 5 cards (3 top + 2 below in the exploded grid) */
const CARDS = TREATMENTS.slice(0, 5)

/* Angled stack: cards tilt and fan programmatically in 3D while
   cascading back into infinite depth (center-anchored offsets). */
const STACKED = [
  'z-[50] translate-y-[55px] rotate-0 scale-100 opacity-100',
  'z-[45] translate-y-[43px] rotate-[2.5deg] scale-[0.95] opacity-90',
  'z-[40] translate-y-[31px] rotate-[-2.5deg] scale-[0.90] opacity-80',
  'z-[35] translate-y-[19px] rotate-[5deg] scale-[0.85] opacity-70',
  'z-[30] translate-y-[7px] rotate-[-5deg] scale-[0.80] opacity-60',
]

/* Exploding grid slots: 3 cards across the top row, 2 centered below */
const EXPLODED = [
  'z-10 -translate-x-[270px] -translate-y-[150px] rotate-0 scale-[0.6] opacity-100',
  'z-10 -translate-y-[150px] rotate-0 scale-[0.6] opacity-100',
  'z-10 translate-x-[270px] -translate-y-[150px] rotate-0 scale-[0.6] opacity-100',
  'z-10 -translate-x-[135px] translate-y-[150px] rotate-0 scale-[0.6] opacity-100',
  'z-10 translate-x-[135px] translate-y-[150px] rotate-0 scale-[0.6] opacity-100',
]

/* Front-card exit state: slides 150px right, shrinks, fades — then
   glides back into the deepest base position. */
const LEAVING = 'z-[60] translate-y-[55px] translate-x-[150px] scale-[0.8] opacity-0'

const TRANSITION_MS = 700
const EASE = 'ease-[cubic-bezier(0.65,0,0.35,1)]'

const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover)').matches

export default function Services() {
  const [order, setOrder] = useState(CARDS.map((_, i) => i))
  const [leaving, setLeaving] = useState(null)
  const [exploded, setExploded] = useState(false)

  const shuffle = () => {
    if (leaving !== null || exploded) return
    const frontId = CARDS[order[0]].id
    setLeaving(frontId)
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]])
      setLeaving(null)
    }, TRANSITION_MS)
  }

  return (
    <section id="page-2" className="section relative min-h-screen bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-24 md:grid-cols-2 md:gap-8 md:px-10 md:py-0 lg:min-h-screen">
        {/* ---- LEFT half: identity & philosophy ---- */}
        <Reveal className="snap-start md:[scroll-snap-align:none]" delay={100}>
          <div className="mx-auto max-w-md md:pl-[2vw] md:pr-10">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              The Clinic
            </p>
            <h2 className="mt-4 mb-6 font-serif text-3xl font-medium shift-contrast md:text-4xl">
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

        {/* ---- RIGHT half: the angled 5-card deck + exploding grid ---- */}
        <Reveal className="snap-start md:[scroll-snap-align:none]" delay={250}>
          <div className="flex flex-col items-center">
            {/* Hover zone covers the full exploded matrix so cards
                never leave the interactive area while expanded */}
            <div
              className="relative h-[560px] w-[740px] max-w-full"
              onMouseEnter={() => canHover() && setExploded(true)}
              onMouseLeave={() => setExploded(false)}
            >
              {CARDS.map((t, cardIdx) => {
                const pos = order.indexOf(cardIdx)
                const isFront = pos === 0
                const isLeaving = leaving === t.id
                const mode = exploded
                  ? EXPLODED[pos]
                  : isLeaving
                    ? LEAVING
                    : STACKED[pos]
                return (
                  <div
                    key={t.id}
                    className="absolute top-1/2 left-1/2"
                  >
                    <div className="-translate-x-1/2 -translate-y-1/2">
                      <article
                        onClick={
                          isFront && !exploded && !isLeaving
                            ? shuffle
                            : undefined
                        }
                        className={`h-[430px] w-[330px] border border-champagne/40 bg-black p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-700 ${EASE} ${mode} ${
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
                              href={t.link}
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
