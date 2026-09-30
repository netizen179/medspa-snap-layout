import { useEffect, useRef, useState } from 'react'
import { useRippleGeometry } from '../hooks/useRippleGeometry'

/* ==========================================================================
   PAGE 1 — MOBILE / TABLET RIPPLE ENGINE (< lg)
   ==========================================================================
   The 9 code columns are completely transparent, colourless and borderless
   by default — only the monochrome portrait canvas shows. Each column is a
   track registered to the portrait's measured ripple lines (see
   useRippleGeometry).

   ONE-TIME INTRO (runs once per page load, never again until a refresh)
   1. The FIRST ripple slice on the far left extends smoothly to the right
      for 4 seconds, then slides back into its stationary slot.
   2. The moment it snaps back, a quick water-ripple lighting flash cascades
      across all 9 ripples sequentially from left to right.

   MANUAL TAP PIPELINE (armed once the intro has finished)
   - Column 1: width extension only — it stretches right and shows its asset
     natively, bypassing the fade-zoom overlay entirely.
   - Columns 2–9: two steps. STEP 1 stretches the track to the right edge of
     its available space (silent). STEP 2 — the exact moment the stretch
     finishes — fade-zooms the asset out into a full-screen box and flips the
     video audio to full volume instantly.
   - Reversal: a thumb tap anywhere on the expanded media surface (or the
     canvas behind it) fades-zooms the media back down, collapses the track
     into its original narrow groove and kills the audio completely. There is
     no ✕ overlay control, so the exit gesture never clashes with the global
     CONTACT navigation anchors.
   - Scrolling off Page 1 hard-kills every media audio stream instantly.
   ========================================================================== */

/* Centre the measured ripple zone so all 9 narrow lines stay in the crop */
const MOBILE_POS_X = 0.5096

const SLICE_COUNT = 9
const INTRO_FIRST_MS = 4000
const FLASH_STEP_MS = 110
const FLASH_SETTLE_MS = 260
const STRETCH_MS = 700
const ZOOM_OUT_MS = 500
const STRETCH_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'

export default function MobileRippleHero({ media }) {
  const wrapRef = useRef(null)
  const imgRef = useRef(null)
  const videoRefs = useRef([])
  const rampRef = useRef(0)
  const stretchTimerRef = useRef(0)
  const closeTimerRef = useRef(0)

  /* idle → first → retract → flash → ready */
  const [phase, setPhase] = useState('idle')
  const [flashIndex, setFlashIndex] = useState(-1)
  const [manualIndex, setManualIndex] = useState(null)
  const [zoomed, setZoomed] = useState(false)
  const [closing, setClosing] = useState(false)

  const geometry = useRippleGeometry(imgRef, wrapRef, MOBILE_POS_X)

  /* Hard kill — mute, zero the volume, pause, restore looping */
  const killAudio = () => {
    cancelAnimationFrame(rampRef.current)
    videoRefs.current.forEach((video) => {
      if (!video) return
      video.muted = true
      video.volume = 0
      video.pause()
      video.loop = true
    })
  }

  /* Step 2 volume mapping — flip straight to full volume, no fade */
  const unmuteFull = (video) => {
    if (!video) return
    cancelAnimationFrame(rampRef.current)
    video.muted = false
    video.volume = 1
    video.play().catch(() => {
      /* Autoplay with sound may be blocked — keep the visual breakout */
      video.muted = true
      video.play().catch(() => {})
    })
  }

  /* ---- ONE-TIME INTRO: first-slice slide + water-ripple flash ----
     Starts the moment the measured ripple geometry is ready and runs once
     per page load. */
  useEffect(() => {
    if (geometry.length !== SLICE_COUNT) return

    let cancelled = false
    const timers = []
    const later = (fn, ms) => timers.push(setTimeout(fn, ms))

    /* Step 1 — the first slice alone slides out for 4 seconds */
    setPhase('first')
    later(() => {
      if (!cancelled) setPhase('retract')
    }, INTRO_FIRST_MS)

    /* Step 2 — the instant it snaps back, the ripple flash cascades L→R */
    const flashStart = INTRO_FIRST_MS + STRETCH_MS
    later(() => {
      if (!cancelled) setPhase('flash')
    }, flashStart)
    for (let i = 0; i < SLICE_COUNT; i++) {
      later(() => {
        if (!cancelled) setFlashIndex(i)
      }, flashStart + i * FLASH_STEP_MS)
    }
    later(() => {
      if (!cancelled) setFlashIndex(-1)
    }, flashStart + SLICE_COUNT * FLASH_STEP_MS)
    later(() => {
      if (cancelled) return
      setPhase('ready')
      setFlashIndex(-1)
    }, flashStart + SLICE_COUNT * FLASH_STEP_MS + FLASH_SETTLE_MS)

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry.length])

  /* ---- Scroll audio kill: the moment Page 1 leaves the viewport ---- */
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          killAudio()
          setManualIndex(null)
          setZoomed(false)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const refs = videoRefs.current
    return () => {
      cancelAnimationFrame(rampRef.current)
      clearTimeout(stretchTimerRef.current)
      clearTimeout(closeTimerRef.current)
      refs.forEach((video) => {
        if (!video) return
        video.muted = true
        video.volume = 0
        video.pause()
      })
    }
  }, [])

  /* Reversal closure — fade-zoom down, collapse, kill audio immediately */
  const collapse = () => {
    killAudio()
    clearTimeout(stretchTimerRef.current)
    if (zoomed) {
      setClosing(true)
      setZoomed(false)
      closeTimerRef.current = setTimeout(() => {
        setClosing(false)
        setManualIndex(null)
      }, ZOOM_OUT_MS)
      return
    }
    setManualIndex(null)
  }

  /* Manual tap pipeline (armed only once the intro has finished) */
  const handleTap = (index) => {
    if (phase !== 'ready') return
    /* A tap on the open media canvas reverses the pipeline */
    if (manualIndex === index) {
      collapse()
      return
    }
    killAudio()
    clearTimeout(stretchTimerRef.current)
    clearTimeout(closeTimerRef.current)
    setClosing(false)
    setZoomed(false)
    setManualIndex(index)

    const video = videoRefs.current[index]
    if (video) {
      video.loop = true
      try {
        video.currentTime = 0
      } catch {
        /* metadata not ready yet — play from wherever it is */
      }
      video.muted = true
      video.volume = 0
      video.play().catch(() => {})
    }

    /* Column 1 — width extension only, no fade-zoom overlay */
    if (index === 0) return

    /* Columns 2–9 — STEP 2 fires the instant STEP 1 finishes */
    stretchTimerRef.current = setTimeout(() => {
      setZoomed(true)
      unmuteFull(video)
    }, STRETCH_MS)
  }

  return (
    <div ref={wrapRef} className="absolute inset-0 lg:hidden">
      <img
        ref={imgRef}
        src="/hero-ripple.png"
        alt=""
        draggable="false"
        className="absolute inset-0 h-full w-full select-none object-cover"
        style={{ objectPosition: `${MOBILE_POS_X * 100}% 50%` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35" />

      {/* Background canvas — a tap collapses any expanded state */}
      <button
        aria-label="Collapse media"
        onClick={() => manualIndex !== null && collapse()}
        className="absolute inset-0 z-[4] cursor-default"
      />

      <div className="absolute inset-0 z-[5]">
        {geometry.map((track, i) => {
          const item = media[i]
          const introFirst = phase === 'first' && i === 0
          const isActive = manualIndex === i
          const isZoomed = isActive && zoomed
          const expanded = introFirst || isActive
          const flashing = flashIndex === i
          const mediaCls = `absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            expanded ? 'opacity-100' : 'opacity-0'
          } ${isZoomed ? 'fade-zoom-in' : closing && isActive ? 'fade-zoom-out' : ''}`
          return (
            <button
              key={i}
              aria-label={`Expand treatment media ${i + 1}`}
              onClick={() => handleTap(i)}
              className="absolute top-0 h-full cursor-pointer overflow-hidden"
              style={{
                /* Left edge stays pinned while the track stretches right;
                   the zoom step breaks the asset out to the full screen. */
                left: `${isZoomed ? 0 : track.left}%`,
                width: `${isZoomed ? 100 : expanded ? 100 - track.left : track.width}%`,
                zIndex: isZoomed ? 40 : isActive ? 30 : introFirst ? 20 : 5,
                transition: `left ${STRETCH_MS}ms ${STRETCH_EASE}, width ${STRETCH_MS}ms ${STRETCH_EASE}`,
              }}
            >
              {item.type === 'video' ? (
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={item.src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={mediaCls}
                />
              ) : (
                <img src={item.src} alt="" loading="lazy" className={mediaCls} />
              )}
              {/* Water-ripple lighting flash travelling L→R */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-white"
                style={{
                  opacity: flashing ? 0.4 : 0,
                  transition: `opacity ${FLASH_STEP_MS}ms linear`,
                }}
              />
            </button>
          )
        })}
      </div>

    </div>
  )
}
