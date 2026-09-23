import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import backdrop from '../assets/hero/backdrop.svg'
import cloud from '../assets/hero/cloud.png'
import book from '../assets/hero/floating-books.png'
import { blurOnExit } from '../lib/blurOnExit'
import { HERO } from '../lib/design'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Resting layout = Figma's "Hero Section - 2"; the entry animates in from
// "Hero Section - 1", where only the artwork sits differently.
const FROM_FIRST_FRAME = {
  backdrop: { y: 51 },
  cloud: { x: -224, y: 132 },
  book: { x: 36, y: -29 },
}

// Leaving the section, Figma scales the hero to 1.87x and lifts it 0.53 of its
// own height faster than the page scrolls — a push-in as the next section
// slides over the top.
const EXIT_SCALE = 1.87
const EXIT_LIFT = 0.53

const HeroSection = () => {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.js-hero-line', { yPercent: 115, duration: 1, stagger: 0.12 })
        .from('.js-hero-fade', { y: 28, opacity: 0, duration: 0.8, stagger: 0.12 }, '-=0.65')
        .from(
          '.js-hero-book',
          { scale: 0.86, opacity: 0, rotate: -6, duration: 1.1, ease: 'back.out(1.4)' },
          '-=0.95'
        )

      // Figma runs this settle with EASE_IN over 2s, underneath the copy.
      tl.from('.js-hero-backdrop', { ...FROM_FIRST_FRAME.backdrop, duration: 2, ease: 'power2.in' }, 0)
        .from('.js-hero-cloud', { ...FROM_FIRST_FRAME.cloud, duration: 2, ease: 'power2.in' }, 0)
        .from('.js-hero-book', { ...FROM_FIRST_FRAME.book, duration: 2, ease: 'power2.in' }, 0)

      // The float lives on the inner image so it never fights the settle above.
      gsap.to('.js-hero-float', {
        y: 18,
        duration: 3.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2,
      })

      blurOnExit(sectionRef.current)

      gsap.to(stageRef.current, {
        scale: EXIT_SCALE,
        y: -EXIT_LIFT * HERO.height,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#d2e6fc]"
      style={{ height: HERO.height }}
    >
      <div ref={stageRef} className="absolute inset-0 will-change-transform">
        {/* The export carries ~97px of bleed on each side of the Figma box. */}
        <img
          src={backdrop}
          alt=""
          aria-hidden="true"
          className="js-hero-backdrop absolute max-w-none select-none"
          style={{ left: -271, top: -435, width: 2795 }}
        />
        <img
          src={cloud}
          alt=""
          aria-hidden="true"
          className="js-hero-cloud absolute max-w-none select-none"
          style={{ left: -100, top: 612, width: 875 }}
        />
        <div className="js-hero-book absolute" style={{ left: 1255, top: 266, width: 492 }}>
          <img src={book} alt="" aria-hidden="true" className="js-hero-float w-full select-none" />
        </div>

        <h1
          className="absolute font-heading font-extrabold text-[#081a3a]"
          style={{ left: 70, top: 262, width: 1070, fontSize: 120, lineHeight: '120px' }}
        >
          <span className="block overflow-hidden" style={{ height: 120 }}>
            <span className="js-hero-line block">Your story deserves</span>
          </span>
          <span className="block overflow-hidden" style={{ height: 120 }}>
            <span className="js-hero-line block">to be a book.</span>
          </span>
        </h1>

        <p
          className="js-hero-fade absolute text-[#4a5468]"
          style={{ left: 70, top: 544, width: 908, fontSize: 40, lineHeight: '56px', letterSpacing: '-0.4px' }}
        >
          We are here to help. Our editors will make the difficult process of publication easier for
          you.
        </p>

        <a
          href="#start"
          className="js-hero-fade group absolute flex items-center rounded-full bg-[#f3cd5a] transition-shadow hover:shadow-[0_12px_30px_-10px_rgba(242,208,90,0.9)]"
          style={{ left: 70, top: 698, width: 393, height: 80 }}
        >
          <span
            className="absolute font-heading font-semibold text-[#081a3a]"
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
      </div>
    </section>
  )
}

export default HeroSection
