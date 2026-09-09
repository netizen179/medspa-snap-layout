# Base44 Dev Environment

## Project Overview
This is a **Webflow static site export** — a scroll-snap landing page ("Simple Snap Scroll with FullPage.js"). There is no build step, no backend, and no package manager. It is pure static HTML/CSS/JS served by nginx.

## Architecture
- **Static files** live in `webflow_scroll_snap.webflow.io/`
- **nginx:alpine** serves them on port 3000 (mapped to container port 80)
- The `index.html` at the root of that directory was reconstructed from the live Webflow site (the original export only had a placeholder). All asset paths are relative so they resolve correctly under nginx.

## Key Files
- `webflow_scroll_snap.webflow.io/index.html` — the main page (reconstructed)
- `webflow_scroll_snap.webflow.io/uploads-ssl.webflow.com/...` — Webflow-generated CSS, JS, and fullPage.js
- `webflow_scroll_snap.webflow.io/d3e54v103j8qbb.cloudfront.net/...` — jQuery
- `webflow_scroll_snap.webflow.io/ajax.googleapis.com/...` — WebFont.js
- `webflow_scroll_snap.webflow.io/fonts.googleapis.com/css.css` — Google Fonts CSS (Inter)
- Fonts load from Google's CDN at runtime (sandbox has internet access)

## How to Run
```
docker compose -f docker-compose.base44.yml up -d
```
Then visit port 3000.

## How to Verify
- `curl -s http://localhost:3000 | head -5` should return the HTML doctype
- The page should show "very simple scroll snap" text with scroll-snap sections

## Notes
- No external credentials or secrets are needed.
- No database, no backend, no build step.
- The site uses fullPage.js (pure JS version) for scroll snapping with 4 sections.
- A "mobile-block" overlay shows "we need a bigger screen here" on small viewports.
