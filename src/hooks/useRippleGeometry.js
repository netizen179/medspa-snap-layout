import { useLayoutEffect, useState } from 'react'

/* ==========================================================================
   IMAGE-REGISTERED RIPPLE GEOMETRY (mobile & tablet)
   ==========================================================================
   The portrait is rendered with `object-fit: cover`, so its pixel content is
   scaled and cropped inside the element box. The 9 measured ripple slices
   therefore do NOT sit at fixed percentages of the viewport — they have to be
   projected from the IMAGE coordinate space into the on-screen box using the
   same cover maths the browser uses:

     scale   = max(cw / nw, ch / nh)
     rw      = nw * scale
     offsetX = (cw - rw) * posX      // posX = object-position X (0…1)

     screenX(f) = offsetX + f * rw   // f = fraction of the image width

   The boundaries below are the SAME measured divisions the desktop hover
   grid is registered to (RIPPLE_ZONE + TRACK_WEIGHTS in Hero.jsx), so the
   mobile tracks land exactly on top of the visual ripple lines — the graphic
   and the code cannot be told apart.
   ========================================================================== */

/* 10 boundaries → exactly 9 narrow slices, in image-width fractions. */
export const RIPPLE_BOUNDARIES = [
  0.4131, 0.4351, 0.4565, 0.4786, 0.5012, 0.5226, 0.5446, 0.5678, 0.5898,
  0.606,
]

/**
 * Measure where each ripple slice lands inside `wrapRef`, given the rendered
 * image element and the `object-position` X used to render it.
 * Returns [{ left, width }] in percentages of the wrapper box.
 */
export function useRippleGeometry(imgRef, wrapRef, posX = 0.5) {
  const [geometry, setGeometry] = useState([])

  useLayoutEffect(() => {
    const img = imgRef.current
    const wrap = wrapRef.current
    if (!img || !wrap) return

    const measure = () => {
      const nw = img.naturalWidth
      const nh = img.naturalHeight
      const cw = wrap.clientWidth
      const ch = wrap.clientHeight
      if (!nw || !nh || !cw || !ch) return

      const scale = Math.max(cw / nw, ch / nh)
      const renderedWidth = nw * scale
      const offsetX = (cw - renderedWidth) * posX

      const next = []
      for (let i = 0; i < RIPPLE_BOUNDARIES.length - 1; i++) {
        const x1 = offsetX + RIPPLE_BOUNDARIES[i] * renderedWidth
        const x2 = offsetX + RIPPLE_BOUNDARIES[i + 1] * renderedWidth
        next.push({
          left: (x1 / cw) * 100,
          width: ((x2 - x1) / cw) * 100,
        })
      }
      setGeometry(next)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrap)
    if (img.complete) measure()
    else img.addEventListener('load', measure)

    return () => {
      observer.disconnect()
      img.removeEventListener('load', measure)
    }
  }, [imgRef, wrapRef, posX])

  return geometry
}
