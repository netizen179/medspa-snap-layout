/*
 * Persistent floating "Book Now" action.
 *
 * Desktop (lg+): anchors to #page-2 and lets useSmoothSnap perform its
 * buttery 1.6s glide.
 * Mobile & tablet (< lg): Page 2 is split into two snap layers, so the
 * click is redirected straight to the centred 2B cards viewport.
 */
export default function BookNowButton({ hidden }) {
  const handleClick = (e) => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024) return
    const target = document.getElementById('page-2b')
    if (!target) return
    /* Stop the event before useSmoothSnap's document-level anchor
       interceptor can hijack it back to the top of Page 2A. */
    e.preventDefault()
    e.stopPropagation()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <a
      href="#page-2"
      onClick={handleClick}
      className={`fixed right-6 bottom-6 z-50 border border-champagne/60 bg-black/40 px-5 py-3 text-[11px] uppercase tracking-[0.25em] text-ivory backdrop-blur transition-all duration-700 hover:bg-champagne hover:text-black ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      Book Now
    </a>
  )
}
