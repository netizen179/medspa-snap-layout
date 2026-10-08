import { useEffect, useRef, useState } from 'react'

/* ==========================================================================
   PAGE 3 (the user's "Page 4") — MOBILE / TABLET BREATHING MEDIA LAYER
   ==========================================================================
   Desktop is completely untouched: this component returns null at `lg` and
   above (max-width 1023px), so no markup, no script and no observer is ever
   mounted on desktop.

   It replaces the old "Contact Us Now" intake box on mobile/tablet ONLY with:
   - a silent, looping, chrome-free HTML5 <video> (the transparent
     "mind-relax" webm) centred in the lower quadrant under the review
     carousel, and
   - an endless floating speech-cloud bubble stream rising from the base of
     the section — densest over the video quadrant, thinning out as it passes
     the testimonial rows before dissolving at the top.

   Scroll onto the layer (or tap the video) → the volume fades up to 50%.
   Scroll away → instant hard-mute to 0%. Tapping any bubble opens the
   Voiceflow assistant (script injected here, mobile/tablet only).
   ========================================================================== */

const MEDIA_BASE =
  'https://mtgrgksrbadhigdnzeee.supabase.co/storage/v1/object/public/medspa-media/'
const VIDEO_SRC = `${MEDIA_BASE}page-4-mind-relax-video.webm`

const VOICEFLOW_PROJECT_ID = '6ac7f344f490e27a011d9331'
const VOICEFLOW_CDN = 'https://cdn.voiceflow.com/widget-next/bundle.mjs'

const TARGET_VOLUME = 0.5
const FADE_MS = 700

const BUBBLE_LABELS = ['CLINIC ASSISTANT', 'LETS CHAT']
/* Deterministic particle matrix: spread across the width, staggered
   durations and negative delays so the field is already populated on load. */
const BUBBLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: 6 + ((i * 41) % 84),
  duration: 9 + (i % 5) * 1.4,
  delay: -(i * 1.15),
  label: BUBBLE_LABELS[i % 2],
  scale: 0.82 + (i % 3) * 0.14,
}))

let voiceflowInjected = false

/* Mount the production Voiceflow script once, mobile/tablet only. */
function injectVoiceflow() {
  if (voiceflowInjected || typeof document === 'undefined') return
  voiceflowInjected = true
  if (window.voiceflow?.chat) return
  const first = document.getElementsByTagName('script')[0]
  const v = document.createElement('script')
  v.type = 'text/javascript'
  v.src = VOICEFLOW_CDN
  v.onload = () => {
    window.voiceflow?.chat?.load({
      verify: { projectID: VOICEFLOW_PROJECT_ID },
      url: 'https://general-runtime.voiceflow.com',
      voice: { url: 'https://runtime-api.voiceflow.com' },
    })
  }
  if (first && first.parentNode) first.parentNode.insertBefore(v, first)
  else document.head.appendChild(v)
}

/* Open the assistant, retrying briefly if the widget is still booting. */
function openVoiceflow() {
  const attempt = () => {
    const chat = window.voiceflow?.chat
    if (chat && typeof chat.open === 'function') {
      chat.open()
      return true
    }
    return false
  }
  if (attempt()) return
  let tries = 0
  const id = setInterval(() => {
    if (attempt() || ++tries > 60) clearInterval(id)
  }, 250)
}

/* lg (1024px) is the desktop boundary — same convention as Hero/Services. */
function useIsCompact() {
  const [compact, setCompact] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 1023px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const update = () => setCompact(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return compact
}

export default function MindRelaxLayer() {
  const compact = useIsCompact()
  const videoRef = useRef(null)
  const fadeRef = useRef(0)

  /* Smooth volume ramp (0 ↔ 50%) */
  const fadeTo = (target) => {
    const video = videoRef.current
    if (!video) return
    cancelAnimationFrame(fadeRef.current)
    if (target > 0) {
      video.muted = false
      video.play().catch(() => {
        /* Autoplay-with-sound blocked — stay muted, visuals unaffected */
        video.muted = true
      })
    }
    const from = video.volume
    const t0 = performance.now()
    const step = (now) => {
      const t = Math.min((now - t0) / FADE_MS, 1)
      video.volume = from + (target - from) * t
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(step)
      } else if (target === 0) {
        video.muted = true
      }
    }
    fadeRef.current = requestAnimationFrame(step)
  }

  const hardMute = () => {
    const video = videoRef.current
    if (!video) return
    cancelAnimationFrame(fadeRef.current)
    video.volume = 0
    video.muted = true
  }

  /* Mobile/tablet only: inject the assistant, watch the layer's visibility */
  useEffect(() => {
    if (!compact) return
    injectVoiceflow()

    const section = document.getElementById('page-3')
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          fadeTo(TARGET_VOLUME)
        } else {
          hardMute()
        }
      },
      { threshold: [0, 0.3, 0.5] }
    )
    observer.observe(section)

    return () => {
      observer.disconnect()
      hardMute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact])

  useEffect(() => () => cancelAnimationFrame(fadeRef.current), [])

  if (!compact) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden lg:hidden">
      {/* ---- Breathing video — lower quadrant, under the review carousel ---- */}
      <div className="absolute inset-x-0 bottom-[12%]">
        <button
          type="button"
          aria-label="Play mind-relax media with sound"
          onClick={() => fadeTo(TARGET_VOLUME)}
          className="pointer-events-auto mx-auto block max-w-[200px]"
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            className="block h-auto w-full rounded-lg"
          />
        </button>
      </div>

      {/* ---- Endless floating speech-cloud bubble stream ---- */}
      <div className="bubble-field pointer-events-none absolute inset-0 overflow-hidden">
        {BUBBLES.map((b) => (
          <div
            key={b.id}
            className="bubble-rise absolute"
            style={{
              left: `${b.left}%`,
              bottom: '-48px',
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
            }}
          >
            <button
              type="button"
              onClick={openVoiceflow}
              style={{ transform: `scale(${b.scale})` }}
              className="pointer-events-auto whitespace-nowrap rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-2 font-sans text-[10px] font-medium uppercase tracking-wider text-zinc-300 backdrop-blur-md"
            >
              {b.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
