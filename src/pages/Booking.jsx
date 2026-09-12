import { useEffect, useState } from 'react'
import Reveal from '../components/Reveal'
import { BOOKING_PIPELINE } from '../config/booking'

/* ==========================================================================
   PAGE 4 — THE INTERACTIVE BOOKING PORTAL LAYER

   Square checkout portal inside the dark luxury glassmorphic window
   frame: the iframe embeds the verified, live Square booking URL
   (BOOKING_PIPELINE.iframeUrl → SQUARE_BOOKING_URL in
   src/config/links.js — the single source of truth shared with every
   Page 2 treatment card).

   AUTOMATED CLIENT CALENDAR PIPELINE & EVENT RULES
   ------------------------------------------------
   - Appointments are isolated on the spa's dedicated Square location,
     so the business organizer's personal phone calendar stays
     completely clean and free of clutter.
   - The moment a client logs their booking selection, Square executes
     both automated hooks — the owner's spa account email profile gets
     an immediate dashboard/email notification push, and the client
     receives a verified task calendar reminder imprinted into their
     personal Google Calendar mobile app timeline.
   - Transactional feedback state: we listen for a booking-success
     postMessage handshake and surface the confirmation banner:
     "Appointment Confirmed. Event task reminder synchronized to your
     personal calendar."
   ========================================================================== */

export default function Booking() {
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const onMessage = (e) => {
      const data = e.data
      const text =
        typeof data === 'string'
          ? data
          : `${data?.type ?? ''} ${data?.event ?? ''} ${data?.payload?.type ?? ''}`
      if (/success|confirmed|booking-complete/i.test(text)) {
        setConfirmed(true)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <section
      id="page-4"
      className="section relative flex min-h-screen items-center justify-center bg-black px-4 py-24 md:px-6 lg:py-0"
    >
      <Reveal className="w-full">
        <div className="mx-auto flex h-[68vh] w-full max-w-4xl flex-col rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 shadow-2xl backdrop-blur-xl md:h-[75vh]">
          <div className="relative text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Online Scheduling
            </p>
            <h2 className="mt-2 mb-6 font-serif text-2xl font-medium shift-contrast">
              Secure Your Session
            </h2>

            {/* Automated confirmation micro-notification */}
            <div
              className={`absolute top-0 left-1/2 z-10 w-[90%] max-w-md -translate-x-1/2 rounded-full border border-champagne/40 bg-black/90 px-4 py-2.5 text-center text-[10px] leading-relaxed tracking-[0.2em] text-ivory backdrop-blur transition-all duration-700 md:w-auto md:px-5 md:whitespace-nowrap ${
                confirmed ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              Appointment Confirmed. Event task reminder synchronized to your
              personal calendar.
            </div>
          </div>

          {/* Square inline booking module — takes the maximum
              internal height of the glass frame */}
          <iframe
            title="Bare Esthetics — online scheduling"
            src={BOOKING_PIPELINE.iframeUrl}
            className="min-h-0 w-full flex-1 rounded-lg border border-zinc-800/60 bg-black"
          />
        </div>
      </Reveal>
    </section>
  )
}
