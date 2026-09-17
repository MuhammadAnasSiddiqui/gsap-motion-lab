import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import BrushWaveBackground from './BrushWaveBackground'
import ProcessCard from './ProcessCard'

gsap.registerPlugin(useGSAP)

const STEPS = [
  {
    title: 'Submit Your Manuscript',
    description:
      'Send us your completed manuscript, draft or book idea. Our team will review your work, understand your goals.',
    color: '#bdf9fd',
    rotation: -5,
    image: null,
    placeholder: '📂',
  },
  {
    title: 'Choose Publishing Plan',
    description:
      'Following the assessment, we will recommend a suitable publishing package covering the services',
    color: '#fbd5fa',
    rotation: 4,
    image: null,
    placeholder: '👑',
  },
  {
    title: 'Create & Prepare Book',
    description:
      'Your dedicated team will professionally edit, design and format your book for print and digital publication.',
    color: '#fff0c4',
    rotation: -4,
    image: null,
    placeholder: '📖',
  },
  {
    title: 'Publish & Promote',
    description:
      'We will publish your book and make it available and distribution networks, including Amazon, Foyles and many more.',
    color: '#d8cffc',
    rotation: 4,
    image: null,
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
        .from(
          cards,
          {
            y: 160,
            opacity: 0,
            rotation: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'back.out(1.4)',
          },
          '-=0.4'
        )
    },
    { scope: sectionRef }
  )

  const liftCard = contextSafe((card) => {
    gsap.to(card, {
      y: -18,
      rotation: 0,
      scale: 1.03,
      zIndex: 10,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  })

  const dropCard = contextSafe((card, i) => {
    gsap.to(card, {
      y: 0,
      rotation: STEPS[i].rotation,
      scale: 1,
      zIndex: i + 1,
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
          <h2 className="font-display text-[clamp(2.25rem,4.3vw,5.25rem)] leading-[1.08] font-extrabold tracking-[-0.04em] text-ink">
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

        <div className="mt-16 grid justify-items-center gap-10 sm:grid-cols-2 lg:mt-20 lg:flex lg:justify-center lg:gap-0">
          {STEPS.map((step, i) => (
            <div key={step.title} className="w-full max-w-[360px] lg:-mx-1.5 lg:flex-1">
              <ProcessCard
                {...step}
                step={i + 1}
                cardRef={(el) => {
                  cardRefs.current[i] = el
                }}
                onEnter={(e) => liftCard(e.currentTarget)}
                onLeave={(e) => dropCard(e.currentTarget, i)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
