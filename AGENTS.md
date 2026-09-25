# Base44 Dev Environment — Bare Esthetics (medspa-snap-layout)

## Project Overview
A 5-layer, 100vh snap-scrolling medspa site ("Bare Esthetics") built with **React 18 + Vite 6 + Tailwind CSS v4**, served by a live-reload dev server on port 3000. The original Webflow export (`webflow_scroll_snap.webflow.io/`) remains in the repo as the snap-mechanics template reference: its `.fullpage-wrapper` / `.section` class system is mirrored in `src/index.css`. On fine-pointer devices, `src/hooks/useSmoothSnap.js` takes over the glide with an extra-long ease-in-out curve (~1.6s) and intercepts wheel/keys/anchors; touch devices keep native momentum with `scroll-snap-type: y proximity`. Text is champagne-free (grays + high-contrast whites only); headings use the `.shift-contrast` grayscale→ivory fade driven by the `.section.is-active` observer.

## Architecture
- `src/pages/Hero.jsx` — Page 1: aspect-locked portrait frame + invisible 9-track hover grid REGISTERED to the portrait's measured ripple geometry (hovered slice expands to ~full zone width; audio mutes during expansion, unmutes at transitionend, kills on leave). **Desktop only (lg+ AND fine pointer).** Below `lg`, a full-bleed portrait carries 9 narrow tracks projected onto the same measured ripple lines; each track loops its media muted inside the narrow line and, on tap, stretches fluidly to the full viewport width while its audio fades up. Tapping the stretched layer or the translucent ✕ collapses it and kills the audio instantly.
- `src/hooks/useRippleGeometry.js` — projects the 9 measured ripple boundaries from IMAGE space into on-screen percentages using the browser's own `object-fit: cover` maths (scale / offset from `object-position`). This is what keeps the mobile tracks glued to the visual ripple lines at any viewport size. Re-measures on `ResizeObserver` and image load.
- `src/pages/Services.jsx` — Page 2. **Desktop (lg+)**: strict 50/50 split — philosophy LEFT, angled 5-card cascading deck RIGHT (tilted tray at rest, explodes into a 3+2 grid on container hover; click front card / Next → to shuffle). **Mobile & tablet (< lg)**: two independent full-screen 100dvh snap layers — 2A the About text, 2B the card deck — each wrapped in the shared `MOBILE_LAYER` envelope. Tapping the deck rotates the whole card array (`[...cards.slice(1), cards[0]]`); the front card sweeps out in 3D and slides back to the bottom of the pile while the other 4 step forward. Deck titles are hardcoded to the live Square directory names.
- `src/pages/Testimonials.jsx` — Page 3: glassmorphic auto-rotating review slider + intake form (success state on submit).
- `src/pages/Booking.jsx` — Page 4: glassmorphic Square Appointments iframe scheduling portal.
- `src/pages/Footer.jsx` — Page 5: brand anchor + 3-column logistics matrix.
- `src/config/links.js` — `SQUARE_BOOKING_URL` + treatment copy (single source of truth for the booking journey).
- `public/hero-ripple.png` — user-supplied portrait, used as-is (do not alter).

## Ripple grid geometry (do not "fix")
The 9 interaction tracks are aligned to the actual ripple divisions measured by pixel analysis of the portrait (boundaries at 0.413…0.606 of image width; ~38px pitch; zone left:41.31% / width:19.29% of the aspect-locked frame). They are intentionally NOT nine equal 11.11% columns. See the header comment in `src/pages/Hero.jsx` and `RIPPLE_BOUNDARIES` in `src/hooks/useRippleGeometry.js`. The mobile projection keeps these SAME boundaries — never replace them with equal viewport columns.

## Mobile breakpoint
`lg` (1024px) is the desktop boundary, matching `canHover()` in Hero/Services. Everything below `lg` is mobile/tablet and must not disturb desktop layout, the hover grid, or the exploding deck.

## How to Run
```
docker compose -f docker-compose.base44.yml up -d
```
Vite dev server (HMR + polling for bind mounts) on port 3000. First boot runs `npm install` inside the container (~1 min).

## How to Verify
- `curl -s http://localhost:3000 | grep Beyond` returns the hero markup
- All 5 `.section` layers snap on scroll; hero typography fades 1→0 with scroll progress toward page 2
- Desktop (lg+, fine pointer): hover slice 5–8 on the hero → video plays muted, track widens ×3; click deck front card on page 2 → shuffle to next treatment
- Mobile/tablet (< lg): hero shows 9 narrow tracks sitting on the portrait's ripple lines (not equal viewport columns); tap one → it stretches to full width with audio up; ✕ collapses it. Page 2 scrolls through two full-screen layers (About, then deck); tapping the deck rotates all 5 cards and the front card sweeps out and returns to the bottom.

## Notes
- No external credentials/secrets needed. Fonts (Playfair Display + Montserrat) load from Google Fonts; grid media from a public Supabase bucket.
- The old fullscreen `PortalOverlay` slice viewer was replaced by the mobile tap-to-stretch track and removed.
- Cal.com/Square links are the single source of truth in `src/config/links.js`.
