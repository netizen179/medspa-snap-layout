# Base44 Dev Environment — Bare Esthetics (medspa-snap-layout)

## Project Overview
A 4-layer, 100vh snap-scrolling medspa site ("Bare Esthetics") built with **React 18 + Vite 6 + Tailwind CSS v4**, served by a live-reload dev server on port 3000. The original Webflow export (`webflow_scroll_snap.webflow.io/`) remains in the repo as the snap-mechanics template reference: its `.fullpage-wrapper` / `.section` class system is mirrored in `src/index.css`. On fine-pointer devices, `src/hooks/useSmoothSnap.js` takes over the glide with an extra-long ease-in-out curve (~1.6s) and intercepts wheel/keys/anchors; touch devices keep native momentum with `scroll-snap-type: y proximity`. Text is champagne-free (grays + high-contrast whites only); headings use the `.shift-contrast` grayscale→ivory fade driven by the `.section.is-active` observer.

## Architecture
- `src/pages/Hero.jsx` — Page 1: aspect-locked portrait frame + invisible 9-track hover grid REGISTERED to the portrait's measured ripple geometry (hovered slice expands to ~full zone width; audio mutes during expansion, unmutes at transitionend, kills on leave). **Desktop only (lg+ AND fine pointer).** Below `lg` the page renders `<MobileRippleHero />`. The CTA column carries a click-to-call `tel:` phone link under the booking button, and the **"Project by Kimani"** credit that eases in after load, holds 3s and dissolves permanently (until a reload).
- `src/components/MobileRippleHero.jsx` — the mobile/tablet ripple engine. The 9 tracks are transparent/colourless/borderless by default (only the monochrome portrait shows). **One-time intro** (single `useEffect` keyed on `geometry.length`, so it runs once per page load): the first left slice extends right for 4s, retracts, and the instant it snaps back a water-ripple lighting flash cascades across all 9 ripples L→R (`flashIndex` drives a `bg-white` overlay inside each track). Phases: `idle → first → retract → flash → ready`. **Manual tap pipeline (armed at `phase === 'ready'`):** Column 1 = width extension only, no overlay; Columns 2–9 = STEP 1 stretch to the right edge (silent, 700ms), then STEP 2 fade-zoom the asset out to a full-screen box (`left:0; width:100%`, `.fade-zoom-in`) and flip the video to full volume instantly. Reversal runs on a thumb tap **anywhere on the expanded media surface** (or the canvas behind it): `.fade-zoom-out`, the track collapses into its original groove and the audio is killed immediately. There is deliberately **no ✕ overlay control**, so the exit gesture never clashes with the global persistent CONTACT navigation anchors. Scrolling off Page 1 hard-kills all audio.
- `src/components/Typewriter.jsx` — mechanical letter-by-letter reveal used for the 2B "TAP TO SHUFFLE SERVICES" directive; `active` starts/stops the print and resets it so a snap re-entry re-runs the full animation.
- `src/hooks/useRippleGeometry.js` — projects the 9 measured ripple boundaries from IMAGE space into on-screen percentages using the browser's own `object-fit: cover` maths. Re-measures on `ResizeObserver` and image load. NOTE: it returns early when the wrapper is not measurable (e.g. `display:none` on desktop) and **keeps the last geometry**, so `geometry.length` does not drop to 0 on a desktop resize.
- `src/pages/Services.jsx` — Page 2. **Desktop (lg+)**: strict 50/50 split — philosophy LEFT, angled 5-card cascading deck RIGHT (tilted tray at rest, explodes into a 3+2 grid on container hover). Desktop layout, `.deck-zone` vars and the hover grid are deliberately untouched by the compact work. **Mobile & tablet (< lg)**: two independent full-screen 100dvh snap layers — `#page-2` (2A, About) and `#page-2b` (2B, deck), both using the shared `LAYER_BASE` envelope. 2B centres the deck on both axes with `flex items-center justify-center h-full`. **Compact zoom-loop:** the first deck tap scales the front card to Max Zoom (`scale(1.12)`, strictly inside the layer — never full-screen) while the 4 cards behind fan out in strict rotation order (rotateZ −6 / +6 / −3 / +3) and their **whole typography layer** (copy + CTA) drops to exactly 5% on the same 700ms curve the scale uses, so both settle together; the front card's copy stays at 100%. After 3s of stillness the zoomed card breathes — tilting one way, then back every 3s on a rolling loop, restarted by any interaction. A second tap scales it back down, slides it to the absolute back of the pile and zooms the next card (1→2→3→4→5→1). The deck rests with background copy at 0% (**zero-overlap rule**). Only the **front** card's **BOOK NOW** is a live Square link — on compact the cards behind carry an inert CTA `<span>`. The `TAP TO SHUFFLE SERVICES` directive (Montserrat, `text-xs`) typewrites at the bottom of the workspace on every 2B snap entry, just above the Next control. Desktop keeps its plain shuffle (`advance(false)`).
- `src/components/BookNowButton.jsx` — floating action. Desktop anchors to `#page-2`; compact redirects to `#page-2b` and **must call `e.stopPropagation()`**, otherwise `useSmoothSnap`'s document-level `a[href^="#page-"]` interceptor hijacks it back to the top of 2A.
- `src/pages/Testimonials.jsx` — Page 3: glassmorphic auto-rotating review slider + intake form (success state on submit). The intake card carries a click-to-call `tel:` link under the submit button.
- `src/pages/Footer.jsx` — Page 5: brand anchor + 3-column logistics matrix. (Page 4 — the standalone Square iframe portal — was removed globally; Page 3 glides straight into Page 5.)
- `src/config/links.js` — `SQUARE_BOOKING_URL`, `PHONE_DISPLAY` / `PHONE_TEL` (business line, single source for every `tel:` hook) and treatment copy.
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
- Exactly 4 `.section` layers (`page-1`, `page-2`, `page-3`, `page-5`) snap on scroll; there is no `#page-4` in the DOM
- Desktop (lg+, fine pointer): hover slice 5–8 on the hero → video plays muted, track widens ×3; hover the deck → it explodes into the 3+2 grid with all card copy visible
- Mobile/tablet (< lg): on load the first slice slides out 4s and retracts, then a lighting flash cascades across all 9 ripples L→R (once per load); tapping Column 1 stretches it right with no overlay; tapping Columns 2–9 stretches then fade-zooms to a full-screen box with audio at full volume; a thumb tap on the expanded media surface reverses it and kills audio (there is no ✕ control)
- Mobile/tablet Page 2: two full-screen layers; the deck is centred on both axes; `TAP TO SHUFFLE SERVICES` typewrites on 2B entry; the first tap zooms the front card (the 4 cards behind fan out and their copy fades to 5%), a second tap shuffles it to the back and zooms the next; only the front card's BOOK NOW opens Square in a new tab
- `a[href^="tel:+17186744863"]` exists on Page 1 (hero CTA) and Page 3 (intake card); "Project by Kimani" fades in then out on Page 1

## Notes
- No external credentials/secrets needed. Fonts (Playfair Display + Montserrat) load from Google Fonts; grid media from a public Supabase bucket. That bucket occasionally fails to load individual clips in the sandbox — the console shows `Failed to load video …` for those; it is an external-asset issue, not app logic.
- The old fullscreen `PortalOverlay` slice viewer was replaced by the mobile ripple engine and removed.
- Square links are the single source of truth in `src/config/links.js`.
