# Opside Down — website

AI-first growth agency site. Vite + vanilla JS, Three.js hero, GSAP (ScrollTrigger, SplitText), Lenis smooth scroll, self-hosted fonts.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # serve dist/ locally
```

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages). On Vercel: framework preset "Vite", build `npm run build`, output `dist`.

## Files

- `index.html` — all page content/copy
- `src/styles.css` — design system (tokens at the top: crimson / charcoal / paper, Chakra Petch + Inter + JetBrains Mono)
- `src/main.js` — loader, smooth scroll, nav, scroll animations, bento mock animations, FAQ, form
- `src/hero-scene.js` — Three.js hero: dark-room desk setup with live code typing, a terminal log stream, a flickering desk lamp, blinking PC LEDs and a neon logo. The code snippets and file names live in `AGENTS` at the top; terminal lines in `LOGS`.

## Before launch

- **Contact form**: add `data-endpoint="https://formspree.io/f/XXXX"` (or your own API URL) to `<form id="contactForm">`. Without it, the form validates and shows the success state but sends nothing.
- **Email**: replace `hello@opsidedown.com` in `index.html`.
- **Numbers in mockups** ($48.2k, ROAS 4.6×, CTR 3.8%, etc.) are illustrative UI — swap in real client results when you have them.
- Add an `og:image` (1200×630) to `public/` and reference it in the `<head>`.

## Performance notes

- Three.js is code-split and fetched in parallel with fonts while the loader runs.
- The WebGL scene pauses when the hero is off-screen or the tab is hidden. It uses cheap Lambert materials with faked light pools (no shadows or post-processing), redraws the code screens at ~20fps, caps pixel ratio (1.5 desktop / 1.25 touch) and lowers it automatically if frames get slow.
- Avoid `backdrop-filter` or `mask-image` on elements layered over the hero canvas — they force full re-compositing every frame (this was the main cause of the earlier slowness).
- Bento animations only run while their card is on screen.
- `prefers-reduced-motion` disables smooth scroll and heavy motion; no-WebGL devices get a CSS gradient fallback.

## Brand

- Palette (tokens at the top of `src/styles.css`): plum black `#150E13`, steel gray `#ABADB0` and charcoal `#414042` (from the logo), rose `#A06969` (primary accent), rose glow `#D4978E` (accent on dark), deep rose `#6E3A45`, paper `#F3EEEC`.
- `public/bg-gradient.webp` — brand gradient (loader, contact, fit-check card, footer, no-WebGL hero fallback).
- `src/logo-inline.svg` — the logo split into groups (`lg-top`, `lg-down`, `lg-waves`, `lg-dot`) so the "down" row can flip and the sound waves can pulse. Used in the loader, nav, footer and as the neon sign in the 3D scene.
- `public/logo-dark.svg`, `public/logo-light.svg` (+ PNGs) — standalone logo files for dark and light backgrounds.

## AI touches

- **Lumi concierge** (bottom-right orb): scripted mini-chat. Edit the greeting and the `REPLIES` map in `initConcierge()` in `src/main.js`; quick-reply buttons live in `index.html` (`#conciergeQuick`).
- **Hologram** on the desk reacts to the code editor (spins while typing, pulses on save) — see "AI hologram" in `src/hero-scene.js`.
- **Decode labels**, aurora glows, dot-grid field, edge light packets and CTA glow rings are in the "SOFT AI TOUCHES" block of `src/styles.css`. All are disabled for `prefers-reduced-motion`.

## Service pages

Three pitch pages live in `services/` (Creative Sprint, Growth Partnership, Ad Conversations). They are **generated**:

- Edit copy in `scripts/services-data.mjs` (hero, problem, how it works, included, KPIs, best-for, FAQs).
- The nav, footer and Lumi are copied from `index.html` automatically, so change those once on the home page.
- `npm run services` regenerates the pages (it also runs automatically before `npm run dev` and `npm run build`).
- Vite builds every page in `services/` as its own entry (see `vite.config.js`). `vercel.json` turns on clean URLs (`/services/creative-sprint`) and redirects the old service URLs.

## Performance fee calculator

`initCalculator()` in `src/main.js`: bill = `FLAT` (€790) + `SHARE` (5%) × ad revenue above the baseline (spend × 3-month ROAS). If pricing changes, update these constants together with the pricing cards, FAQ and service pages.
