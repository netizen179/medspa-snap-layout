# Base44 Dev Environment — Bare Esthetics (medspa-snap-layout)

## Project Overview
A 4-layer, 100vh snap-scrolling medspa site ("Bare Esthetics") built with **React 18 + Vite 6 + Tailwind CSS v4**, served by a live-reload dev server on port 3000. The original Webflow export (`webflow_scroll_snap.webflow.io/`) remains in the repo as the snap-mechanics template reference: its `.fullpage-wrapper` / `.section` class system is mirrored in `src/index.css`. On fine-pointer devices, `src/hooks/useSmoothSnap.js` takes over the glide with an extra-long ease-in-out curve (~1.6s) and intercepts wheel/keys/anchors; touch devices keep native momentum with `scroll-snap-type: y proximity`. Text is champagne-free (grays + high-contrast whites only); headings use the `.shift-contrast` grayscale→ivory fade driven by the `.section.is-active` observer.

## Architecture
- `src/pages/Hero.jsx` — Page 1: aspect-locked portrait frame + invisible 9-track hover grid REGISTERED to the portrait's measured ripple geometry (hovered slice expands to ~full zone width; audio mutes during expansion, unmutes at transitionend, kills on leave). **Desktop only (lg+ AND fine pointer).** Below `lg` the page renders `<MobileRippleHero />`. Its "Book Appointment" CTA is a direct Square handoff (new tab).
- `src/components/MobileRippleHero.jsx` — the mobile/tablet ripple engine. The 9 tracks are completely transparent/colourless/borderless by default (only the monochrome portrait shows). **One-time intro Media Wave:** as soon as the measured geometry is ready, all 9 slices stretch right in sequence, stacking over each other (silent video playback) until the last slice is revealed; the fully expanded wave holds on absolute mute for 3s, then every track pulls back one by one into its groove. Driven by a `phase` state machine (`idle → wave → hold → retract → ready`) inside a single `useEffect` keyed on `geometry.length`, so it runs exactly once per page load (a full refresh is the only way to replay it). **Manual overrides (armed only once `phase === 'ready'`):** a tap stretches that slice open and fades its audio up; videos stay until the clip ends or ✕, images auto-collapse after 3s; ✕ or a background-canvas tap collapses instantly; scrolling off Page 1 hard-kills all media audio.
- `src/hooks/useRippleGeometry.js` — projects the 9 measured ripple boundaries from IMAGE space into on-screen percentages using the browser's own `object-fit: cover` maths (scale / offset from `object-position`). This is what keeps the mobile tracks glued to the visual ripple lines at any viewport size. Re-measures on `ResizeObserver` and image load.
- `src/pages/Services.jsx` — Page 2. **Desktop (lg+)**: strict 50/50 split — philosophy LEFT, angled 5-card cascading deck RIGHT (tilted tray at rest, explodes into a 3+2 grid on container hover). **Mobile & tablet (< lg)**: two independent full-screen 100dvh snap layers — `#page-2` (2A, About) and `#page-2b` (2B, deck), both using the shared `LAYER_BASE` envelope. 2B centres the deck in the dead centre of the viewport via `flex h-full w-full items-center justify-center`; the "Next" trigger is absolutely pinned to the bottom so it never pulls the deck off-centre. Landing on 2B flashes a "CHOOSE YOUR SERVICE" typography banner for 1.5s. **Universal shuffle loop (desktop & mobile):** tapping/clicking the deck area (or any card) rotates the array one slot — the front card sweeps right, drops its layer index and lands at the absolute back while the other four step forward (1→2→3→4→5→1). Only the front card's **BOOK NOW** button leaves the site: it opens that service's Square checkout in a fresh browser tab. Deck titles are hardcoded to the live Square directory names.
- `src/components/BookNowButton.jsx` — floating action. Desktop anchors to `#page-2` (let `useSmoothSnap` glide); compact redirects to `#page-2b` and **must call `e.stopPropagation()`**, otherwise `useSmoothSnap`'s document-level `a[href^="#page-"]` interceptor hijacks it back to the top of 2A.
- `src/pages/Testimonials.jsx` — Page 3: glassmorphic auto-rotating review slider + intake form (success state on submit).
- `src/pages/Footer.jsx` — Page 5: brand anchor + 3-column logistics matrix. (Page 4 — the standalone Square iframe portal — was removed globally; Page 3 now glides straight into Page 5.)
- `src/config/links.js` — `SQUARE_BOOKING_URL` + treatment copy (single source of truth for the booking journey).
- `public/hero-ripple.png` — user-supplied portrait, used as-is (do not alter).

## Ripple grid geometry (do not "fix")
The 9 interaction tracks are aligned to the actual ripple divisions measured by pixel analysis of the portrait (boundaries at 0.413…0.606 of image width; ~38px pitch; zone left:41.31% / width:19.29% of the aspect-locked frame). They are intentionally NOT nine equal 11.11% columns. See the header comment in `src/pages/Hero.jsx` and `RIPPLE_BOUNDARIES` in `src/hooks/useRippleGeometry.js`. The mobile projection keeps these SAME boundaries — never replace them with equal viewport columns.

## Deck centering gotcha
The cards are anchored to a zero-size point at the zone centre. A wrapper with `-translate-x-1/2` inside a **zero-width** parent resolves the percentage against its own (0) width — a no-op — so the compact deck must carry `w-fit` on that wrapper or every card sits half a card-width right of centre. The `w-fit` is applied on compact only, leaving the desktop deck untouched.

## Mobile breakpoint
`lg` (1024px) is the desktop boundary, matching `canHover()` in Hero/Services. Everything below `lg` is mobile/tablet and must not disturb desktop layout, the hover grid, or the exploding deck.

## Viewport envelope
Full-screen mobile layers use the dynamic envelope `h-screen min-h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-center`. Do NOT apply `max-h-[100dvh] overflow-hidden` to Pages 3/5 — their content (intake form) is taller than one viewport and would be clipped; those use `min-h-[100dvh]` only.

## How to Run
```
docker compose -f docker-compose.base44.yml up -d
```
Vite dev server (HMR + polling for bind mounts) on port 3000. First boot runs `npm install` inside the container (~1 min).

## How to Verify
- `curl -s http://localhost:3000 | grep Beyond` returns the hero markup
- Exactly 4 `.section` layers (`page-1`, `page-2`, `page-3`, `page-5`) snap on scroll; there is no `#page-4` in the DOM; hero typography fades 1→0 with scroll progress toward page 2
- Desktop (lg+, fine pointer): hover slice 5–8 on the hero → video plays muted, track widens ×3; hover the deck → it explodes into the 3+2 grid; clicking the deck rotates the pile
- Mobile/tablet (< lg): hero tracks are invisible at rest; on load the 9 slices cascade open into the one-time Media Wave, hold ~3s muted, then retract one by one (only once per page load); after that, tapping a slice expands it with audio; ✕ collapses; scrolling to Page 3 kills all audio
- Mobile/tablet Page 2: two full-screen layers; Book Now lands exactly on `#page-2b`; the "CHOOSE YOUR SERVICE" banner flashes; the deck is centred on both axes; tapping the deck rotates the cards; the front card's BOOK NOW opens Square in a new tab

## Notes
- No external credentials/secrets needed. Fonts (Playfair Display + Montserrat) load from Google Fonts; grid media from a public Supabase bucket. That bucket occasionally fails to load individual clips in the sandbox — the console shows `Failed to load video …` for those; it is an external-asset issue, not app logic.
- The old fullscreen `PortalOverlay` slice viewer was replaced by the mobile ripple engine and removed.
- Square links are the single source of truth in `src/config/links.js`.
