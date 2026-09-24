import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'
import brushNavy from '../../assets/banners/brush-navy.svg'
import brushBlue from '../../assets/banners/brush-blue.svg'

const RIBBONS = [
  {
    text: 'Design 2 eBooks and Get the 3rd at 50% Off',
    brush: brushNavy,
    className: 'ribbon-left top-[8.3%] left-[-1.7%] rotate-[2.69deg] bg-navy',
    brushClass: 'left-[calc(50%_-_29.3%)]',
    direction: -1,
  },
  {
    text: 'Free Social Media Mockups with Your eBook',
    brush: brushBlue,
    className: 'ribbon-right top-[36.7%] left-1/2 -translate-x-1/2 rotate-[-1.9deg] bg-accent-bright shadow-[20px_-31px_14px_rgba(31,82,172,0.2)]',
    brushClass: 'left-1/2',
    direction: 1,
  },
]

// Two crossing promo ribbons. Each one is an endless marquee: the phrase is
// repeated and the track loops by half its width.
function Banners() {
  const container = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray('.ribbon-track').forEach((track) => {
        const dir = Number(track.dataset.direction)
        gsap.fromTo(
          track,
          { xPercent: dir < 0 ? 0 : -50 },
          { xPercent: dir < 0 ? -50 : 0, duration: 28, ease: 'none', repeat: -1 },
        )
      })
    })
    return () => mm.revert()
  }, { scope: container })

  return (
    <section ref={container} className="relative aspect-[1920/468] w-full overflow-clip bg-white max-lg:min-h-[220px]" aria-label="Offers">
      {RIBBONS.map((ribbon) => (
        <div
          key={ribbon.text}
          className={`absolute w-[101.6%] overflow-clip py-[max(12px,calc(24*var(--u)))] ${ribbon.className}`}
        >
          <img
            src={ribbon.brush}
            alt=""
            aria-hidden="true"
            className={`pointer-events-none absolute top-[-108%] w-[94%] max-w-none -translate-x-1/2 ${ribbon.brushClass}`}
          />
          <div className="ribbon-track relative flex w-max" data-direction={ribbon.direction}>
            {Array.from({ length: 6 }).map((_, i) => (
              <p
                key={i}
                className="t-h2 shrink-0 px-[max(24px,calc(60*var(--u)))] whitespace-nowrap text-white"
                aria-hidden={i > 0}
              >
                {ribbon.text}
              </p>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export default Banners
