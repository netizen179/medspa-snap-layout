import { useState } from 'react'

export function BookingPage({ scrollOpacity }: { scrollOpacity: number }) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <section id="booking" className="snap-section bg-black">
      <div
        className="flex items-center justify-center h-full px-4 md:px-8 py-20 md:py-0"
        style={{ opacity: scrollOpacity }}
      >
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-zinc-800/80 shadow-2xl rounded-xl p-4 md:p-6 w-full max-w-4xl h-[75vh] flex flex-col">
          <div className="text-center mb-6">
            <p className="eyebrow">Online Scheduling</p>
            <h2 className="font-serif text-2xl text-ivory font-light mt-2 mb-6">
              Secure Your Session
            </h2>
          </div>

          <div className="flex-1 relative rounded-lg overflow-hidden border border-zinc-800/50">
            <iframe
              src="https://cal.com/bare-esthetics"
              className="w-full h-full"
              frameBorder="0"
              title="Schedule Appointment"
              allow="camera; microphone; fullscreen; display-capture"
            />
          </div>

          {confirmed && (
            <div className="mt-4 flex items-center justify-center gap-3 py-3 px-4 bg-gold/10 border border-gold/30 rounded-lg anim-fade-in">
              <span className="text-gold text-sm">✓</span>
              <p className="text-xs text-gold font-sans tracking-wide">
                Appointment Confirmed. Event task reminder synchronized to your personal calendar.
              </p>
            </div>
          )}

          <button
            onClick={() => setConfirmed(true)}
            className="mx-auto mt-4 text-xs uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors duration-500"
          >
            Simulate Confirmation
          </button>
        </div>
      </div>
    </section>
  )
}
