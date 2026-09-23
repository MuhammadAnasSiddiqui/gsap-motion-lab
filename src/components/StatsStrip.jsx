import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { blurOnExit } from '../lib/blurOnExit'
import { convergeCards } from '../lib/convergeCards'
import { STATS as STATS_BOX } from '../lib/design'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Card icons: stat-1.png … stat-4.png in src/assets/stats/. Swap a file there
// (png/webp/svg) and the matching card picks it up — no code change needed.
const icons = import.meta.glob('../assets/stats/stat-*.{png,webp,svg,jpg,jpeg,avif}', {
  eager: true,
  import: 'default',
})
const statIcon = (n) =>
  Object.entries(icons).find(([path]) => path.includes(`/stat-${n}.`))?.[1] ?? null

// Colours taken from the Figma cards: `base` is the light side the content sits
// on, `accent` the painted side.
const PALETTES = {
  warm: { base: '#FDF9F0', accent: '#FFEFCA' },
  cool: { base: '#E2EFFD', accent: '#BFDEFF' },
}

// The light half, drawn in a 0-100 box and stretched to the card
// (preserveAspectRatio="none"). Still a hand-drawn stand-in for Figma's painted
// edge — the real vector needs a geometry export.
const WAVE = 'M0 0H52C56 7 59 14 57 21 55 28 51 34 50 43c-1 8 5 12 12 13 7 1 9 7 8 14-1 8-4 15-4 22 0 5 3 7 6 10H0Z'

// Figma: the cards start 5.21x further from the row centre and gather in.
const SPREAD = 5.21

// Card box and its internal rhythm, straight from the frame.
const CARD = { width: 446, height: 367, radius: 36, padX: 32, iconY: 54, numberY: 170, labelY: 285 }
const PITCH = 478

const STATS = [
  { value: 500, suffix: '+', label: 'Authors supported', tone: 'warm', icon: statIcon(1) },
  { value: 1000, suffix: '+', label: 'Books published', tone: 'cool', icon: statIcon(2) },
  { text: 'Global', label: 'Distribution', tone: 'warm', icon: statIcon(3) },
  { value: 100, suffix: '%', label: 'Author rights', tone: 'cool', icon: statIcon(4) },
]

const StatsStrip = () => {
  const sectionRef = useRef(null)
  const rowRef = useRef(null)

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

      // Ends on 'bottom bottom' — the exact scroll position the strip rests at
      // — so the cards are fully gathered by the time it stops.
      convergeCards(cards, {
        spread: SPREAD,
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom bottom',
      })

      // The strip rests on the bottom edge of the screen, so the section above it
      // stays in view. It is done with, so it drops out of focus as the strip
      // settles — blurred, not hidden.
      const above = sectionRef.current.previousElementSibling
      if (above) {
        blurOnExit(above, {
          amount: 14,
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
        })
      }

      // Numbers tick up once the row is in view; the text-only stat stays put.
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
          scrollTrigger: { trigger: rowRef.current, start: 'top 80%', once: true },
        })
      })
    },
    { scope: sectionRef }
  )

  return (
    // Clipped because the cards start far outside the row on their way in, and
    // pulled up because Figma overlaps it into the section above.
    <section
      ref={sectionRef}
      className="js-stats-strip relative overflow-x-clip"
      style={{ height: STATS_BOX.height, marginTop: -STATS_BOX.overlap }}
    >
      <div ref={rowRef} className="absolute" style={{ left: 20, top: 20, width: 1880, height: CARD.height }}>
        {STATS.map(({ value, suffix = '', text, label, tone, icon }, i) => {
          const palette = PALETTES[tone]
          const final = text ?? value.toLocaleString('en-US') + suffix

          return (
            <article
              key={label}
              className="js-stat-card absolute isolate overflow-hidden will-change-transform"
              style={{
                left: i * PITCH,
                top: 0,
                width: CARD.width,
                height: CARD.height,
                borderRadius: CARD.radius,
                backgroundColor: palette.accent,
              }}
            >
              <svg
                className="absolute inset-0 -z-10 size-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d={WAVE} fill={palette.base} />
              </svg>

              <img
                src={icon}
                alt=""
                loading="lazy"
                className="absolute object-contain"
                style={{ left: CARD.padX, top: CARD.iconY, width: 100, height: 100 }}
              />

              <p
                className="js-stat-number absolute font-heading font-bold text-ink"
                style={{ left: CARD.padX, top: CARD.numberY, fontSize: 90, lineHeight: '99px' }}
                data-count={value ?? ''}
                data-suffix={suffix}
                data-final={final}
              >
                {final}
              </p>

              <p
                className="absolute font-heading font-semibold text-ink"
                style={{ left: CARD.padX, top: CARD.labelY, fontSize: 28, lineHeight: '28px' }}
              >
                {label}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default StatsStrip
