export function FooterPage() {
  return (
    <section id="footer" className="snap-section bg-black">
      <div className="flex flex-col h-full">
        {/* Central brand identity */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <h2 className="font-serif text-4xl md:text-6xl text-ivory font-light tracking-[0.25em] uppercase text-center">
            Bare Esthetics
          </h2>
          <p className="text-xs tracking-widest text-zinc-500 mt-4 uppercase font-sans">
            Paramedical & Clinical Aesthetics
          </p>
        </div>

        {/* 3-column logistics matrix */}
        <div className="container mx-auto px-6 md:px-12 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Column 1: Hours */}
            <div>
              <h3 className="text-zinc-400 font-medium mb-3 text-xs uppercase tracking-wide font-sans">
                Clinic Hours
              </h3>
              <div className="space-y-2 text-xs uppercase tracking-wide text-zinc-600 font-sans">
                <p>Sun - Thu: 10:00 AM – 9:00 PM</p>
                <p>Fri: 10:00 AM – 3:00 PM</p>
                <p>Sat: Closed</p>
              </div>
            </div>

            {/* Column 2: Location */}
            <div>
              <h3 className="text-zinc-400 font-medium mb-3 text-xs uppercase tracking-wide font-sans">
                The Studio
              </h3>
              <div className="space-y-2 text-xs uppercase tracking-wide text-zinc-600 font-sans">
                <p>105-09 Metropolitan Avenue, Forest Hills, Queens, NY</p>
                <p>Tel: (718) 674-4863</p>
                <p>Info@bareesthetics.com</p>
              </div>
            </div>

            {/* Column 3: Connect */}
            <div>
              <h3 className="text-zinc-400 font-medium mb-3 text-xs uppercase tracking-wide font-sans">
                Connect
              </h3>
              <div className="space-y-2 text-xs uppercase tracking-wide font-sans">
                <a
                  href="https://instagram.com/bareesthetics_newyork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-zinc-600 hover:text-ivory transition-opacity duration-500"
                >
                  Instagram (@bareesthetics_newyork)
                </a>
                <a
                  href="https://yelp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-zinc-600 hover:text-ivory transition-opacity duration-500"
                >
                  Yelp Directory
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Fine print */}
        <div className="text-center pb-6">
          <p className="text-[10px] text-zinc-600 tracking-widest font-sans">
            © 2026 Bare Esthetics New York. All Rights Reserved.
          </p>
        </div>
      </div>
    </section>
  )
}
