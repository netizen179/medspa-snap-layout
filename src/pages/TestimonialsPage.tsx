import { useEffect, useState } from 'react'
import { testimonials } from '../data/content'

export function TestimonialsPage({ scrollOpacity }: { scrollOpacity: number }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    concern: '',
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="testimonials" className="snap-section bg-black">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        {/* Left column: Testimonials */}
        <div
          className="flex flex-col justify-center px-[7vw] py-20 md:py-0"
          style={{ opacity: scrollOpacity }}
        >
          <p className="eyebrow mb-6">Testimonials</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ivory font-light mb-8 leading-tight">
            What Our Clients Say
          </h2>

          <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-8 max-w-md shadow-2xl">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className="transition-all duration-700"
                style={{
                  opacity: activeSlide === i ? 1 : 0,
                  display: activeSlide === i ? 'block' : 'none',
                }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx} className="text-gold text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-zinc-200 font-sans leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  {t.author} · {t.source}
                </p>
              </div>
            ))}
            <div className="flex gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    activeSlide === i ? 'w-8 bg-gold' : 'w-4 bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Contact form */}
        <div className="flex items-center justify-center px-4 md:px-8 py-20 md:py-0">
          <div className="bg-charcoal border border-zinc-800 rounded-xl p-8 max-w-md w-full">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                />
                <input
                  type="tel"
                  placeholder="Enter your phone line"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
                <select
                  value={formData.concern}
                  onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select skin concern</option>
                  <option value="eyebrow">Eyebrow PMU Artistry</option>
                  <option value="paramedical">Paramedical Camouflage</option>
                  <option value="laser">Laser Hair Removal</option>
                  <option value="facial">Clinical Facials & Peels</option>
                </select>
                <button
                  type="submit"
                  className="w-full py-3 bg-gold text-black text-xs uppercase tracking-widest font-sans font-medium rounded-lg hover:bg-[#E8C84A] transition-colors duration-500"
                >
                  Contact Now
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center anim-fade-in">
                <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center mb-6">
                  <span className="text-gold text-xl">✓</span>
                </div>
                <p className="text-sm text-ivory font-sans leading-relaxed max-w-xs">
                  Thank you. Our skin specialist will contact you shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
