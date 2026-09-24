import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK, DESKTOP } from '../../lib/gsap'
import CtaButton from '../CtaButton'
import pathStroke from '../../assets/steps/path-stroke.svg'
import step1 from '../../assets/steps/step-1.png'
import step2 from '../../assets/steps/step-2.png'
import step3 from '../../assets/steps/step-3.png'
import step4 from '../../assets/steps/step-4.png'

const STEPS = [
  {
    n: 1,
    title: 'Submit Your Manuscript',
    text: 'Send us your completed manuscript, draft or book idea. Our team will review your work, understand your goals.',
    img: step1,
    tone: '#befdff',
    rotate: -5,
    art: { w: 255, h: 228 },
  },
  {
    n: 2,
    title: 'Choose Publishing Plan',
    text: 'Following the assessment, we will recommend a suitable publishing package covering the services',
    img: step2,
    tone: '#ffd7fd',
    rotate: 5.56,
    art: { w: 253, h: 222, zoom: true },
  },
  {
    n: 3,
    title: 'Create & Prepare  Book',
    text: 'Your dedicated team will professionally edit, design and format your book for print and digital publication.',
    img: step3,
    tone: '#fff2c9',
    rotate: -5,
    art: { w: 259, h: 187 },
  },
  {
    n: 4,
    title: 'Publish & Promote',
    text: 'we will publish your book and make it available and distribution networks, including Amazon, Foyles and many more.',
    img: step4,
    tone: '#dbcfff',
    rotate: 5,
    art: { w: 212, h: 186, fade: true },
  },
]

// "Publishing doesn't have to be complicated." with the four tilted step
// cards. Cards fly in and settle onto their comp rotations; on phones they
// become an untilted horizontal rail.
function Steps() {
  const container = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
      gsap.from('.step-card', {
        y: 160,
        opacity: 0,
        rotation: (i) => STEPS[i].rotate * 3,
        duration: 1.1,
        stagger: 0.12,
        ease: 'back.out(1.2)',
        scrollTrigger: { trigger: '.step-row', start: 'top 80%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: container })

  return (
    <section ref={container} className="px-(--pad) py-(--pad)">
      <div className="panel relative flex flex-col gap-[max(32px,calc(60*var(--u)))] bg-white py-[max(32px,calc(60*var(--u)))]">
        {/* Light-blue brush stroke behind everything */}
        <img
          src={pathStroke}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[calc(50%_+_229*var(--u))] left-1/2 w-[114.15%] max-w-none -translate-x-1/2 -translate-y-1/2"
        />

        <div className="relative flex flex-col gap-8 px-(--gutter) lg:flex-row lg:items-center lg:justify-between">
          <h2 className="t-h2 text-navy" data-reveal>
            Publishing doesn't have<br />to be complicated.
          </h2>
          <div className="flex flex-col gap-[max(16px,calc(24*var(--u)))] lg:w-[calc(512*var(--u))] lg:items-end" data-reveal data-reveal-delay="0.15">
            <p className="t-body-xl w-full text-navy">
              We take care of the process.<br />You focus on the story.
            </p>
            <CtaButton />
          </div>
        </div>

        <ul className="step-row no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--gutter) pb-4 lg:justify-center lg:gap-0 lg:overflow-visible lg:px-0 lg:pt-[calc(30*var(--u))] lg:pb-[calc(40*var(--u))]">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className="step-card w-[280px] shrink-0 snap-center lg:w-[calc(360*var(--u))] lg:rotate-(--rot) lg:[&:not(:last-child)]:-mr-[calc(6*var(--u))]"
              style={{ '--rot': `${step.rotate}deg`, zIndex: i % 2 ? 2 : 1 }}
            >
              <article
                className="flex aspect-[360/530] flex-col items-center justify-between rounded-[max(20px,calc(32*var(--u)))] px-[max(12px,calc(16*var(--u)))] pt-[max(12px,calc(16*var(--u)))] pb-[max(20px,calc(32*var(--u)))] text-ink transition-transform duration-300 ease-out hover:-translate-y-2"
                style={{ backgroundColor: step.tone }}
              >
                <p className="font-script text-[max(14px,calc(20*var(--u)))] leading-[1.2] tracking-[0.04em]">Step#{step.n}</p>
                <div
                  className="relative overflow-hidden"
                  style={{ width: `${((step.art.w / 328) * 100).toFixed(1)}%`, aspectRatio: `${step.art.w} / ${step.art.h}` }}
                >
                  {step.art.zoom ? (
                    <img src={step.img} alt="" className="absolute top-[-21.57%] left-[-12.62%] w-[125.25%] max-w-none" />
                  ) : (
                    <img src={step.img} alt="" className="size-full object-cover" />
                  )}
                  {step.art.fade && (
                    <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ background: `linear-gradient(to bottom, transparent 10%, ${step.tone} 90%)` }} />
                  )}
                </div>
                <div className="flex w-[83.2%] flex-col gap-[max(12px,calc(24*var(--u)))]">
                  <h3 className="t-h4 whitespace-pre-wrap">{step.title}</h3>
                  <p className="t-body">{step.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Steps
