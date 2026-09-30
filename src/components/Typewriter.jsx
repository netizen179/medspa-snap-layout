import { useEffect, useRef, useState } from 'react'

/* ==========================================================================
   MECHANICAL TYPEWRITER REVEAL
   Prints `text` one character at a time whenever `active` flips true and
   resets the moment it flips false, so a snap-entry re-triggers the full
   letter-by-letter animation. The trailing caret only shows while typing.
   ========================================================================== */
export default function Typewriter({ text, active, speed = 55, className = '' }) {
  const [count, setCount] = useState(0)
  const timerRef = useRef(0)

  useEffect(() => {
    clearInterval(timerRef.current)
    if (!active) {
      setCount(0)
      return
    }
    setCount(0)
    timerRef.current = setInterval(() => {
      setCount((current) => {
        if (current >= text.length) {
          clearInterval(timerRef.current)
          return current
        }
        return current + 1
      })
    }, speed)
    return () => clearInterval(timerRef.current)
  }, [active, text, speed])

  const done = count >= text.length

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span
        aria-hidden="true"
        className={`transition-opacity duration-200 ${done ? 'opacity-0' : 'opacity-70'}`}
      >
        |
      </span>
    </span>
  )
}
