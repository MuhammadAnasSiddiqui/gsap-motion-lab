import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'

const EXPERIMENTS = [
  {
    to: '/camblp',
    title: 'Cambridge Book Publishing',
    text: 'Full homepage from Figma: hero intro, pinned gallery morph, marquees, count-ups, scroll reveals.',
  },
]

// Landing page for the lab: a list of the experiments living in this repo.
function LabIndex() {
  const container = useRef(null)
  useEffect(() => { document.title = 'GSAP Motion Lab' }, [])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from('.lab-in', { y: 24, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' })
    })
    return () => mm.revert()
  }, { scope: container })

  return (
    <main ref={container} className="flex min-h-svh items-center justify-center bg-navy px-6 py-16 text-white">
      <section className="w-full max-w-2xl">
        <p className="lab-in font-body text-sm font-medium tracking-widest text-gold uppercase">GSAP motion lab</p>
        <h1 className="lab-in mt-5 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">Experiments</h1>
        <ul className="mt-10 flex flex-col gap-4">
          {EXPERIMENTS.map((item) => (
            <li key={item.to} className="lab-in">
              <Link
                to={item.to}
                className="group block rounded-3xl border border-white/15 bg-white/5 p-6 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                <span className="flex items-center justify-between gap-4 font-display text-2xl font-semibold">
                  {item.title}
                  <span aria-hidden="true" className="text-gold transition-transform group-hover:translate-x-1">→</span>
                </span>
                <span className="mt-2 block font-body text-white/70">{item.text}</span>
                <span className="mt-3 block font-mono text-xs text-white/50">{item.to}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default LabIndex
