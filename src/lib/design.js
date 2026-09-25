// Everything inside <DesignCanvas> is laid out in Figma's own pixels: the canvas
// is 1920 wide and gets scaled by viewport width, which is exactly what the
// prototype's `scaling=scale-down-width, content-scaling=fixed` does. So a value
// here is the value in the Figma file — no conversion, no guessing.

export const DESIGN_WIDTH = 1920

// clientWidth, not innerWidth: innerWidth counts the scrollbar, which would make
// the canvas a few pixels wider than the space it actually has.
export const canvasScale = () => document.documentElement.clientWidth / DESIGN_WIDTH

// Section boxes, read off the "Website" frames.
export const HERO = { height: 1000 }
export const PROCESS = { height: 1120 }
// The stats block starts 22px before the process section ends.
export const STATS = { height: 407, overlap: 22 }

// Where each section sits on the canvas, in design pixels.
export const SECTIONS = [
  { id: 'hero', top: 0, height: HERO.height },
  { id: 'process', top: HERO.height, height: PROCESS.height },
  // Shorter than a screen, so it rests on the bottom edge rather than the top
  // — the prototype's own framing for this strip.
  {
    id: 'stats',
    top: HERO.height + PROCESS.height - STATS.overlap,
    height: STATS.height,
    align: 'bottom',
  },
]

// A section taller than the screen is scrolled through before the next one is
// reached, in even steps that end with its bottom on the screen edge. Anything
// hidden by less than this is not worth a step of its own.
export const MIN_INNER_STEP = 120
