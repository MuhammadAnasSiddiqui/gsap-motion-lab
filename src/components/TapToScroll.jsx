import React, { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { exitRange } from '../lib/blurOnExit'
import { canvasScale, DESIGN_WIDTH, MIN_INNER_STEP, SECTIONS } from '../lib/design'

gsap.registerPlugin(useGSAP, Observer, ScrollToPlugin, ScrollTrigger)

// Figma advances one frame per tap with a 2.5s smart-animate. That is too slow
// to sit under a mouse wheel, so a step runs at 1.2s here — the scrubbed section
// animations play out over exactly this window.
const STEP_DURATION = 1.2

// The pill, straight from Figma: 44x185 against the right edge, centred down the
// screen, white at 60%, the label reading bottom to top with an arrow below it.
// 24px of padding at each end, 8px between label and arrow.
const PILL = { width: 44, height: 185, radius: 80, padding: 24, gap: 8, label: 107, arrow: 22 }

// The back control: a 60px disc in the logo's slot. There is nothing to go back
// to from the hero, so it only appears once the hero hands over.
const BACK = { size: 60, left: 70, top: 33 }

const TapToScroll = () => {
  const animating = useRef(false)
  // Two ladders: the wheel walks every stop, including the ones inside a tall
  // section, while the buttons jump whole sections at a time.
  const stops = useRef([])
  const sectionStops = useRef([])
  const backRef = useRef(null)

  // Inside the canvas a section is walked through before the next one is
  // reached: its top, then even steps until its bottom sits on the screen edge.
  // Past the canvas the page is ordinary responsive markup, so the stops are
  // simply the tops of the blocks that follow it.
  const measure = useCallback(() => {
    const vh = window.innerHeight
    const max = Math.max(0, document.documentElement.scrollHeight - vh)
    const scale = canvasScale()
    const canvas = document.querySelector('[data-design-canvas]')
    const all = []
    const perSection = []

    if (canvas) {
      const top = canvas.getBoundingClientRect().top + window.scrollY
      const screen = vh / scale // the visible slice of the canvas, in design px
      const at = (designY) => Math.round(top + designY * scale)

      SECTIONS.forEach((section) => {
        const hidden = section.height - screen

        // Bottom aligned: stop early enough that the section's own bottom edge
        // lands on the screen's, leaving the section above it on show.
        if (section.align === 'bottom') {
          const y = at(Math.max(0, section.top + hidden))
          all.push(y)
          perSection.push(y)
          return
        }

        const y = at(section.top)
        all.push(y)
        perSection.push(y)

        if (hidden < MIN_INNER_STEP) return

        const steps = Math.ceil(hidden / screen)
        for (let i = 1; i <= steps; i++) all.push(at(section.top + (hidden * i) / steps))
      })

      // Past the canvas: one stop per block. A block that morphs through more
      // than one state — a pinned gallery, say — sets data-scroll-stops to the
      // number of frames it is worth, and each of those counts as a section.
      let after = canvas.nextElementSibling
      while (after) {
        // A pinned section is wrapped in ScrollTrigger's spacer, so the markup
        // — and the attribute — is one level in, and the spacer's extra height
        // is exactly the distance the pin covers.
        const spacer = after.classList.contains('pin-spacer')
        const block = spacer ? after.firstElementChild : after
        const top = Math.round(after.getBoundingClientRect().top + window.scrollY)
        const span = spacer ? after.offsetHeight - block.offsetHeight : after.offsetHeight - vh
        const frames = Number(block?.dataset.scrollStops) || 1

        if (frames > 1 && span > 0) {
          for (let i = 0; i < frames; i++) {
            const y = Math.round(top + (span * i) / (frames - 1))
            all.push(y)
            perSection.push(y)
          }
        } else {
          all.push(top)
          perSection.push(top)
          // Still walk anything taller than the screen with the wheel.
          if (span >= MIN_INNER_STEP) {
            const steps = Math.ceil(span / vh)
            for (let i = 1; i <= steps; i++) all.push(Math.round(top + (span * i) / steps))
          }
        }

        after = after.nextElementSibling
      }
    } else {
      for (let y = 0; y < max; y += vh) {
        all.push(y)
        perSection.push(y)
      }
    }

    const clean = (list) =>
      [...new Set([...list, max])].filter((y) => y >= 0 && y <= max).sort((a, b) => a - b)

    stops.current = clean(all)
    sectionStops.current = clean(perSection)
  }, [])

  const step = useCallback((direction, ladder = stops) => {
    if (animating.current) return
    const y = window.scrollY
    const next =
      direction > 0
        ? ladder.current.find((s) => s > y + 4)
        : [...ladder.current].reverse().find((s) => s < y - 4)
    if (next == null) return

    animating.current = true
    gsap.to(window, {
      scrollTo: { y: next, autoKill: false },
      duration: STEP_DURATION,
      ease: 'power2.inOut',
      onComplete: () => {
        animating.current = false
      },
    })
  }, [])

  useGSAP(() => {
    // Hijacking the wheel is exactly what reduced-motion users opt out of, so
    // they keep the browser's own scrolling.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    measure()
    ScrollTrigger.addEventListener('refresh', measure)

    Observer.create({
      type: 'wheel,touch',
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      onUp: () => step(1),
      onDown: () => step(-1),
    })

    const onKey = (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        step(1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        step(-1)
      }
    }

    window.addEventListener('keydown', onKey)

    // The disc takes the logo's slot over the same hand-over that fades the
    // logo out, so the two swap places rather than overlapping.
    const hero = document.querySelector('[data-hero]')
    if (hero) {
      const { start, end } = exitRange(hero)

      gsap.fromTo(
        backRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: { trigger: hero, start, end, scrub: true, invalidateOnRefresh: true },
        }
      )
    }

    return () => {
      ScrollTrigger.removeEventListener('refresh', measure)
      window.removeEventListener('keydown', onKey)
    }
  })

  return (
    <>
      <div
        className="pointer-events-none fixed top-0 left-0 z-50 origin-top-left"
        style={{ width: DESIGN_WIDTH, transform: 'scale(var(--design-scale, 1))' }}
      >
        <button
          ref={backRef}
          type="button"
          aria-label="Back"
          onClick={() => step(-1, sectionStops)}
          className="pointer-events-auto absolute flex items-center justify-center rounded-full bg-cta text-ink transition-transform duration-300 hover:-translate-x-1 cursor-pointer"
          style={{ left: BACK.left, top: BACK.top, width: BACK.size, height: BACK.size }}
        >
          <svg
            viewBox="0 0 30 30"
            style={{ width: 30, height: 30 }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M25 15H5M12 8l-7 7 7 7" />
          </svg>
        </button>
      </div>

      <div
        className="pointer-events-none fixed right-10 z-50"
        style={{
          top: '50%',
          transform: 'translateY(-50%) scale(var(--design-scale, 1)) ',
          transformOrigin: 'right center',
        }}
      >
        <button
          type="button"
          onClick={() => step(1, sectionStops)}
          className="pointer-events-auto flex flex-col items-center justify-center bg-white text-ink opacity-60 transition-opacity hover:opacity-100 cursor-pointer"
          style={{
            width: PILL.width,
            height: PILL.height,
            borderRadius: PILL.radius,
            paddingTop: PILL.padding,
            paddingBottom: PILL.padding,
            gap: PILL.gap,
          }}
        >
          <span
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              height: PILL.label,
              fontSize: 20,
              lineHeight: '28px',
            }}
          >
            Tap to Scroll
          </span>
          <svg
            viewBox="0 0 22 22"
            style={{ width: PILL.arrow, height: PILL.arrow }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 3.5v15M5 12.5l6 6 6-6" />
          </svg>
        </button>
      </div>
    </>
  )
}

export default TapToScroll
