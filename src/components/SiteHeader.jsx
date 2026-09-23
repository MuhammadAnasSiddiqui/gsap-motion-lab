import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import logo from '../assets/hero/logo.svg'
import { exitRange } from '../lib/blurOnExit'
import { DESIGN_WIDTH } from '../lib/design'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// The header holds the same place on every frame of the prototype, so it is
// pinned rather than scrolled. It sits outside <DesignCanvas> and borrows the
// canvas scale, which DesignCanvas publishes as --design-scale.

// Header box: 1780x80 at (70, 30). Everything below is relative to it.
const BOX = { x: 70, y: 30, width: 1780, height: 80 }

const NAV = [
  { label: 'Publish Your Book', x: 480, width: 221 },
  { label: 'Services', x: 708, width: 122 },
  { label: 'Portfolio', x: 837, width: 118 },
  { label: 'Author Stories', x: 962, width: 187 },
  { label: 'About', x: 1156, width: 96 },
]

const SiteHeader = () => {
  const logoRef = useRef(null)

  // The back control takes this slot from the second section on, so the mark
  // clears out over the same hand-over that carries the disc up here.
  useGSAP(() => {
    const hero = document.querySelector('[data-hero]')
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const { start, end } = exitRange(hero)
    gsap.to(logoRef.current, {
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: { trigger: hero, start, end, scrub: true, invalidateOnRefresh: true },
    })
  })

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-40 origin-top-left"
      style={{ width: DESIGN_WIDTH, transform: 'scale(var(--design-scale, 1))' }}
    >
      <header
        className="pointer-events-auto relative"
        style={{ marginLeft: BOX.x, marginTop: BOX.y, width: BOX.width, height: BOX.height }}
      >
        <a
          ref={logoRef}
          href="#top"
          className="absolute"
          style={{ left: 0, top: 4, width: 307, height: 71 }}
        >
          <img src={logo} alt="Cambridge Book Publishing" className="size-full" />
        </a>

        <nav>
          {NAV.map(({ label, x, width }) => (
            <a
              key={label}
              href="#start"
              className="absolute flex items-center justify-center rounded-full bg-white text-ink transition-colors hover:bg-cta"
              style={{ left: x, top: 15, width, height: 50, fontSize: 24, lineHeight: '34px' }}
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#start"
          className="group absolute flex items-center rounded-full bg-cta transition-shadow hover:shadow-[0_12px_30px_-10px_rgba(242,208,90,0.9)]"
          style={{ left: 1387, top: 0, width: 393, height: 80 }}
        >
          <span
            className="absolute font-heading font-semibold text-ink"
            style={{ left: 24, fontSize: 23, lineHeight: '28px' }}
          >
            Start Your Publishing Journey
          </span>
          <span
            className="absolute flex items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:translate-x-1"
            style={{ left: 317, top: 10, width: 60, height: 60 }}
          >
            <svg
              viewBox="0 0 24 24"
              style={{ width: 32, height: 32 }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
      </header>
    </div>
  )
}

export default SiteHeader
