import { useState } from 'react'
import { serviceCards } from '../data/content'

const cardStyles = [
  { scale: 1.0, translateY: 0, opacity: 1.0, zIndex: 50 },
  { scale: 0.97, translateY: -8, opacity: 0.9, zIndex: 45 },
  { scale: 0.94, translateY: -16, opacity: 0.8, zIndex: 40 },
  { scale: 0.91, translateY: -24, opacity: 0.7, zIndex: 35 },
  { scale: 0.88, translateY: -32, opacity: 0.6, zIndex: 30 },
  { scale: 0.85, translateY: -40, opacity: 0.5, zIndex: 25 },
  { scale: 0.82, translateY: -48, opacity: 0.4, zIndex: 20 },
]

export function ServicesPage({ scrollOpacity }: { scrollOpacity: number }) {
  const [order, setOrder] = useState(() => serviceCards.map((_, i) => i))
  const [animating, setAnimating] = useState(false)

  const shuffleNext = () => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setOrder((prev) => [...prev.slice(1), prev[0]])
      setAnimating(false)
    }, 600)
  }

  return (
    <section id="services" className="snap-section bg-black">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        {/* Left column: About */}
        <div
          className="flex flex-col justify-center px-[7vw] py-20 md:py-0"
          style={{ opacity: scrollOpacity }}
        >
          <p className="eyebrow mb-6">The Clinic</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ivory font-light mb-6 leading-tight">
            Artistry Meets Innovation
          </h2>
          <p className="text-sm text-zinc-400 font-sans leading-relaxed max-w-md mb-8">
            Bare Esthetics is a premier clinical medical aesthetics lounge located in Forest Hills, Queens. Specialized in advanced paramedical camouflage tattooing, medical-grade laser hair removal, and high-performance skin treatments, we fuse strict medical precision with bespoke aesthetic artistry to reveal your most flawless skin.
          </p>
          <a href="#testimonials" className="gold-link self-start">
            Learn More About Us <span className="arrow">→</span>
          </a>
        </div>

        {/* Right column: Card deck */}
        <div className="relative flex items-center justify-center px-4 md:px-8 py-20 md:py-0">
          <div className="relative w-full max-w-sm h-[420px]">
            {order.map((cardIndex, position) => {
              const style = cardStyles[position]
              const card = serviceCards[cardIndex]
              const isFront = position === 0
              return (
                <div
                  key={card.id}
                  onClick={() => isFront && shuffleNext()}
                  className="absolute inset-0 bg-black border border-gold/30 rounded-xl p-8 flex flex-col justify-between cursor-pointer transition-all duration-600 ease-in-out"
                  style={{
                    transform: `scale(${style.scale}) translateY(${style.translateY}px)`,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                    pointerEvents: isFront ? 'auto' : 'none',
                  }}
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold/60 mb-4 block">
                      0{position + 1}
                    </span>
                    <h3 className="font-serif text-lg text-gold font-light leading-tight mb-4">
                      {card.title}
                    </h3>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <a
                    href={card.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="gold-link mt-6 self-start"
                  >
                    Book This Treatment <span className="arrow">→</span>
                  </a>
                </div>
              )
            })}
          </div>

          {/* Next arrow */}
          <button
            onClick={shuffleNext}
            className="absolute bottom-12 right-8 md:right-12 flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors duration-500"
          >
            Next <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}
