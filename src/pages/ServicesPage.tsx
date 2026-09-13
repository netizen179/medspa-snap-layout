import { useState } from 'react'
import { serviceCards } from '../data/content'

const stackStyles = [
  { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, z: 70 },
  { x: 10, y: -10, rotate: -2, scale: 0.98, opacity: 0.82, z: 60 },
  { x: -10, y: -18, rotate: 2, scale: 0.96, opacity: 0.68, z: 50 },
  { x: 14, y: -26, rotate: -3, scale: 0.94, opacity: 0.55, z: 40 },
  { x: -14, y: -34, rotate: 3, scale: 0.92, opacity: 0.44, z: 30 },
  { x: 18, y: -42, rotate: -4, scale: 0.9, opacity: 0.34, z: 20 },
  { x: -18, y: -50, rotate: 4, scale: 0.88, opacity: 0.25, z: 10 },
]

const fanStyles = [
  { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, z: 70 },
  { x: -138, y: -82, rotate: -9, scale: 0.84, opacity: 0.62, z: 45 },
  { x: 138, y: -82, rotate: 9, scale: 0.84, opacity: 0.62, z: 45 },
  { x: 0, y: -126, rotate: 0, scale: 0.84, opacity: 0.56, z: 40 },
  { x: -138, y: 84, rotate: 9, scale: 0.84, opacity: 0.52, z: 35 },
  { x: 138, y: 84, rotate: -9, scale: 0.84, opacity: 0.52, z: 35 },
  { x: 0, y: 8, rotate: 2, scale: 0.92, opacity: 0.22, z: 15 },
]

export function ServicesPage({ scrollOpacity }: { scrollOpacity: number }) {
  const [order, setOrder] = useState(() => serviceCards.map((_, i) => i))
  const [animating, setAnimating] = useState(false)
  const [isDeckHovered, setIsDeckHovered] = useState(false)

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

        <div className="relative flex items-center justify-center px-4 md:px-8 py-20 md:py-0 overflow-visible">
          <div
            className="relative w-full max-w-[470px] h-[560px]"
            onMouseEnter={() => setIsDeckHovered(true)}
            onMouseLeave={() => setIsDeckHovered(false)}
          >
            {order.map((cardIndex, position) => {
              const style = (isDeckHovered ? fanStyles : stackStyles)[position]
              const card = serviceCards[cardIndex]
              const isFront = position === 0

              return (
                <div
                  key={card.id}
                  onClick={() => isFront && shuffleNext()}
                  className="absolute left-1/2 top-1/2 w-[min(76vw,270px)] h-[330px] -translate-x-1/2 -translate-y-1/2 bg-black border border-gold/50 rounded-sm p-6 flex flex-col justify-between cursor-pointer transition-all duration-700 ease-out origin-center"
                  style={{
                    transform: `translate(calc(-50% + ${style.x}px), calc(-50% + ${style.y}px)) rotate(${style.rotate}deg) scale(${style.scale})`,
                    opacity: style.opacity,
                    zIndex: style.z,
                    pointerEvents: isFront ? 'auto' : 'none',
                    boxShadow: isFront ? '0 22px 60px rgba(0,0,0,0.45)' : 'none',
                  }}
                >
                  <div className={isDeckHovered && !isFront ? 'opacity-0 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}>
                    <span className="text-[10px] uppercase tracking-widest text-gold/60 mb-4 block">
                      0{position + 1} / 07
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
                    className={`${isDeckHovered && !isFront ? 'opacity-0 pointer-events-none' : 'opacity-100'} gold-link mt-6 self-start transition-opacity duration-300`}
                  >
                    Book This Treatment <span className="arrow">→</span>
                  </a>
                </div>
              )
            })}
          </div>

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
