import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK, DESKTOP } from '../../lib/gsap'
import brush from '../../assets/gallery/bg-brush.svg'
import arrowWhite from '../../assets/gallery/arrow-white-24.svg'
import cover1 from '../../assets/gallery/cover-1.jpg'
import cover2 from '../../assets/gallery/cover-2.jpg'
import cover3 from '../../assets/gallery/cover-3.jpg'
import cover4 from '../../assets/gallery/cover-4.jpg'
import cover5 from '../../assets/gallery/cover-5.jpg'
import cover6 from '../../assets/gallery/cover-6.jpg'
import cover7 from '../../assets/gallery/cover-7.jpg'

// Comp geometry (1918x925). `fan` is the first state (books fanned inside
// the blue panel), `grid` the second (2x3 grid on the right, copy on the
// left). Positions are book centres; the last book leaves the frame.
const STAGE = { w: 1918, h: 925 }
const BOOK = { w: 242.76, h: 361.58 }
const GRID_SCALE = 229.7 / BOOK.w

const BOOKS = [
  { src: cover1, alt: 'Amikae by Patrick Ismond', fan: { x: 278, y: 543, r: -15 }, grid: { x: 1128.5, y: 319.2, r: 0 } },
  { src: cover2, alt: 'Half-Breeds by H.C. Hart', fan: { x: 495, y: 513, r: -10 }, grid: { x: 1409.2, y: 290.3, r: 0 } },
  { src: cover3, alt: 'The Thicket by Ann Eames', fan: { x: 724.5, y: 504, r: -5 }, grid: { x: 1128.6, y: 699.4, r: 0 } },
  { src: cover4, alt: 'After Dark in Greenwich Park by Tracey-Ann Beckett', fan: { x: 953.6, y: 494.7, r: 0 }, grid: { x: 1409.6, y: 670.3, r: 0 } },
  { src: cover5, alt: 'It Started with a Fire by Jane Taylor', fan: { x: 1182.6, y: 504.6, r: 5 }, grid: { x: 1685, y: 700.3, r: 0 } },
  { src: cover6, alt: 'A Dreadful Coincidence by Jack Digby', fan: { x: 1412, y: 513, r: 10 }, grid: { x: 1685, y: 320.3, r: 0 } },
  { src: cover7, alt: 'Adoption: The Journey by Chelle Johnson', fan: { x: 1642, y: 543.5, r: 15 }, grid: { x: 2080, y: 319.4, r: 15 } },
]

const POINTS = [
  { title: 'Author first', text: 'Your vision remains at the centre of the publishing process.' },
  { title: 'End-to-end support', text: 'From editing and design to publishing and distribution.' },
  { title: 'Professional quality', text: 'Specialists who know what it takes to create a polished book.' },
  { title: 'Clear & transparent', text: 'Straightforward plans, pricing and communication.' },
]

const pct = (v, of) => `${((v / of) * 100).toFixed(2)}%`

// "#MadewithCambridgebookpublic": on desktop the section pins and a scrubbed
// timeline morphs the fanned books into the grid while the copy slides in.
// On phones (and with reduced motion) it's a plain stacked layout.
function Gallery() {
  const container = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
      const stage = container.current.querySelector('.gal-stage')
      const unit = () => stage.clientWidth / STAGE.w
      const inners = gsap.utils.toArray('.gal-book-inner')

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      tl.to('.gal-panel', { opacity: 0, duration: 1 }, 0.1)
        .to('.gal-head', { y: () => -290 * unit(), opacity: 0, duration: 0.7 }, 0)
        .to(inners, {
          x: (i) => (BOOKS[i].grid.x - BOOKS[i].fan.x) * unit(),
          y: (i) => (BOOKS[i].grid.y - BOOKS[i].fan.y) * unit(),
          rotation: (i) => BOOKS[i].grid.r,
          scale: GRID_SCALE,
          duration: 1,
          stagger: 0.03,
        }, 0.15)
        .fromTo('.gal-copy', { x: -80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7 }, 0.55)
    })
    return () => mm.revert()
  }, { scope: container })

  return (
    <section ref={container} className="px-(--pad) py-(--pad)">
      <div className="gal-stage relative lg:motion-safe:aspect-[1918/925]">
        {/* Blue panel with the diagonal brush stroke */}
        <div className="gal-panel panel absolute inset-0 bg-sky" aria-hidden="true">
          <img
            src={brush}
            alt=""
            className="absolute top-[-25.7%] left-[-28.7%] w-[156%] max-w-none rotate-[-34.24deg]"
          />
        </div>

        <div className="gal-head relative px-(--gutter) pt-[max(40px,calc(140*var(--u)))] text-center lg:px-[calc(220*var(--u))]">
          <h2 className="t-h3 text-accent [overflow-wrap:anywhere] max-sm:text-[24px]">#MadewithCambridgebookpublic</h2>
          <p className="t-body mt-[max(8px,calc(12*var(--u)))] text-muted">
            Edited, designed, and published – every title here is proof of what we do.
          </p>
        </div>

        {/* Books: absolute fan on desktop, horizontal rail otherwise */}
        <ul className="no-scrollbar relative mt-8 flex gap-4 overflow-x-auto px-(--gutter) pb-10 lg:motion-safe:absolute lg:motion-safe:inset-0 lg:motion-safe:m-0 lg:motion-safe:block lg:motion-safe:overflow-visible lg:motion-safe:p-0">
          {BOOKS.map((book, i) => (
            <li
              key={i}
              className="w-[150px] shrink-0 lg:motion-safe:absolute lg:motion-safe:w-[12.66%] lg:motion-safe:-translate-x-1/2 lg:motion-safe:-translate-y-1/2"
              style={{ left: pct(book.fan.x, STAGE.w), top: pct(book.fan.y, STAGE.h) }}
            >
              <div className="gal-book-inner lg:motion-safe:rotate-(--r)" style={{ "--r": `${book.fan.r}deg` }}>
                <img
                  src={book.src}
                  alt={book.alt}
                  className="aspect-[1800/2700] w-full rounded-[max(8px,calc(14*var(--u)))] object-cover shadow-[0_20px_40px_rgba(8,26,58,0.18)]"
                />
              </div>
            </li>
          ))}
        </ul>

        {/* Copy block for the second state */}
        <div className="gal-copy relative flex flex-col gap-[max(16px,calc(24*var(--u)))] px-(--gutter) pb-10 lg:motion-safe:absolute lg:motion-safe:top-[48.7%] lg:motion-safe:left-[5.68%] lg:motion-safe:w-[46%] lg:motion-safe:-translate-y-1/2 lg:motion-safe:px-0 lg:motion-safe:pb-0">
          <h2 className="t-h2 text-navy">
            You bring the story.<br />We bring the expertise.
          </h2>
          <ul className="flex flex-col gap-[max(16px,calc(32*var(--u)))] lg:w-[92%]">
            {POINTS.map((p) => (
              <li key={p.title}>
                <p className="t-h4 text-accent">{p.title}</p>
                <p className="t-body text-navy">{p.text}</p>
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-[linear-gradient(110deg,#0063c2_7%,#014e98_105%)] px-[max(16px,calc(22*var(--u)))] py-[max(10px,calc(13*var(--u)))] font-nunito text-[max(14px,calc(18*var(--u)))] font-extrabold tracking-[-0.03em] text-white transition-opacity hover:opacity-90"
          >
            see what we can do
            <img src={arrowWhite} alt="" className="w-[max(18px,calc(24*var(--u)))] transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Gallery
