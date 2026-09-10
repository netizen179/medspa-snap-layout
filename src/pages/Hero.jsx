import { useEffect, useRef, useState } from 'react'

/* ==========================================================================
   PAGE 1 — THE HERO SCREEN LAYER
   ==========================================================================

   IMAGE-TO-GRID ALIGNMENT (derived from analysis of public/hero-ripple.png):
   The supplied portrait is 1726x911 (native aspect ≈ 1.8946). Per-column
   vertical edge-energy analysis of the actual pixels located the visible
   ripple divisions at these fractions of the image width:

     0.4131  0.4351  0.4565  0.4786  0.5012  0.5226  0.5446  0.5678  0.5898  0.6060

   → 10 boundaries forming exactly 9 slices of ≈2.1–2.3% width each
     (analysis confirmed the divisions are near-periodic, ~38px pitch,
     but NOT equal 11.11% tracks — the geometry below is measured).

   The 9 transparent interaction columns live inside the SAME
   aspect-locked frame as the <img>, so the grid and the image scale
   together as a single composition and never drift apart. The portrait
   itself is the source of truth for the grid geometry.
   ========================================================================== */

const HERO_ASPECT = 1726 / 911

/* Ripple zone (percent of the image frame) measured from the analysis */
const RIPPLE_ZONE = { left: 41.31, width: 19.29 }

/* Per-track flex-grow weights within the zone, from measured slice widths
   (sum ≈ 100). Hovered track grows ×3 while siblings compress ×0.75. */
const TRACK_WEIGHTS = [11.4, 11.1, 11.5, 11.7, 11.1, 11.4, 12.0, 11.4, 8.4]

const MEDIA_BASE =
  'https://mtgrgksrbadhigdnzeee.supabase.co/storage/v1/object/public/medspa-media/'

const SLICE_MEDIA = [
  { type: 'image', src: `${MEDIA_BASE}grid%20image-1.png` },
  { type: 'image', src: `${MEDIA_BASE}grid%20image-2.png` },
  { type: 'image', src: `${MEDIA_BASE}grid%20image-3.png` },
  { type: 'video', src: `${MEDIA_BASE}grid%20video-4.mp4` },
  { type: 'video', src: `${MEDIA_BASE}grid%20video-5.mp4` },
  { type: 'video', src: `${MEDIA_BASE}grid%20video-6.mp4` },
  { type: 'video', src: `${MEDIA_BASE}grid%20video-7.mp4` },
  { type: 'video', src: `${MEDIA_BASE}grid%20video-8.mp4` },
  { type: 'image', src: `${MEDIA_BASE}grid%20image-9.png` },
]

function SliceMedia({ media, visible, videoRef }) {
  const cls = `absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
    visible ? 'opacity-100' : 'opacity-0'
  }`
  if (media.type === 'video') {
    return (
      <video
        ref={videoRef}
        src={media.src}
        muted
        loop
        playsInline
        preload="metadata"
        className={cls}
      />
    )
  }
  return <img src={media.src} alt="" loading="lazy" className={cls} />
}

export default function Hero() {
  const [hovered, setHovered] = useState(null)
  const [openSlice, setOpenSlice] = useState(-1) // mobile accordion
  const videoRefs = useRef([])
  const contentRef = useRef(null)
  const sectionRef = useRef(null)
  const hoveredRef = useRef(null)

  useEffect(() => {
    hoveredRef.current = hovered
  }, [hovered])

  /* AUDIO SYNC — hard rule: only ONE sound can ever exist.
     The hovered track plays muted while its column expands; the sound
     fades in the exact moment expansion completes (transitionend).
     Every hover change, mouse leave, or layer exit KILLS ALL audio
     (mute + pause) first — only then does the hovered track restart,
     muted — so overlapping sound clashes are impossible. */
  const killAllAudio = () => {
    videoRefs.current.forEach((video) => {
      if (!video) return
      video.muted = true
      video.pause()
    })
  }

  useEffect(() => {
    killAllAudio()
    if (hovered === null) return
    const video = videoRefs.current[hovered]
    if (video) video.play().catch(() => {})
  }, [hovered])

  /* The glide to another layer moves the hero out from under the
     cursor without a mouseleave — kill audio the moment the layer
     leaves the viewport. */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setHovered(null)
          killAllAudio()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  /* Never leave a video element playing (unmuted or not) after the
     component unmounts. */
  useEffect(() => {
    const refs = videoRefs.current
    return () => {
      refs.forEach((video) => {
        if (!video) return
        video.muted = true
        video.pause()
      })
    }
  }, [])

  const handleExpansionComplete = (i) => (e) => {
    if (e.propertyName !== 'flex-grow' || hoveredRef.current !== i) return
    const video = videoRefs.current[i]
    if (!video) return
    video.muted = false
    video.play().catch(() => {
      /* Browsers may require prior user interaction for sound */
      video.muted = true
    })
  }

  /* Scroll physics: hero typography fades 1 → 0 as the user scrolls
     toward Page 2 (progress-based, fully reversible). */
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = contentRef.current
        if (!el) return
        const progress = Math.min(window.scrollY / window.innerHeight, 1)
        el.style.opacity = 1 - progress
        el.style.transform = `translateY(${progress * -40}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      id="page-1"
      ref={sectionRef}
      className="section relative h-screen min-h-[640px] overflow-hidden bg-black"
    >
      {/* ---- Portrait, aspect-locked (grid registration frame) ---- */}
      <div className="absolute inset-0 hidden items-center justify-center md:flex">
        <div
          className="relative"
          style={{
            width: `min(100%, calc(100vh * ${HERO_ASPECT}))`,
            aspectRatio: String(HERO_ASPECT),
          }}
        >
          <img
            src="/hero-ripple.png"
            alt=""
            draggable="false"
            className="absolute inset-0 h-full w-full select-none object-cover"
          />

          {/* ---- Invisible 9-track interaction layer, registered to
                the portrait's ripple slices. Default state: fully
                transparent and borderless — no second visible grid. ---- */}
          <div
            className="absolute inset-y-0 hidden md:flex"
            style={{
              left: `${RIPPLE_ZONE.left}%`,
              width: `${RIPPLE_ZONE.width}%`,
            }}
            onMouseLeave={() => setHovered(null)}
          >
            {SLICE_MEDIA.map((media, i) => (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onTransitionEnd={handleExpansionComplete(i)}
                className="relative h-full cursor-pointer overflow-hidden"
                style={{
                  /* Hovered track expands fully (≈ full slice-zone width)
                     to reveal the wide asset proportions; siblings compress */
                  flexGrow:
                    TRACK_WEIGHTS[i] *
                    10 *
                    (hovered === i ? 12 : hovered !== null ? 0.15 : 1),
                  flexBasis: 0,
                  transition: 'flex-grow 0.9s ease-in-out',
                }}
              >
                <SliceMedia
                  media={media}
                  visible={hovered === i}
                  videoRef={(el) => (videoRefs.current[i] = el)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Mobile: full-bleed cinematic portrait (accordion below
            replaces the hover grid) ---- */}
      <img
        src="/hero-ripple.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[70%_center] md:hidden"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40 md:hidden" />

      {/* ---- Left-aligned hero typography (floats safely over the
            interaction masks) ---- */}
      <div
        ref={contentRef}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end px-[6vw] pb-8 md:justify-center md:px-[7vw] md:pb-0"
      >
        <div className="w-full max-w-3xl">
          <p
            className="anim-fade-up text-[10px] uppercase tracking-[0.35em] text-[#BDBDBD] md:text-[11px]"
            style={{ animationDelay: '0.35s' }}
          >
            Redefining Perfection
          </p>

          <h1
            className="anim-fade-up mt-5 font-serif text-[clamp(46px,7.5vw,96px)] font-medium uppercase leading-[0.98] tracking-[0.01em] md:mt-6"
            style={{ animationDelay: '0.5s' }}
          >
            {/* Chop vertical split: off-white upper half fading into
                muted dark grayscale on the lower half of each word */}
            <span className="block text-gradient-fade">Beyond</span>
            <span className="block text-gradient-fade">Surface</span>
          </h1>

          <p
            className="anim-fade-up mt-6 max-w-[380px] text-[15px] leading-[1.6] text-[#D0D0D0] md:mt-7 md:text-base"
            style={{ animationDelay: '0.7s' }}
          >
            Where artistry meets innovation.
            <br />
            Elevating beauty through precision and vision.
          </p>

          <div
            className="anim-fade-up pointer-events-auto mt-8 flex flex-col items-start gap-5 md:mt-10"
            style={{ animationDelay: '0.9s' }}
          >
            <a
              href="#page-2"
              className="group inline-flex items-baseline gap-3 border-b border-ivory/40 pb-1 text-xs uppercase tracking-[0.25em] text-ivory transition-colors duration-500 hover:border-ivory"
            >
              Discover More
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#page-4"
              className="group inline-flex items-center gap-3 border border-champagne/40 px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] text-ivory transition-all duration-500 hover:bg-champagne hover:text-black"
            >
              Book Appointment
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          {/* Mobile breaker fallback: vertically stacked accordion
              (smooth height/opacity transition) replaces the hover grid */}
          <div className="mt-8 w-full max-w-[380px] md:hidden">
            <div className="border-t border-white/15">
              {SLICE_MEDIA.map((media, i) => (
                <div key={i} className="border-b border-white/15">
                  <button
                    onClick={() =>
                      setOpenSlice(openSlice === i ? -1 : i)
                    }
                    className="flex w-full items-center justify-between py-2.5 text-[10px] uppercase tracking-[0.3em] text-[#999999]"
                  >
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-ivory">
                      {openSlice === i ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-500 ease-in-out"
                    style={{
                      maxHeight: openSlice === i ? 170 : 0,
                      opacity: openSlice === i ? 1 : 0,
                    }}
                  >
                    {media.type === 'video' ? (
                      <video
                        src={media.src}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="none"
                        className="h-[150px] w-full object-cover"
                      />
                    ) : (
                      <img
                        src={media.src}
                        alt=""
                        loading="lazy"
                        className="h-[150px] w-full object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
