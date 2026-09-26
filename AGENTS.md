# Base44 Dev Environment — Bare Esthetics (medspa-snap-layout)

## Project Overview
A 5-layer, 100vh snap-scrolling medspa site ("Bare Esthetics") built with **React 18 + Vite 6 + Tailwind CSS v4**, served by a live-reload dev server on port 3000. The original Webflow export (`webflow_scroll_snap.webflow.io/`) remains in the repo as the snap-mechanics template reference: its `.fullpage-wrapper` / `.section` class system is mirrored in `src/index.css`. On fine-pointer devices, `src/hooks/useSmoothSnap.js` takes over the glide with an extra-long ease-in-out curve (~1.6s) and intercepts wheel/keys/anchors; touch devices keep native momentum with `scroll-snap-type: y proximity`. Text is champagne-free (grays + high-contrast whites only); headings use the `.shift-contrast` grayscale→ivory fade driven by the `.section.is-active` observer.

## Architecture
- `src/pages/Hero.jsx` — Page 1: aspect-locked portrait frame + invisible 9-track hover grid REGISTERED to the portrait's measured ripple geometry (hovered slice expands to ~full zone width; audio mutes during expansion, unmutes at transitionend, kills on leave). **Desktop only (lg+ AND fine pointer).** Below `lg` the page renders `<MobileRippleHero />`.
- `src/components/MobileRippleHero.jsx` — the mobile/tablet ripple engine. The 9 tracks are completely transparent/colourless/borderless by default (only the monochrome portrait shows). **Rolling inactivity slide engine:** while the visitor stays on Page 1, each video slice unrolls to the right (left edge pinned, right edge unfolding) with audio fading up, holds 3s, collapses, and the next slice takes over — a continuous loop. **Manual overrides:** a tap halts the loop and expands that slice (videos stay until the clip ends or ✕; images auto-collapse after 3s); ✕ or a background-canvas tap collapses instantly and resumes the engine; scrolling off Page 1 hard-kills all media audio.
- `src/hooks/useRippleGeometry.js` — projects the 9 measured ripple boundaries from IMAGE space into on-screen percentages using the browser's own `object-fit: cover` maths (scale / offset from `object-position`). This is what keeps the mobile tracks glued to the visual ripple lines at any viewport size. Re-measures on `ResizeObserver` and image load.
- `src/pages/Services.jsx` — Page 2. **Desktop (lg+)**: strict 50/50 split — philosophy LEFT, angled 5-card cascading deck RIGHT (tilted tray at rest, explodes into a 3+2 grid on container hover; Next → shuffles). **Mobile & tablet (< lg)**: two independent full-screen 100dvh snap layers — `#page-2` (2A, About) and `#page-2b` (2B, deck), both using the shared `LAYER_BASE` envelope. 2B drops the outer padding and centres the deck dead-centre of the viewport. Landing on 2B flashes a "CHOOSE YOUR SERVICE" typography banner for 1.5s. **Selecting any card opens that service's Square checkout in a new tab** (Page 4 is bypassed for this flow). Deck titles are hardcoded to the live Square directory names.
- `src/components/BookNowButton.jsx` — floating action. Desktop anchors to `#page-2` (let `useSmoothSnap` glide); compact redirects to `#page-2b` and **must call `e.stopPropagation()`**, otherwise `useSmoothSnap`'s document-level `a[href^="#page-"]` interceptor hijacks it back to the top of 2A.
- `src/pages/Testimonials.jsx` — Page 3: glassmorphic auto-rotating review slider + intake form (success state on submit).
- `src/pages/Booking.jsx` — Page 4: glassmorphic Square Appointments iframe portal. Still in the snap stack, but the card/Book Now flow no longer routes here.
- `src/pages/Footer.jsx` — Page 5: brand anchor + 3-column logistics matrix.
- `src/config/links.js` — `SQUARE_BOOKING_URL` + treatment copy (single source of truth for the booking journey).
- `public/hero-ripple.png` — user-supplied portrait, used as-is (do not alter).

## Ripple grid geometry (do not "fix")
The 9 interaction tracks are aligned to the actual ripple divisions measured by pixel analysis of the portrait (boundaries at 0.413…0.606 of image width; ~38px pitch; zone left:41.31% / width:19.29% of the aspect-locked frame). They are intentionally NOT nine equal 11.11% columns. See the header comment in `src/pages/Hero.jsx` and `RIPPLE_BOUNDARIES` in `src/hooks/useRippleGeometry.js`. The mobile projection keeps these SAME boundaries — never replace them with equal viewport columns.

## Mobile breakpoint
`lg` (1024px) is the desktop boundary, matching `canHover()` in Hero/Services. Everything below `lg` is mobile/tablet and must not disturb desktop layout, the hover grid, or the exploding deck.

## Viewport envelope
Full-screen mobile layers use the dynamic envelope `h-screen min-h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-center`. Do NOT apply `max-h-[100dvh] overflow-hidden` to Pages 3/4/5 — their content (intake form, booking iframe) is taller than one viewport and would be clipped; those use `min-h-[100dvh]` only.

## How to Run
```
docker compose -f docker-compose.base44.yml up -d
```
Vite dev server (HMR + polling for bind mounts) on port 3000. First boot runs `npm install` inside the container (~1 min).

## How to Verify
- `curl -s http://localhost:3000 | grep Beyond` returns the hero markup
- All 5 `.section` layers snap on scroll; hero typography fades 1→0 with scroll progress toward page 2
- Desktop (lg+, fine pointer): hover slice 5–8 on the hero → video plays muted, track widens ×3; hover the deck → it explodes into the 3+2 grid; Next → shuffles
- Mobile/tablet (< lg): hero tracks are invisible at rest; after ~1.4s the first video slice unrolls right with audio; tapping a slice halts the loop and expands it; ✕ collapses and resumes the loop; scrolling to Page 3 kills all audio
- Mobile/tablet Page 2: two full-screen layers; Book Now lands exactly on `#page-2b`; the "CHOOSE YOUR SERVICE" banner flashes; the deck is centred at viewport centre; selecting a card opens Square in a new tab

## Notes
- No external credentials/secrets needed. Fonts (Playfair Display + Montserrat) load from Google Fonts; grid media from a public Supabase bucket. That bucket occasionally fails to load individual clips in the sandbox — the console shows `Failed to load video …` for those; it is an external-asset issue, not app logic.
- The old fullscreen `PortalOverlay` slice viewer was replaced by the mobile ripple engine and removed.
- Cal.com/Square links are the single source of truth in `src/config/links.js`.
