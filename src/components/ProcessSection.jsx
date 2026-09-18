import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import BrushWaveBackground from './BrushWaveBackground'
import ProcessCard from './ProcessCard'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Card illustrations: drop step-1.png … step-4.png into src/assets/process/.
// Missing files just fall back to the placeholder.
const images = import.meta.glob('../assets/process/step-*.{png,webp,jpg,jpeg,avif}', {
  eager: true,
  import: 'default',
})
const stepImage = (n) =>
  Object.entries(images).find(([path]) => path.includes(`/step-${n}.`))?.[1] ?? null

const CARD_SPREAD = 48

const STEPS = [
  {
    title: 'Submit Your Manuscript',
    description:
      'Send us your completed manuscript, draft or book idea. Our team will review your work, understand your goals.',
    color: '#bdf9fd',
    rotation: -5,
    image: stepImage(1),
    placeholder: '📂',
  },
  {
    title: 'Choose Publishing Plan',
    description:
      'Following the assessment, we will recommend a suitable publishing package covering the services',
    color: '#fbd5fa',
    rotation: 4,
    image: stepImage(2),
    placeholder: '👑',
  },
  {
    title: 'Create & Prepare Book',
    description:
      'Your dedicated team will professionally edit, design and format your book for print and digital publication.',
    color: '#fff0c4',
    rotation: -4,
    image: stepImage(3),
    placeholder: '📖',
  },
  {
    title: 'Publish & Promote',
    description:
      'We will publish your book and make it available and distribution networks, including Amazon, Foyles and many more.',
    color: '#d8cffc',
    rotation: 4,
    image: stepImage(4),
    placeholder: '🚀',
  },
]

const ProcessSection = () => {
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  const { contextSafe } = useGSAP(
    () => {
      const cards = cardRefs.current
      cards.forEach((card, i) => gsap.set(card, { rotation: STEPS[i].rotation, zIndex: i + 1 }))

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.js-heading-line', { yPercent: 110, duration: 0.9, stagger: 0.12 })
        .from('.js-intro', { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.6')

      // When the card row scrolls into view: first half slides in from the left, second half from the right.
      const half = cards.length / 2
      gsap.from(cards, {
        x: (i) => (i < half ? -1 : 1) * window.innerWidth * 0.6,
        opacity: 0,
        rotation: (i) => (i < half ? -1 : 1) * 12,
        duration: 1.2,
        ease: 'power3.out',
        stagger: { each: 0.15, from: 'edges' },
        scrollTrigger: {
          trigger: '.js-process-cards',
          start: 'top 85%',
          once: true,
        },
      })
    },
    { scope: sectionRef }
  )

  // Hovered card straightens in place; cards on either side slide away to open space.
  // Spreading only applies to the single-row (lg) layout — in the grid it would push cards off-screen.
  const focusCard = contextSafe((active) => {
    const spread = window.matchMedia('(min-width: 1024px)').matches ? CARD_SPREAD : 0
    gsap.to('.js-process-card', {
      x: (i) => (i < active ? -spread : i > active ? spread : 0),
      rotation: (i) => (i === active ? 0 : STEPS[i].rotation),
      zIndex: (i) => (i === active ? 10 : i + 1),
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  })

  const resetCards = contextSafe(() => {
    gsap.to('.js-process-card', {
      x: 0,
      rotation: (i) => STEPS[i].rotation,
      zIndex: (i) => i + 1,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  })

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-white">
      <BrushWaveBackground />

      <div className="relative z-10 mx-auto max-w-[1920px] px-5 py-16 sm:px-10 lg:py-24 xl:px-[70px]">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <h2 className="font-heading text-[clamp(2.25rem,4.3vw,5.25rem)] leading-[1.08] font-extrabold tracking-[-0.04em] text-ink">
            <span className="block overflow-hidden pb-[0.16em] -mb-[0.12em]">
              <span className="js-heading-line block">Publishing doesn’t have</span>
            </span>
            <span className="block overflow-hidden pb-[0.16em] -mb-[0.12em]">
              <span className="js-heading-line block">to be complicated.</span>
            </span>
          </h2>

          <div className="lg:pt-2 lg:text-left">
            <p className="js-intro text-[clamp(1.25rem,2vw,2.4rem)] leading-snug text-ink">
              We take care of the process.
              <br />
              You focus on the story.
            </p>

            <a
              href="#start"
              className="js-intro group mt-8 inline-flex items-center gap-4 rounded-full bg-cta py-2.5 pr-2.5 pl-6 font-display text-lg font-bold text-ink transition-shadow hover:shadow-[0_12px_30px_-10px_rgba(242,208,90,0.9)] sm:text-2xl"
            >
              Start Your Publishing Journey
              <span className="flex size-12 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:translate-x-1 sm:size-[60px]">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
          </div>
        </header>

        <div className="js-process-cards mt-16 grid justify-items-center gap-10 sm:grid-cols-2 lg:mt-20 lg:flex lg:justify-center lg:gap-0">
          {STEPS.map((step, i) => (
            <div key={step.title} className="w-full max-w-[360px] lg:-mx-1.5 lg:flex-1">
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
