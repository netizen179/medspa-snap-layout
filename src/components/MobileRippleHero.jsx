import { useEffect, useRef, useState } from 'react'
import { useRippleGeometry } from '../hooks/useRippleGeometry'

/* ==========================================================================
   PAGE 1 — MOBILE / TABLET MEDIA WAVE ENGINE (< lg)
   ==========================================================================
   The 9 code columns are completely transparent, colourless and borderless
   by default — only the monochrome portrait canvas shows. Each column is a
   track registered to the portrait's measured ripple lines (see
   useRippleGeometry) and holds a looping media reel.

   ONE-TIME INTRO MEDIA WAVE
   Immediately after the site finishes loading, all 9 image/video ripple
   slices execute a single unified cascading "Media Wave": each track
   stretches to the right, stacking over the previous one in sequence until
   the final slice is revealed. The expanded wave holds on absolute mute for
   exactly 3 seconds, then every track pulls back individually, one by one,
   into its original narrow masked groove. The wave runs once per page load
   and never again until the page is fully refreshed.

   MANUAL TOUCH OVERRIDES (armed once the intro wave has pulled back)
   - Tapping a slice stretches it open to the right and unmutes its audio.
   - Video slices stay expanded and audible until the clip ends or ✕.
   - Image slices lock expanded for exactly 3s, then auto-collapse.
   - ✕ or a tap on the background canvas collapses instantly.
   - Scrolling off Page 1 hard-kills every media audio stream instantly.
   ========================================================================== */

/* Centre the measured ripple zone so all 9 narrow lines stay in the crop */
const MOBILE_POS_X = 0.5096

const SLICE_COUNT = 9
const INTRO_STEP_MS = 190
const INTRO_HOLD_MS = 3000
const INTRO_SETTLE_MS = 420
const IMAGE_HOLD_MS = 3000
const AUDIO_FADE_MS = 700
const STRETCH_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'

export default function MobileRippleHero({ media }) {
  const wrapRef = useRef(null)
  const imgRef = useRef(null)
  const videoRefs = useRef([])
  const rampRef = useRef(0)
  const imageTimerRef = useRef(0)

  /* idle → wave → hold → retract → ready */
  const [phase, setPhase] = useState('idle')
  const [waveCount, setWaveCount] = useState(0)
  const [manualIndex, setManualIndex] = useState(null)

  const geometry = useRippleGeometry(imgRef, wrapRef, MOBILE_POS_X)

  const introRunning =
    phase === 'wave' || phase === 'hold' || phase === 'retract'

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

  /* Every slice plays silent while the intro wave is on screen */
  const playAllMuted = () => {
    videoRefs.current.forEach((video) => {
      if (!video) return
      video.muted = true
      video.volume = 0
      video.loop = true
      video.play().catch(() => {})
    })
  }

  /* Smoothly fade a slice's audio stream up to full volume */
  const fadeUp = (video) => {
    if (!video) return
    cancelAnimationFrame(rampRef.current)
    video.muted = false
    video.volume = 0
    video.play().catch(() => {
      /* Autoplay with sound may be blocked — keep the visual unfold */
      video.muted = true
      video.play().catch(() => {})
    })
    /* rAF timestamps can precede performance.now(), so anchor the ramp to
       the first frame and clamp the volume into the legal 0…1 range. */
    let start = null
    const ramp = (now) => {
      if (video.muted) return
      if (start === null) start = now
      const progress = Math.min(Math.max((now - start) / AUDIO_FADE_MS, 0), 1)
      video.volume = progress
      if (progress < 1) rampRef.current = requestAnimationFrame(ramp)
    }
    rampRef.current = requestAnimationFrame(ramp)
  }

  const startSlice = (index, loop) => {
    const video = videoRefs.current[index]
    if (!video) return
    video.loop = loop
    try {
      video.currentTime = 0
    } catch {
      /* metadata not ready yet — play from wherever it is */
    }
    fadeUp(video)
  }

  /* ---- ONE-TIME INTRO MEDIA WAVE ----
     Starts the moment the measured ripple geometry is ready, runs once per
     page load, and never triggers again until a full refresh. */
  useEffect(() => {
    if (geometry.length !== SLICE_COUNT) return

    let cancelled = false
    const timers = []
    const later = (fn, ms) => timers.push(setTimeout(fn, ms))

    setPhase('wave')
    setWaveCount(0)
    playAllMuted()

    /* Cascade: each track stretches to the right, stacking over the last */
    for (let i = 1; i <= SLICE_COUNT; i++) {
      later(() => {
        if (!cancelled) setWaveCount(i)
      }, i * INTRO_STEP_MS)
    }

    /* Hold the fully expanded wave on absolute mute for 3 seconds */
    const waveEnd = SLICE_COUNT * INTRO_STEP_MS
    later(() => {
      if (!cancelled) setPhase('hold')
    }, waveEnd)

    /* Retract: every track pulls back individually, one by one */
    const retractStart = waveEnd + INTRO_HOLD_MS
    later(() => {
      if (!cancelled) setPhase('retract')
    }, retractStart)
    for (let i = 1; i <= SLICE_COUNT; i++) {
      later(() => {
        if (!cancelled) setWaveCount(SLICE_COUNT - i)
      }, retractStart + i * INTRO_STEP_MS)
    }

    /* Intro complete — silence everything and arm the tap overrides */
    later(() => {
      if (cancelled) return
      setWaveCount(0)
      setPhase('ready')
      killAudio()
    }, retractStart + SLICE_COUNT * INTRO_STEP_MS + INTRO_SETTLE_MS)

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
      clearTimeout(imageTimerRef.current)
      refs.forEach((video) => {
        if (!video) return
        video.muted = true
        video.volume = 0
        video.pause()
      })
    }
  }, [])

  const collapse = () => {
    killAudio()
    clearTimeout(imageTimerRef.current)
    setManualIndex(null)
  }

  /* Manual tap (armed only after the intro wave has pulled back):
     stretch this slice open and fade its audio up. */
  const handleTap = (index) => {
    if (phase !== 'ready') return
    if (manualIndex === index) return
    killAudio()
    clearTimeout(imageTimerRef.current)
    setManualIndex(index)
    if (media[index].type === 'video') {
      startSlice(index, false)
    } else {
      imageTimerRef.current = setTimeout(collapse, IMAGE_HOLD_MS)
    }
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
          const introExpanded = introRunning && i < waveCount
          const manualExpanded = manualIndex === i
          const expanded = introExpanded || manualExpanded
          const mediaCls = `absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            expanded ? 'opacity-100' : 'opacity-0'
          }`
          return (
            <button
              key={i}
              aria-label={`Expand treatment media ${i + 1}`}
              onClick={() => handleTap(i)}
              className="absolute top-0 h-full cursor-pointer overflow-hidden"
              style={{
                /* Left edge stays pinned; the slice unrolls to the right */
                left: `${track.left}%`,
                width: `${expanded ? 100 - track.left : track.width}%`,
                zIndex: manualExpanded ? 40 : introExpanded ? 10 + i : 5,
                transition: `width 0.7s ${STRETCH_EASE}`,
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
                  onEnded={() => {
                    if (manualIndex === i) collapse()
                  }}
                  className={mediaCls}
                />
              ) : (
                <img src={item.src} alt="" loading="lazy" className={mediaCls} />
              )}
            </button>
          )
        })}
      </div>

      {manualIndex !== null && (
        <button
          aria-label="Close media view"
          onClick={collapse}
          className="absolute top-4 right-4 z-[45] border border-zinc-500/40 bg-black/60 px-3.5 py-2.5 text-xs tracking-widest text-zinc-300 backdrop-blur transition-colors duration-300 hover:text-ivory"
        >
          ✕
        </button>
      )}
    </div>
  )
}
