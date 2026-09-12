import { useEffect, useRef, useState } from 'react'

/* ==========================================================================
   FULLSCREEN PORTAL OVERLAY (mobile & tablet slice viewer)
   A tapped invisible vertical column scales up smoothly to fill the
   screen, layered cleanly over the background portrait canvas inside
   a dark glass frame.

   DISMISSAL ROUTINE (THE CLOSE ROUTINE)
   - A minimalist translucent "✕" box sits in the absolute top right.
   - A tap anywhere on the active media surface also collapses it.
   - On dismissal the media glides down, playback pauses, audio is
     killed completely, and the pristine portrait canvas returns.
   ========================================================================== */

export default function PortalOverlay({ media, onDone }) {
  const [active, setActive] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setActive(true))
    const video = videoRef.current
    if (media.type === 'video' && video) {
      /* The opening tap is the user gesture — start playback, then
         bring the sound in */
      video
        .play()
        .then(() => {
          video.muted = false
        })
        .catch(() => {})
    }
    return () => cancelAnimationFrame(raf)
  }, [media])

  const close = () => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.pause()
    }
    setActive(false)
    setTimeout(onDone, 500)
  }

  return (
    <div
      className="absolute inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-8"
      onClick={close}
    >
      <button
        aria-label="Close media view"
        onClick={close}
        className="absolute top-4 right-4 z-10 border border-zinc-500/40 bg-black/60 px-3.5 py-2.5 text-xs tracking-widest text-zinc-300 backdrop-blur transition-colors duration-300 hover:text-ivory"
      >
        ✕
      </button>
      <div
        className={`relative h-full w-full max-w-5xl overflow-hidden border border-zinc-500/30 shadow-[0_40px_120px_rgba(0,0,0,0.9)] transition-all duration-500 ease-in-out ${
          active
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-12 scale-90 opacity-0'
        }`}
      >
        {media.type === 'video' ? (
          <video
            ref={videoRef}
            src={media.src}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <img src={media.src} alt="" className="h-full w-full object-cover" />
        )}
      </div>
    </div>
  )
}
