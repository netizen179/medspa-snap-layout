export default function BookNowButton({ hidden }) {
  return (
    <a
      href="#page-4"
      className={`fixed right-6 bottom-6 z-50 border border-champagne/60 bg-black/40 px-5 py-3 text-[11px] uppercase tracking-[0.25em] text-ivory backdrop-blur transition-all duration-700 hover:bg-champagne hover:text-black ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      Book Now
    </a>
  )
}
