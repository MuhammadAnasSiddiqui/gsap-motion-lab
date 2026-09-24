import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'
import brush from '../../assets/why/bg-brush.svg'
import pinSupport from '../../assets/why/icon-support.png'
import pinReach from '../../assets/why/icon-reach.png'
import pinMarketing from '../../assets/why/icon-marketing.png'
import pinAuthor from '../../assets/why/icon-author.png'
import pinQuality from '../../assets/why/icon-quality.png'

const CARDS = [
  { title: 'Professional\nSupport', tone: '#befdff', pin: pinSupport },
  { title: 'Global\nReach', tone: '#ead8fd', pin: pinReach, offset: true },
  { title: 'Marketing\nAssistance', tone: '#ffd7fd', pin: pinMarketing, pinShift: 10 },
  { title: 'Author\nfocused', tone: '#ffea98', pin: pinAuthor, offset: true },
  { title: 'High\nQuality', tone: '#a3f6eb', pin: pinQuality },
]

// "Why Choose Us" — five pinned note cards. Cards rise in, then the pins
// drop onto them with a little bounce.
function WhyChoose() {
  const container = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.why-cards', start: 'top 80%', once: true },
      })
      tl.from('.why-card', { y: 80, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' })
        .from('.why-pin', { y: -60, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'bounce.out' }, '-=0.4')
    })
    return () => mm.revert()
  }, { scope: container })

  return (
    <section ref={container} className="px-(--pad) py-(--pad)">
      <div className="panel relative flex flex-col items-center gap-[max(32px,calc(70*var(--u)))] bg-sky-soft py-[max(48px,calc(100*var(--u)))]">
        <img
          src={brush}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[-31.5%] left-[-36.8%] w-[164.5%] max-w-none rotate-[-6.02deg]"
        />
        <h2 className="t-h2 relative text-center text-navy" data-reveal>Why Choose Us</h2>

        <ul className="why-cards no-scrollbar relative flex w-full gap-4 overflow-x-auto px-(--gutter) pt-10 pb-4 lg:justify-center lg:gap-[calc(32*var(--u))] lg:overflow-visible lg:px-0">
          {CARDS.map((card) => (
            <li
              key={card.title}
              className={`why-card w-[220px] shrink-0 lg:w-[calc(298*var(--u))] ${card.offset ? 'lg:mt-[calc(77*var(--u))]' : ''}`}
            >
              <div className="relative flex flex-col items-center rounded-[max(20px,calc(32*var(--u)))] bg-white px-[max(10px,calc(14*var(--u)))] pt-[max(48px,calc(70*var(--u)))] pb-[max(10px,calc(14*var(--u)))] transition-transform duration-300 ease-out hover:-translate-y-2">
                <img
                  src={card.pin}
                  alt=""
                  className="why-pin absolute top-[max(-10px,calc(-14*var(--u)))] aspect-[1346/1168] w-[max(48px,calc(66*var(--u)))]"
                  style={{ left: `calc(50% + ${card.pinShift || 0} * var(--u))`, translate: '-50% 0' }}
                />
                <div
                  className="flex w-full items-center justify-center rounded-[max(20px,calc(32*var(--u)))] px-[max(16px,calc(48*var(--u)))] py-[max(36px,calc(64*var(--u)))]"
                  style={{ backgroundColor: card.tone }}
                >
                  <p className="font-display text-center text-[max(22px,calc(40*var(--u)))] leading-none font-semibold whitespace-pre-line text-ink">
                    {card.title}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default WhyChoose
