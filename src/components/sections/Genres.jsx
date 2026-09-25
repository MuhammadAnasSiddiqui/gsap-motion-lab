import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'
import brush from '../../assets/genres/bg-brush.svg'

const GENRES = [
  'Fiction',
  'Poetry & Verse',
  'Memoir & Biography',
  'Self-Help & Wellbeing',
  'History & Education',
  'Travel & Lifestyle',
  "Children's Books",
  'and more!',
]

// Genre list on the yellow panel. Lines wipe up one after another, and the
// line nearest the viewport centre is emphasised as you scroll.
function Genres() {
  const container = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from('.genre-line', {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.genre-list', start: 'top 75%', once: true },
      })
      gsap.utils.toArray('.genre-line').forEach((line) => {
        gsap.fromTo(
          line,
          { scale: 0.92, opacity: 0.45 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: line, start: 'top 70%', end: 'top 40%', scrub: true },
          },
        )
      })
    })
    return () => mm.revert()
  }, { scope: container })

  return (
    <section ref={container} className="px-(--pad) py-(--pad)">
      <div className="panel relative flex flex-col items-center justify-center bg-[#ffd982] px-(--gutter) py-[max(48px,calc(100*var(--u)))] lg:min-h-[calc(1080*var(--u))]">
        <img
          src={brush}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[-22.8%] left-[-5.8%] w-[141.5%] max-w-none"
        />
        <ul className="genre-list relative flex flex-col items-center text-center">
          {GENRES.map((genre) => (
            <li key={genre} className="-mb-[2px] overflow-hidden pb-[0.12em]">
              <p className="genre-line t-h2 text-navy">{genre}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Genres
