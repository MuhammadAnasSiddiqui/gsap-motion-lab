import React, { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { canvasScale, MIN_INNER_STEP, SECTIONS } from '../lib/design'

gsap.registerPlugin(useGSAP, Observer, ScrollToPlugin, ScrollTrigger)

// Figma advances one frame per tap with a 2.5s smart-animate. That is too slow
// to sit under a mouse wheel, so a step runs at 1.2s here — the scrubbed section
// animations play out over exactly this window.
const STEP_DURATION = 1.2

const TapToScroll = () => {
  const animating = useRef(false)
  const stops = useRef([])

  // Inside the canvas a section is walked through before the next one is
  // reached: its top, then even steps until its bottom sits on the screen edge.
  // Anything rendered after the canvas is ordinary markup, so it falls back to
  // one screen per step.
  const measure = useCallback(() => {
    const vh = window.innerHeight
    const max = Math.max(0, document.documentElement.scrollHeight - vh)
    const scale = canvasScale()
    const canvas = document.querySelector('[data-design-canvas]')
    const list = []

    if (canvas) {
      const top = canvas.getBoundingClientRect().top + window.scrollY
      const screen = vh / scale // the visible slice of the canvas, in design px
      const at = (designY) => Math.round(top + designY * scale)

      SECTIONS.forEach((section) => {
        const hidden = section.height - screen

        // Bottom aligned: stop early enough that the section's own bottom edge
        // lands on the screen's, leaving the section above it on show.
        if (section.align === 'bottom') {
          list.push(at(Math.max(0, section.top + hidden)))
          return
        }

        list.push(at(section.top))
        if (hidden < MIN_INNER_STEP) return

        const steps = Math.ceil(hidden / screen)
        for (let i = 1; i <= steps; i++) list.push(at(section.top + (hidden * i) / steps))
      })

      // Continue past the canvas a screen at a time.
      for (let y = Math.round(top + canvas.offsetHeight); y < max; y += vh) list.push(y)
    } else {
      for (let y = 0; y < max; y += vh) list.push(y)
    }

    list.push(max)
    stops.current = [...new Set(list)].filter((y) => y >= 0 && y <= max).sort((a, b) => a - b)
  }, [])

  const step = useCallback((direction) => {
    if (animating.current) return
    const y = window.scrollY
    const next =
      direction > 0
        ? stops.current.find((s) => s > y + 4)
        : [...stops.current].reverse().find((s) => s < y - 4)
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

    return () => {
      ScrollTrigger.removeEventListener('refresh', measure)
      window.removeEventListener('keydown', onKey)
    }
  })

  return (
    <button
      type="button"
      onClick={() => step(1)}
      className="group fixed top-1/2 right-4 z-50 hidden -translate-y-1/2 cursor-pointer flex-col items-center gap-4 text-ink opacity-60 transition-opacity hover:opacity-100 sm:right-8 sm:flex"
    >
      <span className="font-display text-sm font-semibold tracking-[0.18em] uppercase [writing-mode:vertical-rl]">
        Tap to Scroll
      </span>
      <span className="flex size-11 items-center justify-center rounded-full bg-white/80 shadow-[0_10px_30px_-18px_rgba(11,22,56,0.8)] transition-transform duration-300 group-hover:translate-y-1">
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </span>
    </button>
  )
}

export default TapToScroll
