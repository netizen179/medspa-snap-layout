import { useEffect, useRef, useState } from 'react'
import { useRippleGeometry } from '../hooks/useRippleGeometry'

/* ==========================================================================
   PAGE 1 — MOBILE / TABLET RIPPLE ENGINE (< lg)
   ==========================================================================
   The 9 code columns are completely transparent, colourless and borderless
   by default — only the monochrome portrait canvas shows. Each column is a
   track registered to the portrait's measured ripple lines (see
   useRippleGeometry).

   ONE-TIME "OCEAN WAVE" INTRO (runs exactly once per live session)
   Immediately after load, a single fluid wave sweeps the 9 columns from the
   far RIGHT of the grid across to the far LEFT. Each track ripples in turn —
   bulging slightly out toward the viewport glass on a 3D translateZ and
   sinking back away — with a soft sheen riding the crest so the motion reads
   over the transparent tracks. When the wave exits stage left the columns
   lock flat into their narrow masking grooves and the tap pipeline arms.

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
/* Ocean wave: one right → left sweep, then the columns lock flat. */
const WAVE_DELAY_MS = 260
const WAVE_DURATION_MS = 1500
const WAVE_AMPLITUDE = 40
const WAVE_SIGMA = 1.35
const WAVE_FREQ = 0.95
const WAVE_SHEEN = 0.16
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
  const trackRefs = useRef([])
  const sheenRefs = useRef([])
  const waveRafRef = useRef(0)
  const waveTimerRef = useRef(0)

  /* idle → wave → ready */
  const [phase, setPhase] = useState('idle')
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

  /* ---- ONE-TIME "OCEAN WAVE" INTRO ----
     A single fluid wave sweeps the 9 columns from the far RIGHT of the grid
     across to the far LEFT: each track bulges out toward the viewport glass
     on a 3D translateZ and sinks back away, with a soft sheen riding the
     crest so the motion reads over the transparent tracks. When the wave
     exits stage left the columns lock flat into their narrow masking grooves
     and the tap pipeline arms. Runs once per page load. */
  useEffect(() => {
    if (geometry.length !== SLICE_COUNT) return

    let cancelled = false

    const start = () => {
      if (cancelled) return
      setPhase('wave')
      const t0 = performance.now()

      const frame = (now) => {
        if (cancelled) return
        const t = Math.min((now - t0) / WAVE_DURATION_MS, 1)
        /* The crest travels from the far right (index 8) to the far left (0) */
        const crest = (1 - t) * (SLICE_COUNT - 1)
        for (let i = 0; i < SLICE_COUNT; i++) {
          const d = i - crest
          const decay = Math.exp(-(d * d) / (2 * WAVE_SIGMA * WAVE_SIGMA))
          const wave = Math.sin(d * WAVE_FREQ) * decay
          const node = trackRefs.current[i]
          if (node) {
            node.style.transform = `translateZ(${(wave * WAVE_AMPLITUDE).toFixed(2)}px)`
          }
          const sheen = sheenRefs.current[i]
          if (sheen) sheen.style.opacity = Math.abs(wave) * WAVE_SHEEN
        }

        if (t < 1) {
          waveRafRef.current = requestAnimationFrame(frame)
          return
        }

        /* Lock the columns flat into their narrow stationary grooves */
        for (let i = 0; i < SLICE_COUNT; i++) {
          const node = trackRefs.current[i]
          if (node) node.style.transform = 'translateZ(0px)'
          const sheen = sheenRefs.current[i]
          if (sheen) sheen.style.opacity = 0
        }
        setPhase('ready')
      }

      waveRafRef.current = requestAnimationFrame(frame)
    }

    waveTimerRef.current = setTimeout(start, WAVE_DELAY_MS)

    return () => {
      cancelled = true
      clearTimeout(waveTimerRef.current)
      cancelAnimationFrame(waveRafRef.current)
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
      cancelAnimationFrame(waveRafRef.current)
      clearTimeout(waveTimerRef.current)
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

      {/* Perspective host — the one-time ocean wave bulges the tracks out
          toward the glass on translateZ, then sinks them back away. */}
      <div className="absolute inset-0 z-[5]" style={{ perspective: '820px' }}>
        {geometry.map((track, i) => {
          const item = media[i]
          const isActive = manualIndex === i
          const isZoomed = isActive && zoomed
          const expanded = isActive
          const mediaCls = `absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            expanded ? 'opacity-100' : 'opacity-0'
          } ${isZoomed ? 'fade-zoom-in' : closing && isActive ? 'fade-zoom-out' : ''}`
          return (
            <button
              key={i}
              ref={(el) => (trackRefs.current[i] = el)}
              aria-label={`Expand treatment media ${i + 1}`}
              onClick={() => handleTap(i)}
              className="absolute top-0 h-full cursor-pointer overflow-hidden"
              style={{
                /* Left edge stays pinned while the track stretches right;
                   the zoom step breaks the asset out to the full screen. */
                left: `${isZoomed ? 0 : track.left}%`,
                width: `${isZoomed ? 100 : expanded ? 100 - track.left : track.width}%`,
                zIndex: isZoomed ? 40 : isActive ? 30 : 5,
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
              {/* Ocean-wave sheen — rides the crest so the 3D ripple reads
                  over the transparent tracks (driven by the wave rAF). */}
              <span
                ref={(el) => (sheenRefs.current[i] = el)}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-white opacity-0"
              />
            </button>
          )
        })}
      </div>

    </div>
  )
}
