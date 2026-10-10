import { useEffect, useRef, useState } from 'react'

/* ==========================================================================
   PAGE 4B — THE MINDFUL AI ENCLAVE  (mobile / tablet only)
   ==========================================================================
   Desktop is completely untouched: this component returns `null` at `lg` and
   above (max-width 1023px), so the desktop stack keeps its original
   Page 3 (carousel + intake) → Page 5 flow.

   Contents (all inside one full-screen 100dvh snap layer):
   - the transparent "mind-relax" breathing <video> as the focal heart
     (autoplay / loop / muted / playsinline, no controls, no download),
   - an endless, evenly distributed slow speech-cloud bubble matrix,
   - the right-side showcase bubble that expands into a glassmorphic
     wallpaper micro-preview (typewriter sample chat) each time the layer
     snaps into view, then collapses and rejoins the float,
   - the in-line Voiceflow assistant (default launcher hidden) opened by
     tapping any bubble, auto-closed on scroll-away,
   - a slow charcoal ocean-wave border fade around the whole layer.
   ========================================================================== */

const MEDIA_BASE =
  'https://mtgrgksrbadhigdnzeee.supabase.co/storage/v1/object/public/medspa-media/'
const VIDEO_SRC = `${MEDIA_BASE}page-4-mind-relax-video.webm`
const WALLPAPER = `${MEDIA_BASE}chatbox%20bg%20wallpaper.png`

const VOICEFLOW_PROJECT_ID = '6ac7f344f490e27a011d9331'
const VOICEFLOW_CDN = 'https://cdn.voiceflow.com/widget-next/bundle.mjs'

const TARGET_VOLUME = 0.5
const FADE_MS = 600

/* Showcase preview timings (ms) */
const OPEN_DELAY = 700
const HOLD_MS = 4000
const COLLAPSE_MS = 800

const BUBBLE_LABELS = ['CLINIC ASSISTANT', 'LETS CHAT']
/* Strict horizontal grid: evenly spaced columns → perfectly balanced
   density from the left margin, through the centre, to the right margin. */
const COLUMNS = 12
const BUBBLES = Array.from({ length: COLUMNS }, (_, i) => ({
  id: i,
  left: ((i + 0.5) / COLUMNS) * 100,
  duration: 18 + (i % 4) * 3,
  delay: -(i * 2.3),
  label: BUBBLE_LABELS[i % 2],
  scale: 0.85 + (i % 3) * 0.12,
}))

/* Sample conversation typed into the showcase preview window */
const SAMPLE_LINES = [
  'CLIENT: Do you offer laser hair removal?',
  'ASSISTANT: Yes — medical-grade & safe for all skin tones.',
  'CLIENT: How do I book?',
  'ASSISTANT: Tap BOOK NOW and pick your slot. ✦',
]

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

/* Open the assistant in-line, retrying briefly while the widget boots. */
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

function closeVoiceflow() {
  try {
    window.voiceflow?.chat?.close?.()
  } catch {
    /* widget not ready — nothing to close */
  }
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

/* Rapid typewriter for the showcase preview */
function useTypedText(lines, active, speed = 20) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (!active) {
      setText('')
      return
    }
    const full = lines.join('\n')
    let i = 0
    const id = setInterval(() => {
      i += 1
      setText(full.slice(0, i))
      if (i >= full.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [active, lines, speed])
  return text
}

export default function MindRelaxEnclave() {
  const compact = useIsCompact()
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const fadeRef = useRef(0)
  const seqRef = useRef([])

  /* Showcase phase: idle (floating bubble) → open (preview) → closing → idle */
  const [phase, setPhase] = useState('idle')
  const [entryKey, setEntryKey] = useState(0)

  const typed = useTypedText(SAMPLE_LINES, phase === 'open')

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

  const toggleVideoAudio = () => {
    const video = videoRef.current
    if (!video) return
    if (video.muted || video.volume === 0) fadeTo(TARGET_VOLUME)
    else hardMute()
  }

  const openChat = () => openVoiceflow()
  const closeChat = () => closeVoiceflow()

  useEffect(() => {
    if (compact) injectVoiceflow()
  }, [compact])

  /* Mobile/tablet only: watch the layer for the video, the showcase sequence
     and the chat auto-close. */
  useEffect(() => {
    if (!compact) return
    const section = sectionRef.current
    if (!section) return

    const clearSeq = () => {
      seqRef.current.forEach(clearTimeout)
      seqRef.current = []
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          /* Video sound fades up the moment the layer takes focus */
          fadeTo(TARGET_VOLUME)

          /* Showcase: expand → hold 4s → collapse → rejoin the float */
          clearSeq()
          setEntryKey((k) => k + 1)
          setPhase('idle')
          seqRef.current = [
            setTimeout(() => setPhase('open'), OPEN_DELAY),
            setTimeout(() => setPhase('closing'), OPEN_DELAY + HOLD_MS),
            setTimeout(
              () => setPhase('idle'),
              OPEN_DELAY + HOLD_MS + COLLAPSE_MS
            ),
          ]
        } else {
          hardMute()
          if (!entry.isIntersecting) {
            /* Scrolled away — collapse the sequence and shut the chat */
            clearSeq()
            setPhase('idle')
            closeChat()
          }
        }
      },
      { threshold: [0, 0.55] }
    )
    observer.observe(section)

    return () => {
      observer.disconnect()
      clearSeq()
      hardMute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact])

  useEffect(() => () => cancelAnimationFrame(fadeRef.current), [])

  if (!compact) return null

  const showcaseOpen = phase === 'open'

  return (
    <section
      id="page-4b"
      ref={sectionRef}
      className="section relative h-screen min-h-[100dvh] max-h-[100dvh] overflow-hidden bg-black lg:hidden"
    >
      {/* ---- Slow charcoal ocean-wave border fade ---- */}
      <div
        aria-hidden="true"
        className="page4b-wave pointer-events-none absolute inset-0 z-10"
      />

      {/* ---- Evenly distributed, lazily drifting speech-cloud matrix ---- */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
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
              onClick={openChat}
              style={{ transform: `scale(${b.scale})` }}
              className="pointer-events-auto whitespace-nowrap rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-2 font-sans text-[10px] font-medium uppercase tracking-wider text-zinc-300 backdrop-blur-md"
            >
              {b.label}
            </button>
          </div>
        ))}
      </div>

      {/* ---- Focal breathing video ---- */}
      <div className="absolute inset-0 z-30 flex items-center justify-center px-4">
        <button
          type="button"
          onClick={toggleVideoAudio}
          aria-label="Toggle mind-relax media sound"
          className="block w-full max-w-[260px]"
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
            controlsList="nodownload"
            className="block h-auto w-full rounded-xl"
          />
        </button>
      </div>

      {/* ---- Right-side showcase preview bubble ---- */}
      <div
        key={entryKey}
        className="bubble-rise absolute right-2 z-40"
        style={{
          bottom: '-60px',
          animationDuration: '24s',
          animationDelay: '-9s',
          animationPlayState: phase === 'idle' ? 'running' : 'paused',
        }}
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={openChat}
            aria-label="Open the assistant preview"
            style={
              showcaseOpen
                ? {
                    backgroundImage: `url(${WALLPAPER})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
            className={`relative overflow-hidden border backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              showcaseOpen
                ? 'h-[172px] w-[228px] rounded-3xl border-zinc-700/60'
                : 'h-[36px] w-[108px] rounded-full border-zinc-800 bg-zinc-900/40'
            }`}
          >
            {showcaseOpen ? (
              <span className="block h-full w-full bg-black/50 p-3 text-left font-sans text-[9px] leading-relaxed text-zinc-100">
                <span className="mb-1 block text-[8px] uppercase tracking-[0.25em] text-champagne">
                  Live Preview
                </span>
                <span className="block whitespace-pre-wrap">
                  {typed}
                  <span className="animate-pulse">▍</span>
                </span>
              </span>
            ) : (
              <span className="flex h-full w-full items-center justify-center whitespace-nowrap font-sans text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                LETS CHAT
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
