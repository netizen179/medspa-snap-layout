import { useEffect, useRef, useState } from 'react'
import { useRippleGeometry } from '../hooks/useRippleGeometry'

/* ==========================================================================
   PAGE 1 — MOBILE / TABLET RIPPLE ENGINE (< lg)
   ==========================================================================
   The 9 code columns are completely transparent, colourless and borderless
   by default — only the monochrome portrait canvas shows. Each column is a
   track registered to the portrait's measured ripple lines (see
   useRippleGeometry) and holds a looping media reel.

   ROLLING INACTIVITY SLIDE ENGINE
   After load, while the visitor stays inactive on Page 1, each video slice
   unrolls horizontally to the right from its fixed stationary position
   (left edge pinned, right edge unfolding into the open space), plays with
   audio fading up, then collapses back to its narrow line after 3s and the
   next slice takes over — a continuous rolling loop.

   MANUAL OVERRIDES
   - Tapping a slice halts the auto loop and expands that slice manually.
   - Video slices stay expanded and audible until the clip ends or ✕.
   - Image slices lock expanded for exactly 3s, then auto-collapse.
   - ✕ or a tap on the background canvas collapses instantly and resumes
     the automated rolling engine.
   - Scrolling off Page 1 hard-kills every media audio stream instantly.
   ========================================================================== */

/* Centre the measured ripple zone so all 9 narrow lines stay in the crop */
const MOBILE_POS_X = 0.5096

const AUTO_HOLD_MS = 3000
const AUTO_START_MS = 1400
const IMAGE_HOLD_MS = 3000
const AUDIO_FADE_MS = 700
const STRETCH_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'

export default function MobileRippleHero({ media }) {
  const wrapRef = useRef(null)
  const imgRef = useRef(null)
  const videoRefs = useRef([])
  const rampRef = useRef(0)
  const imageTimerRef = useRef(0)

  const [visible, setVisible] = useState(true)
  const [autoIndex, setAutoIndex] = useState(null)
  const [manualIndex, setManualIndex] = useState(null)

  const geometry = useRippleGeometry(imgRef, wrapRef, MOBILE_POS_X)
  const videoIndices = media
    .map((m, i) => (m.type === 'video' ? i : -1))
    .filter((i) => i >= 0)

  const activeIndex = manualIndex !== null ? manualIndex : autoIndex

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
    const start = performance.now()
    const ramp = (now) => {
      if (video.muted) return
      const progress = Math.min((now - start) / AUDIO_FADE_MS, 1)
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

  /* ---- ROLLING INACTIVITY SLIDE ENGINE ---- */
  useEffect(() => {
    if (!visible || manualIndex !== null || geometry.length === 0) return
    if (videoIndices.length === 0) return

    let cancelled = false
    let cursor = 0
    let holdTimer = 0

    const step = () => {
      if (cancelled) return
      const index = videoIndices[cursor]
      setAutoIndex(index)
      startSlice(index, true)
      holdTimer = setTimeout(() => {
        if (cancelled) return
        const video = videoRefs.current[index]
        if (video) {
          video.muted = true
          video.volume = 0
          video.pause()
        }
        cursor = (cursor + 1) % videoIndices.length
        step()
      }, AUTO_HOLD_MS)
    }

    const startTimer = setTimeout(step, AUTO_START_MS)
    return () => {
      cancelled = true
      clearTimeout(startTimer)
      clearTimeout(holdTimer)
      cancelAnimationFrame(rampRef.current)
      setAutoIndex(null)
    }
  }, [visible, manualIndex, geometry.length])

  /* ---- Scroll audio kill: the moment Page 1 leaves the viewport ---- */
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
        if (!entry.isIntersecting) {
          killAudio()
          setAutoIndex(null)
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

  /* Manual tap: halt the auto loop, expand this slice, fade its audio up */
  const handleTap = (index) => {
    if (manualIndex === index) return
    killAudio()
    clearTimeout(imageTimerRef.current)
    setAutoIndex(null)
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
          const expanded = activeIndex === i
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
                zIndex: expanded ? 40 : 5,
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
