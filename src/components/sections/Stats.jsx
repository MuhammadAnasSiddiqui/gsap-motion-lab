import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'

const STATS = [
  { value: 500, suffix: '+', label: 'Authors supported', tone: 'bg-cream' },
  { value: 1000, suffix: '+', label: 'Books published', tone: 'bg-frost' },
  { text: 'Global', label: 'Distribution', tone: 'bg-cream' },
  { value: 100, suffix: '%', label: 'Author rights', tone: 'bg-frost' },
]

const format = (n) => Math.round(n).toLocaleString('en-US')

// Four stat tiles under the hero. Numbers count up when the row scrolls in.
function Stats() {
  const container = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from('.stat', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: container.current, start: 'top 85%', once: true },
      })
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count)
        const counter = { n: 0 }
        gsap.to(counter, {
          n: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate: () => { el.textContent = format(counter.n) },
        })
      })
    })
    return () => mm.revert()
  }, { scope: container })

  return (
    <section ref={container} className="px-(--pad) py-(--pad)">
      <ul className="grid grid-cols-2 gap-[max(12px,calc(32*var(--u)))] lg:grid-cols-4">
        {STATS.map((stat) => (
          <li
            key={stat.label}
            className={`stat flex flex-col gap-[max(8px,calc(16*var(--u)))] rounded-[max(20px,calc(36*var(--u)))] px-[max(20px,calc(32*var(--u)))] py-[max(28px,calc(54*var(--u)))] text-navy ${stat.tone}`}
          >
            <p className="t-h2 whitespace-nowrap">
              {stat.text ? stat.text : (
                <>
                  <span data-count={stat.value}>{format(stat.value)}</span>
                  {stat.suffix}
                </>
              )}
            </p>
            <p className="t-h4">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Stats
