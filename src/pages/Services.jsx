import { useState } from 'react'
import Reveal from '../components/Reveal'
import { TREATMENTS } from '../config/links'

/* ==========================================================================
   PAGE 2 — THE INTERACTIVE SERVICE HIGHLIGHTS LAYER
   Left: identity & philosophy. Right: infinite cascading 7-card deck.
   ========================================================================== */

/* Cascading depth variables — strict 3D translation offsets so the
   cards fade back into infinite depth. */
const DEPTH = [
  'z-[50] scale-100 translate-y-0 opacity-100',
  'z-[45] scale-[0.97] -translate-y-2 opacity-90',
  'z-[40] scale-[0.94] -translate-y-4 opacity-80',
  'z-[35] scale-[0.91] -translate-y-6 opacity-70',
  'z-[30] scale-[0.88] -translate-y-8 opacity-60',
  'z-[25] scale-[0.85] -translate-y-10 opacity-50',
  'z-[20] scale-[0.82] -translate-y-12 opacity-40',
]

/* Front-card exit state: slides 150px right, shrinks, fades — then
   glides back into the deepest base position. */
const LEAVING =
  'z-[60] scale-[0.82] translate-x-[150px] opacity-0'

const SHUFFLE_MS = 500

export default function Services() {
  const [order, setOrder] = useState(TREATMENTS.map((_, i) => i))
  const [leaving, setLeaving] = useState(null)

  const shuffle = () => {
    if (leaving !== null) return
    const frontId = TREATMENTS[order[0]].id
    setLeaving(frontId)
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]])
      setLeaving(null)
    }, SHUFFLE_MS)
  }

  return (
    <section id="page-2" className="section relative min-h-screen bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-24 md:px-10 lg:min-h-screen lg:grid-cols-2 lg:gap-8 lg:py-0">
        {/* ---- LEFT COLUMN: identity & philosophy ---- */}
        <Reveal
          className="snap-start md:[scroll-snap-align:none]"
          delay={100}
        >
          <div className="mx-auto max-w-md lg:ml-auto lg:mr-16 lg:pl-[3vw]">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              The Clinic
            </p>
            <h2 className="mt-4 mb-6 font-serif text-3xl font-light text-ivory md:text-4xl">
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
              className="group mt-8 inline-flex items-baseline gap-3 text-[11px] uppercase tracking-[0.25em] text-champagne"
            >
              Learn More About Us
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </a>
          </div>
        </Reveal>

        {/* ---- RIGHT COLUMN: the infinite 7-card cascading deck ---- */}
        <Reveal
          className="snap-start md:[scroll-snap-align:none]"
          delay={250}
        >
          <div className="flex flex-col items-center">
            <div className="relative mx-auto h-[480px] w-full max-w-[350px] sm:h-[500px]">
              {TREATMENTS.map((t, cardIdx) => {
                const pos = order.indexOf(cardIdx)
                const isFront = pos === 0
                const isLeaving = leaving === t.id
                return (
                  <article
                    key={t.id}
                    onClick={isFront ? shuffle : undefined}
                    className={`absolute inset-x-0 bottom-0 h-[430px] border border-champagne/40 bg-black p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-500 ease-in-out sm:h-[440px] ${
                      isLeaving ? LEAVING : DEPTH[pos]
                    } ${isFront && !isLeaving ? 'cursor-pointer' : 'pointer-events-none'}`}
                  >
                    <div className="flex h-full flex-col">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                        {String(pos + 1).padStart(2, '0')} / 07
                      </span>
                      <h3 className="mt-3 font-serif text-lg font-light text-champagne">
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
                          className="inline-flex items-center gap-2 border border-champagne/50 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-champagne transition-colors duration-300 hover:bg-champagne hover:text-black"
                        >
                          Book This Treatment
                          <span>→</span>
                        </a>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <button
              onClick={shuffle}
              className="mt-8 inline-flex items-center gap-3 border-b border-champagne/40 pb-1 text-[11px] uppercase tracking-[0.25em] text-champagne transition-colors duration-300 hover:border-champagne"
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
