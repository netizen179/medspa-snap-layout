import { useEffect } from 'react'

/*
 * GLOBAL SNAP PHYSICS SLOWDOWN
 * ---------------------------
 * Native CSS scroll-snap snaps instantly (browser-controlled timing),
 * so on fine-pointer devices we take over and glide between layers
 * with an extra-long, buttery ease-in-out curve (~1.6s), like the
 * fluid Webflow origin. Touch devices keep native momentum with
 * `scroll-snap-type: y proximity` as a fallback (see index.css).
 *
 * Also intercepts in-page anchor links (#page-N) and arrow/page keys
 * so every navigation uses the same luxurious glide.
 */

const DURATION = 1600

/* ease-in-out quart — extra buttery */
const easeInOutQuart = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

export function useSmoothSnap(sectionIds) {
  useEffect(() => {
    const finePointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches
    if (!finePointer) return

    let animating = false
    let raf = 0

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

    const scrollToIndex = (index) => {
      const target = sectionIds[index]
        ? document.getElementById(sectionIds[index])
        : null
      if (!target) return
      const start = window.scrollY
      const end = target.offsetTop
      const distance = end - start
      if (Math.abs(distance) < 2) return
      cancelAnimationFrame(raf)
      animating = true
      const t0 = performance.now()
      const step = (now) => {
        const progress = Math.min((now - t0) / DURATION, 1)
        window.scrollTo(0, start + distance * easeInOutQuart(progress))
        if (progress < 1) {
          raf = requestAnimationFrame(step)
        } else {
          animating = false
        }
      }
      raf = requestAnimationFrame(step)
    }

    const currentIndex = () => {
      const mid = window.scrollY + window.innerHeight / 2
      let index = 0
      sectionIds.forEach((id, i) => {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= mid) index = i
      })
      return index
    }

    const onWheel = (e) => {
      if (e.ctrlKey) return // allow pinch-zoom
      e.preventDefault()
      if (animating || Math.abs(e.deltaY) < 4) return
      const direction = e.deltaY > 0 ? 1 : -1
      scrollToIndex(
        clamp(currentIndex() + direction, 0, sectionIds.length - 1)
      )
    }

    const onKey = (e) => {
      const tag = document.activeElement?.tagName ?? ''
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(tag)) return
      const current = currentIndex()
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        scrollToIndex(Math.min(current + 1, sectionIds.length - 1))
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        scrollToIndex(Math.max(current - 1, 0))
      } else if (e.key === 'Home') {
        e.preventDefault()
        scrollToIndex(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        scrollToIndex(sectionIds.length - 1)
      }
    }

    const onClick = (e) => {
      const anchor = e.target.closest('a[href^="#page-"]')
      if (!anchor) return
      const index = sectionIds.indexOf(anchor.getAttribute('href').slice(1))
      if (index === -1) return
      e.preventDefault()
      scrollToIndex(index)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [sectionIds])
}
