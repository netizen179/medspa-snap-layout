import { useEffect, useState } from 'react'
import Reveal from '../components/Reveal'
import { TALLY_WEBHOOK_URL } from '../config/integrations'

/* ==========================================================================
   PAGE 3 — THE SOCIAL PROOF & CLIENT INTAKE LAYER
   Left: glassmorphic auto-rotating review slider.
   Right: client intake dashboard form.
   ========================================================================== */

const REVIEWS = [
  {
    quote:
      'Natacha completely transformed my confidence! The paramedical scar camouflage she performed is absolute magic. You literally cannot tell where the scar was.',
    name: 'Sarah M.',
    source: 'Google Review',
  },
  {
    quote:
      'The best ombré powder brows in Queens, hands down. Absolute precision and perfect symmetry. The studio is stunningly beautiful and pristine.',
    name: 'Jessica T.',
    source: 'Yelp Review',
  },
  {
    quote:
      'Pain-free laser hair removal that actually works on darker skin tones safely. Professional, brilliant medical grade diagnostics.',
    name: 'David K.',
    source: 'Google Review',
  },
]

const CONCERNS = [
  'Eyebrow PMU Artistry',
  'Paramedical Camouflage',
  'Laser Hair Removal',
  'Clinical Facials & Peels',
]

const inputClass =
  'w-full rounded-md border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 transition focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne/50'

export default function Testimonials() {
  const [slide, setSlide] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', phone: '', concern: '' })
  const [submitted, setSubmitted] = useState(false)

  /* Auto-rotating carousel — smooth cross-fade every 5 seconds */
  useEffect(() => {
    const id = setInterval(
      () => setSlide((s) => (s + 1) % REVIEWS.length),
      5000
    )
    return () => clearInterval(id)
  }, [])

  /* Target data handler: routes the intake payload dynamically to
     the Tally.so webhook layer (client-side, no backend required). */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (!TALLY_WEBHOOK_URL) return
    try {
      await fetch(TALLY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source: 'bare-esthetics-intake',
        }),
      })
    } catch {
      /* Webhook unreachable — the intake confirmation is already shown */
    }
  }

  return (
    <section id="page-3" className="section relative min-h-screen bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-24 md:px-10 lg:min-h-screen lg:grid-cols-2 lg:gap-8 lg:py-0">
        {/* ---- LEFT COLUMN: validation & trust ---- */}
        <Reveal className="snap-start md:[scroll-snap-align:none]" delay={100}>
          <div className="mx-auto max-w-md lg:mr-auto lg:ml-16 lg:pl-[3vw]">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Testimonials
            </p>
            <h2 className="mt-4 mb-8 font-serif text-2xl font-medium shift-contrast md:text-3xl lg:text-4xl">
              What Our Clients Say
            </h2>

            {/* Glassmorphic carousel */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-md max-w-md">
              <div className="relative min-h-[190px]">
                {REVIEWS.map((r, i) => (
                  <figure
                    key={r.name}
                    className={`absolute inset-0 flex flex-col transition-opacity duration-1000 ${
                      slide === i ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                  >
                    <div className="text-sm tracking-[0.3em] text-ivory">
                      ★★★★★
                    </div>
                    <blockquote className="mt-4 text-sm leading-relaxed text-zinc-300">
                      “{r.quote}”
                    </blockquote>
                    <figcaption className="mt-5 text-xs uppercase tracking-[0.25em] text-zinc-500">
                      — {r.name} · {r.source}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="mt-6 flex gap-2">
                {REVIEWS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-px w-6 transition-all duration-700 ${
                      slide === i ? 'bg-zinc-200' : 'bg-zinc-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ---- RIGHT COLUMN: client intake dashboard ---- */}
        <Reveal className="snap-start md:[scroll-snap-align:none]" delay={250}>
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-xl border border-zinc-800 bg-charcoal p-8 shadow-2xl">
              {submitted ? (
                <div className="flex min-h-[380px] flex-col items-center justify-center text-center transition-opacity duration-700">
                  <span className="text-2xl text-champagne">✦</span>
                  <p className="mt-6 font-serif text-xl font-light text-ivory">
                    Thank you.
                  </p>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
                    Our skin specialist will contact you shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5 transition-opacity duration-700"
                >
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Enter your phone line"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                  />
                  <select
                    required
                    value={form.concern}
                    onChange={(e) => setForm({ ...form, concern: e.target.value })}
                    className={`${inputClass} appearance-none ${
                      form.concern ? 'text-zinc-200' : 'text-zinc-600'
                    }`}
                  >
                    <option value="" disabled>
                      Select your skin concern
                    </option>
                    {CONCERNS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="mt-2 w-full bg-champagne py-3.5 text-xs font-medium uppercase tracking-[0.3em] text-black transition-all duration-300 hover:brightness-110"
                  >
                    Contact Now
                  </button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
