import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import BrushWaveBackground from './BrushWaveBackground'
import CtaButton from './CtaButton'
import ProcessCard, { CARD_HEIGHT, CARD_WIDTH } from './ProcessCard'
import { convergeCards } from '../lib/convergeCards'
import { PROCESS } from '../lib/design'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Card illustrations: drop step-1.png … step-4.png into src/assets/process/.
// Missing files just fall back to the placeholder.
const images = import.meta.glob('../assets/process/step-*.{png,webp,jpg,jpeg,avif}', {
  eager: true,
  import: 'default',
})
const stepImage = (n) =>
  Object.entries(images).find(([path]) => path.includes(`/step-${n}.`))?.[1] ?? null

// Figma: the step cards start 6.92x further from the row centre and gather in
// as the section scrolls up.
const SPREAD = 6.92

// Hover: the card under the pointer straightens and its neighbours step aside.
// Figma animates this with its BOUNCY spring over ~1.2s. No scaling — the cards
// keep their size.
const CARD_SPREAD = 48
const HOVER = { duration: 0.9, ease: 'back.out(1.6)' }

// Card centres inside the 1817-wide row, straight from the frame.
const STEPS = [
  {
    title: 'Submit Your Manuscript',
    description:
      'Send us your completed manuscript, draft or book idea. Our team will review your work, understand your goals.',
    color: '#befdff',
    rotation: -5,
    centre: { x: 372.5, y: 281.5 },
    image: stepImage(1),
    placeholder: '📂',
  },
  {
    title: 'Choose Publishing Plan',
    description:
      'Following the assessment, we will recommend a suitable publishing package covering the services',
    color: '#ffd7fd',
    rotation: 5.56,
    centre: { x: 728, y: 281 },
    image: stepImage(2),
    placeholder: '👑',
  },
  {
    title: 'Create & Prepare Book',
    description:
      'Your dedicated team will professionally edit, design and format your book for print and digital publication.',
    color: '#fff2c9',
    rotation: -5,
    centre: { x: 1086.5, y: 281.5 },
    image: stepImage(3),
    placeholder: '📖',
  },
  {
    title: 'Publish & Promote',
    description:
      'We will publish your book and make it available and distribution networks, including Amazon, Foyles and many more.',
    color: '#dbcfff',
    rotation: 5,
    centre: { x: 1435.5, y: 280.5 },
    image: stepImage(4),
    placeholder: '🚀',
  },
]

const ProcessSection = () => {
  const sectionRef = useRef(null)
  const cardRefs = useRef([])
  const slotRefs = useRef([])

  const { contextSafe } = useGSAP(
    () => {
      const cards = cardRefs.current
      cards.forEach((card, i) => gsap.set(card, { rotation: STEPS[i].rotation, zIndex: i + 1 }))

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // Held until the section is reached — it is no longer first on the page.
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', once: true },
      })
      tl.from('.js-heading-line', { yPercent: 110, duration: 0.9, stagger: 0.12 })
        .from('.js-intro', { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.6')

      convergeCards(slotRefs.current, { spread: SPREAD, trigger: '.js-process-cards' })
    },
    { scope: sectionRef }
  )

  // Hovered card straightens in place; cards on either side slide away. The
  // gather runs on the outer slot, so the two never fight over one transform.
  const focusCard = contextSafe((active) => {
    gsap.to('.js-process-card', {
      x: (i) => (i < active ? -CARD_SPREAD : i > active ? CARD_SPREAD : 0),
      rotation: (i) => (i === active ? 0 : STEPS[i].rotation),
      zIndex: (i) => (i === active ? 10 : i + 1),
      ...HOVER,
      overwrite: 'auto',
    })
  })

  const resetCards = contextSafe(() => {
    gsap.to('.js-process-card', {
      x: 0,
      rotation: (i) => STEPS[i].rotation,
      zIndex: (i) => i + 1,
      ...HOVER,
      overwrite: 'auto',
    })
  })

  return (
    <section ref={sectionRef} className="relative" style={{ height: PROCESS.height }}>
      {/* The section is a rounded white panel, inset 20px on every side. */}
      <div
        className="absolute overflow-hidden bg-white"
        style={{ left: 20, top: 20, width: 1880, height: 1080, borderRadius: 100 }}
      >
        <div className="absolute" style={{ left: -133, top: 14, width: 2146, height: 1510 }}>
          <BrushWaveBackground />
        </div>

        <h2
          className="absolute font-heading font-bold text-navy"
          style={{ left: 130, top: 109, width: 1028, fontSize: 90, lineHeight: '99px' }}
        >
          <span className="block overflow-hidden" style={{ height: 99 }}>
            <span className="js-heading-line block">Publishing doesn’t have</span>
          </span>
          <span className="block overflow-hidden" style={{ height: 99 }}>
            <span className="js-heading-line block">to be complicated.</span>
          </span>
        </h2>

        <p
          className="js-intro absolute font-heading font-semibold text-navy"
          style={{ left: 1238, top: 128, width: 512, fontSize: 28, lineHeight: '28px' }}
        >
          We take care of the process.
          <br />
          You focus on the story.
        </p>

        <CtaButton className="js-intro absolute" style={{ left: 1285, top: 208 }} />

        <div
          className="js-process-cards absolute"
          style={{ left: 32, top: 367, width: 1817, height: 603 }}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              ref={(el) => {
                slotRefs.current[i] = el
              }}
              className="absolute will-change-transform"
              style={{
                left: step.centre.x - CARD_WIDTH / 2,
                top: step.centre.y - CARD_HEIGHT / 2,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
              }}
            >
              <ProcessCard
                {...step}
                step={i + 1}
                cardRef={(el) => {
                  cardRefs.current[i] = el
                }}
                onEnter={() => focusCard(i)}
                onLeave={resetCards}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
