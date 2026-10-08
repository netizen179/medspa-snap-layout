# Base44 Development Setup

## Project Overview
Vite + React 18 + TypeScript + Tailwind CSS medspa landing page ("Bare Esthetics").
Single-page app with scroll-snap sections (Hero, Services, Testimonials, Booking, Footer).

## Dev Environment
- `docker-compose.base44.yml` runs the app from a `node:22-slim` container with the repo bind-mounted at `/app`.
- Dependencies install on container startup via `npm install` (no lockfile freeze — package-lock.json is used).
- Vite dev server binds `0.0.0.0:3000` with `--strictPort`.
- `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed through for Vite host allowlisting.
- Healthcheck probes `http://localhost:3000/` via Node `fetch`.

## Build
- `npm run build` runs `tsc -b && vite build` — both pass cleanly.
- No external secrets required to boot.

## Verification
- `curl http://localhost:3000/` should return 200 with Vite dev HTML (contains `@react-refresh` and `@vite/client`).
- `npm run build` should complete without errors.
- Preview iframe may show stale content from a previous session; restart the container and reload the preview if the DOM doesn't match source.
