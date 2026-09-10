import Reveal from '../components/Reveal'

/* ==========================================================================
   PAGE 5 — THE LUXURY FOOTER PANEL & FINAL CONTACT HUB
   Terminal layer of the 5-page snap structure. As the final snap
   point, downward scrolling locks tightly on this layer.
   ========================================================================== */

export default function Footer() {
  return (
    <section
      id="page-5"
      className="section relative flex min-h-screen flex-col bg-black px-6 pt-[14vh] pb-8"
    >
      {/* ---- Central brand identity anchor ---- */}
      <Reveal className="flex flex-col items-center text-center">
        <h2 className="font-serif text-4xl font-medium uppercase tracking-[0.25em] shift-contrast md:text-6xl">
          Bare Esthetics
        </h2>
        <p className="mt-4 text-xs uppercase tracking-[0.35em] text-zinc-500">
          Paramedical &amp; Clinical Aesthetics
        </p>
      </Reveal>

      {/* ---- 3-column logistics matrix ---- */}
      <div className="container mx-auto mt-auto w-full max-w-5xl px-6 pb-16 md:px-12">
        <Reveal delay={150}>
          <div className="grid grid-cols-1 gap-10 text-center text-xs uppercase tracking-wide text-[#808080] md:grid-cols-3 md:text-left">
            <div>
              <h3 className="mb-3 text-xs font-medium text-zinc-400">
                Clinic Hours
              </h3>
              <p className="leading-loose">Sun – Thu: 10:00 AM – 9:00 PM</p>
              <p className="leading-loose">Fri: 10:00 AM – 3:00 PM</p>
              <p className="leading-loose">Sat: Closed</p>
            </div>
            <div>
              <h3 className="mb-3 text-xs font-medium text-zinc-400">
                The Studio
              </h3>
              <p className="leading-loose">
                105-09 Metropolitan Avenue,
                <br />
                Forest Hills, Queens, NY
              </p>
              <p className="leading-loose">Tel: (718) 674-4863</p>
              <p className="leading-loose">info@bareesthetics.com</p>
            </div>
            <div>
              <h3 className="mb-3 text-xs font-medium text-zinc-400">
                Connect
              </h3>
              <a
                href="https://www.instagram.com/bareesthetics_newyork"
                target="_blank"
                rel="noreferrer"
                className="block leading-loose transition-opacity duration-500 hover:text-ivory"
              >
                Instagram (@bareesthetics_newyork)
              </a>
              <a
                href="https://www.yelp.com/search?find_desc=Bare+Esthetics&find_loc=Forest+Hills%2C+Queens%2C+NY"
                target="_blank"
                rel="noreferrer"
                className="block leading-loose transition-opacity duration-500 hover:text-ivory"
              >
                Yelp Directory
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ---- Fine print (absolute bottom termination) ---- */}
      <p className="text-center text-[10px] uppercase tracking-[0.35em] text-zinc-600">
        © 2026 Bare Esthetics New York. All Rights Reserved.
      </p>
    </section>
  )
}
