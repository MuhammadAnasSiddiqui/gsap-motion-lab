import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Card icons: stat-1.png … stat-4.png in src/assets/stats/. Swap a file there
// (png/webp/svg) and the matching card picks it up — no code change needed.
const icons = import.meta.glob('../assets/stats/stat-*.{png,webp,svg,jpg,jpeg,avif}', {
  eager: true,
  import: 'default',
})
const statIcon = (n) =>
  Object.entries(icons).find(([path]) => path.includes(`/stat-${n}.`))?.[1] ?? null

// Two palettes alternating across the row: warm (cream/amber) and cool (ice/blue).
const PALETTES = {
  warm: { base: '#FEF9F0', soft: '#FCEAC2', strong: '#FBDC91' },
  cool: { base: '#EAF2FD', soft: '#CCE0FB', strong: '#A9CBF8' },
}

// Vertical brush-wave edges, drawn in a 0–100 box and stretched to the card
// (preserveAspectRatio="none"), so the split keeps its shape at any size.
const WAVE_SOFT = 'M55 0C42 16 64 31 48 49c-15 17 14 28 5 51h47V0H55Z'
const WAVE_STRONG = 'M76 0C64 15 85 30 70 48c-15 18 12 30 4 52h26V0H76Z'

const STATS = [
  { value: 500, suffix: '+', label: 'Authors supported', tone: 'warm', icon: statIcon(1) },
  { value: 1000, suffix: '+', label: 'Books published', tone: 'cool', icon: statIcon(2) },
  { text: 'Global', label: 'Distribution', tone: 'warm', icon: statIcon(3) },
  { value: 100, suffix: '%', label: 'Author rights', tone: 'cool', icon: statIcon(4) },
]

const StatsStrip = () => {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const cards = gsap.utils.toArray('.js-stat-card')

      if (reduced) {
        // Still show the final numbers when motion is off.
        gsap.utils.toArray('.js-stat-number').forEach((el) => {
          el.textContent = el.dataset.final
        })
        return
      }

      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })

      // Numbers tick up once the row is in view; text-only stats just fade in above.
      gsap.utils.toArray('.js-stat-number').forEach((el, i) => {
        const target = Number(el.dataset.count)
        if (!target) return

        // Start from zero so the count is visible even when the strip is already
        // on screen at load time.
        el.textContent = '0' + el.dataset.suffix

        const counter = { n: 0 }
        gsap.to(counter, {
          n: target,
          duration: 1.6,
          delay: i * 0.12,
          ease: 'power2.out',
          snap: { n: 1 },
          onUpdate: () => {
            el.textContent = Math.round(counter.n).toLocaleString('en-US') + el.dataset.suffix
          },
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        })
      })
    },
    { scope: sectionRef }
  )

  return (
    <div
      ref={sectionRef}
      className="js-stats-strip grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7 relative z-10 mx-auto max-w-[1920px] px-5 py-16 sm:px-10 lg:py-6"
    >
      {STATS.map(({ value, suffix = '', text, label, tone, icon }) => {
        const palette = PALETTES[tone]
        const final = text ?? value.toLocaleString('en-US') + suffix

        return (
          <article
            key={label}
            className="js-stat-card group relative isolate overflow-hidden rounded-[32px] px-8 py-9 shadow-[0_24px_60px_-40px_rgba(11,22,56,0.45)] transition-transform duration-500 will-change-transform hover:-translate-y-2"
            style={{ backgroundColor: palette.base }}
          >
            <svg
              className="absolute inset-0 -z-10 size-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d={WAVE_SOFT} fill={palette.soft} />
              <path d={WAVE_STRONG} fill={palette.strong} />
            </svg>

            <img
              src={icon}
              alt=""
              loading="lazy"
              className="size-14 object-contain object-left sm:size-16"
            />

            <p
              className="js-stat-number mt-8 font-heading text-[clamp(2.75rem,3.4vw,4rem)] leading-none font-extrabold tracking-[-0.04em] text-ink"
              data-count={value ?? ''}
              data-suffix={suffix}
              data-final={final}
            >
              {final}
            </p>

            <p className="mt-4 font-display text-lg font-bold text-ink sm:text-xl">{label}</p>
          </article>
        )
      })}
    </div>
  )
}

export default StatsStrip
