# GSAP Practice Project

React (JavaScript) + Vite + Tailwind CSS + GSAP.

## Development

Run npm install followed by npm run dev.
Open the local URL and try Timeline demo (Play, Replay and Progress), then Scroll demo.
Start reading `src/components/BookShowcase.jsx` and its numbered animation comments.
The complete Roman Urdu walkthrough and exercises are in [docs/book-showcase.md](docs/book-showcase.md).

Tailwind uses the Vite plugin and src/index.css.
The fan-to-grid demo uses @gsap/react, a shared timeline, and ScrollTrigger.
It respects reduced-motion preferences. Book covers are labelled CSS samples;
exact Figma artwork and design matching are pending.

## Checks

- npm run lint
- npm run build
- npm run preview

## Documentation

- [Tailwind with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [GSAP with React](https://gsap.com/resources/React/)


## Cambridge Book Publishing homepage

Served at `/camblp` (`src/pages/CambridgeHome.jsx`); `/` is the lab index (`src/pages/LabIndex.jsx`), routed in `src/App.jsx` with react-router-dom. The Figma "Website" frame (1920 wide, ~12,600px tall) is built section by section under `src/components/sections/`. Sizes scale from the comp via `--u` (one design pixel, see `src/index.css`), which also defines the type scale (`t-h2`, `t-body`, ...) and the rounded `panel` utility.

Motion lives in each section (GSAP + ScrollTrigger from `src/lib/gsap.js`; generic reveals via `data-reveal` in `src/lib/useReveal.js`). Highlights: hero intro + pointer parallax, count-up stats, step cards settling onto their tilts, a working 4-step quiz, a scroll-scrubbed book tilt, the pinned gallery morph (fan to grid), pin drops, marquee ribbons, genre wipes, a scroll-tweened testimonial rail and an animated FAQ accordion. Everything respects `prefers-reduced-motion`.

Notes:
- Merculia and Inter Display are commercial; the font stacks list them first so installing Merculia locally picks it up. Otherwise Gabarito, Inter, Lexend, Nunito and Caveat load from Google Fonts.
- Assets live in `src/assets/<section>/`, straight from Figma and unoptimised (~46MB). Downscale the book covers and step illustrations before shipping.
- The rotating book (`BookSpin`) is a video in Figma; a single frame is used here.
- Quiz questions 2-4 and the FAQ answers are placeholder copy; the comp only carries question 1 and the FAQ titles.
