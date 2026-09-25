# GSAP Motion Lab

A playground for learning and practicing web animation with [GSAP](https://gsap.com/) (GreenSock Animation Platform), built with React, Vite, and Tailwind CSS.

## Purpose

This project is a hands-on space to understand how GSAP works, from the core concepts up. Each experiment focuses on one idea, so it's easy to see what a GSAP feature does, how its options change the result, and how to use it correctly inside a React app. It also carries a full build of the Cambridge Book Publishing homepage (see below).

## How GSAP works

GSAP animates values over time. You give it a **target** (a DOM element, a CSS selector, or any JavaScript object) and the **properties** to change, and it updates those values on every frame until the animation finishes.

```js
gsap.to('.box', { x: 200, rotation: 360, duration: 1, ease: 'power2.out' })
```

- A **tween** is a single animation: one target, a set of properties, and a duration.
- A **timeline** is a container that runs several tweens in sequence or in overlap, and can be controlled as a single unit.
- Every tween and timeline returns an object that you can **play, pause, reverse, restart, or scrub** at any time.

## Core concepts to practice

| Concept | What it covers |
|---|---|
| Tweens | `gsap.to()`, `gsap.from()`, `gsap.fromTo()`, and `gsap.set()` |
| Transforms and properties | `x`, `y`, `scale`, `rotation`, `opacity`, colors, and CSS variables |
| Easing | How `power`, `back`, `elastic`, `bounce`, and other eases shape motion |
| Stagger | Offsetting the start of the same animation across many elements |
| Timelines | Sequencing with `gsap.timeline()`, position parameters (`"<"`, `"-=0.5"`), labels, and defaults |
| Playback control | `play()`, `pause()`, `reverse()`, `restart()`, `progress()`, and `timeScale()` |
| Callbacks | `onStart`, `onUpdate`, `onComplete`, and repeat or yoyo behavior |
| Plugins | ScrollTrigger and other GSAP plugins, registered with `gsap.registerPlugin()` |
| Responsive and accessible motion | `gsap.matchMedia()` and respecting `prefers-reduced-motion` |
| GSAP in React | The `useGSAP()` hook, scoped selectors, automatic cleanup, and `contextSafe()` for event handlers |

## Tech stack

- [GSAP](https://gsap.com/) with [`@gsap/react`](https://gsap.com/resources/React/)
- [React 19](https://react.dev/) (JavaScript)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/), set up through the Vite plugin in `src/index.css`
- [oxlint](https://oxc.rs/docs/guide/usage/linter) for linting

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL that Vite prints. Routing lives in `src/App.jsx`. For a guided read of one animation, start with `src/components/BookShowcase.jsx` and its numbered comments; the full walkthrough and exercises (Roman Urdu) are in [docs/book-showcase.md](docs/book-showcase.md).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the project with oxlint |
| `npm run lint:fix` | Lint and automatically fix issues where possible |

## Resources

- [GSAP documentation](https://gsap.com/docs/v3/)
- [GSAP with React](https://gsap.com/resources/React/)
- [GSAP easing visualizer](https://gsap.com/docs/v3/Eases)
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite)

## Cambridge Book Publishing homepage

Served at `/camblp` (`src/pages/CambridgeHome.jsx`); `/` is the lab index (`src/pages/LabIndex.jsx`), routed in `src/App.jsx` with react-router-dom. The Figma "Website" frame (1920 wide, ~12,600px tall) is built section by section under `src/components/sections/`. Sizes scale from the comp via `--u` (one design pixel, see `src/index.css`), which also defines the type scale (`t-h2`, `t-body`, ...) and the rounded `panel` utility.

Motion lives in each section (GSAP + ScrollTrigger from `src/lib/gsap.js`; generic reveals via `data-reveal` in `src/lib/useReveal.js`). Highlights: hero intro + pointer parallax, count-up stats, step cards settling onto their tilts, a working 4-step quiz, a scroll-scrubbed book tilt, the pinned gallery morph (fan to grid), pin drops, marquee ribbons, genre wipes, a scroll-tweened testimonial rail and an animated FAQ accordion. Everything respects `prefers-reduced-motion`.

Notes:
- Merculia and Inter Display are commercial; the font stacks list them first so installing Merculia locally picks it up. Otherwise Gabarito, Inter, Lexend, Nunito and Caveat load from Google Fonts.
- Assets live in `src/assets/<section>/`, straight from Figma and unoptimised (~46MB). Downscale the book covers and step illustrations before shipping.
- The rotating book (`BookSpin`) is a video in Figma; a single frame is used here.
- Quiz questions 2-4 and the FAQ answers are placeholder copy; the comp only carries question 1 and the FAQ titles.

## Scroll-story landing page (unwired)

An alternative build of the first five sections (hero, process, stats, publish form, book showcase) as one pinned, scroll-scrubbed GSAP timeline on a 1440 × 780 canvas: `src/views/LandingPage.jsx` with `src/components/{PublishSection,Icons}.jsx` and the cropped art in `src/assets/images/`. No route renders it today — mount `<LandingPage />` in `src/App.jsx` to see it. Its Tailwind tokens and the `story:` variant are at the bottom of `src/index.css`.
