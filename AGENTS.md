# Base44 Dev Environment — Bare Esthetics (medspa-snap-layout)

## Project Overview
A 5-layer, 100vh snap-scrolling medspa site ("Bare Esthetics") built with **React 18 + Vite 6 + Tailwind CSS v4**, served by a live-reload dev server on port 3000. The original Webflow export (`webflow_scroll_snap.webflow.io/`) remains in the repo as the snap-mechanics template reference: its `.fullpage-wrapper` / `.section` class system is mirrored in `src/index.css`. On fine-pointer devices, `src/hooks/useSmoothSnap.js` takes over the glide with an extra-long ease-in-out curve (~1.6s) and intercepts wheel/keys/anchors; touch devices keep native momentum with `scroll-snap-type: y proximity`. Text is champagne-free (grays + high-contrast whites only); headings use the `.shift-contrast` grayscale→ivory fade driven by the `.section.is-active` observer.

## Architecture
- `src/pages/Hero.jsx` — Page 1: aspect-locked portrait frame + invisible 9-track hover grid REGISTERED to the portrait's measured ripple geometry (hovered slice expands to ~full zone width; audio mutes during expansion, unmutes at transitionend, kills on leave); mobile accordion fallback below `md`.
- `src/pages/Services.jsx` — Page 2: strict 50/50 split — philosophy LEFT, angled 5-card cascading deck RIGHT (tilted tray at rest, explodes into a 3+2 grid on container hover; click front card / Next → to shuffle). Deck intentionally shows 5 of the 7 treatments in `src/config/links.js`.
- `src/pages/Testimonials.jsx` — Page 3: glassmorphic auto-rotating review slider + intake form (success state on submit).
- `src/pages/Booking.jsx` — Page 4: glassmorphic Cal.com iframe scheduling portal.
- `src/pages/Footer.jsx` — Page 5: brand anchor + 3-column logistics matrix.
- `src/config/links.js` — ALL Cal.com URLs (single source of truth; placeholder handle `bare-esthetics` — swap for the live handle when published).
- `public/hero-ripple.png` — user-supplied portrait, used as-is (do not alter).

## Ripple grid geometry (do not "fix")
The 9 interaction tracks are aligned to the actual ripple divisions measured by pixel analysis of the portrait (boundaries at 0.413…0.606 of image width; ~38px pitch; zone left:41.31% / width:19.29% of the aspect-locked frame). They are intentionally NOT nine equal 11.11% columns. See the header comment in `src/pages/Hero.jsx`.

## How to Run
```
docker compose -f docker-compose.base44.yml up -d
```
Vite dev server (HMR + polling for bind mounts) on port 3000. First boot runs `npm install` inside the container (~1 min).

## How to Verify
- `curl -s http://localhost:3000 | grep Beyond` returns the hero markup
- All 5 `.section` layers snap on scroll; hero typography fades 1→0 with scroll progress toward page 2
- Hover slice 5–8 on the hero → video plays muted, track widens ×3
- Click deck front card on page 2 → shuffle to next treatment

## Notes
- No external credentials/secrets needed. Fonts (Playfair Display + Montserrat) load from Google Fonts; grid media from a public Supabase bucket.
- Cal.com handle and links are placeholders pending the real directories.
