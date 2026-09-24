import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'
import before from '../../assets/authors/before.png'
import after from '../../assets/authors/after.jpg'
import avatar from '../../assets/authors/avatar.jpg'
import arrowCurve from '../../assets/authors/arrow-curve.svg'
import arrowWhite from '../../assets/gallery/arrow-white-24.svg'

// "Author Stories" — a before/after cover reveal. The arrows replay it,
// since the comp only carries one story.
function AuthorStories() {
  const container = useRef(null)
  const reveal = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.story-card', start: 'top 75%', once: true },
        defaults: { ease: 'power3.out' },
      })
      tl.from('.story-before', { x: -40, opacity: 0, duration: 0.7 })
        .from('.story-arrow', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.2')
        .from('.story-after', { x: 40, rotationY: -35, opacity: 0, duration: 0.8 }, '-=0.2')
        .from('.story-quote > *', { y: 24, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
      reveal.current = tl
      return () => { reveal.current = null }
    })
    return () => mm.revert()
  }, { scope: container })

  const replay = () => reveal.current?.restart()

  return (
    <section ref={container} className="flex flex-col items-center gap-[max(20px,calc(32*var(--u)))] px-(--pad) pt-[max(60px,calc(180*var(--u)))] pb-[max(48px,calc(100*var(--u)))] lg:px-[calc(150*var(--u))]">
      <h2 className="t-h2 text-navy" data-reveal>Author Stories</h2>

      <div className="story-card w-full overflow-clip rounded-[max(28px,calc(90*var(--u)))] bg-navy">
        <p className="t-h4 px-6 py-[max(16px,calc(24*var(--u)))] text-center text-white">From Personal Story to Bestseller</p>
        <div className="flex flex-col items-center gap-10 rounded-[max(28px,calc(90*var(--u)))] bg-[#ecf2f9] px-(--gutter) py-[max(32px,calc(60*var(--u)))] lg:flex-row lg:justify-between lg:px-[calc(120*var(--u))]">
          <div className="flex items-center gap-[max(12px,calc(30*var(--u)))] [perspective:1200px]">
            <figure className="story-before flex flex-col items-center gap-[calc(15*var(--u))]">
              <figcaption className="font-serif text-[max(14px,calc(19.5*var(--u)))] leading-[1.2] font-black tracking-[-0.05em] text-navy">Before</figcaption>
              <div className="grid aspect-[262/390] w-[max(120px,calc(262*var(--u)))] place-items-center rounded-[max(12px,calc(24*var(--u)))] border-[max(3px,calc(6.5*var(--u)))] border-sky bg-[#fefefe]">
                <img src={before} alt="Hand-drawn cover sketch" className="h-[80.5%] w-auto object-cover" />
              </div>
            </figure>
            <img src={arrowCurve} alt="" className="story-arrow mt-[calc(40*var(--u))] w-[max(48px,calc(125*var(--u)))] shrink-0" />
            <figure className="story-after flex flex-col items-center gap-[calc(15*var(--u))]">
              <figcaption className="font-serif text-[max(14px,calc(19.5*var(--u)))] leading-[1.2] font-black tracking-[-0.05em] text-navy">After</figcaption>
              <img
                src={after}
                alt="Austen Walker and the Cosmic Creature Captain, finished cover"
                className="aspect-[262/390] w-[max(120px,calc(262*var(--u)))] rounded-[max(12px,calc(24*var(--u)))] object-cover"
              />
            </figure>
          </div>

          <blockquote className="story-quote flex flex-col gap-[max(16px,calc(24*var(--u)))] lg:w-[calc(545*var(--u))]">
            <p className="t-h5 text-muted">
              Hi I'm the author of Chrissy the poodle gets adopted and I use the publisher Cambridge and I was very satisfied and I'm going to use it for my sequel so thank you so much Cambridge book publishing and we'll talk to you soon.
            </p>
            <footer className="flex items-center gap-2">
              <img src={avatar} alt="" className="size-[max(44px,calc(65*var(--u)))] rounded-full object-cover" />
              <cite className="font-display text-[max(17px,calc(27*var(--u)))] leading-[1.4] font-semibold tracking-[-0.03em] text-navy not-italic">Etta Netherton</cite>
            </footer>
          </blockquote>
        </div>
      </div>

      <div className="flex gap-1.5">
        <button type="button" onClick={replay} aria-label="Replay the before and after" className="grid size-[max(40px,calc(56*var(--u)))] cursor-pointer place-items-center rounded-full bg-[#124a8a]/40 transition-colors hover:bg-[#124a8a]/60">
          <img src={arrowWhite} alt="" className="w-[max(18px,calc(24*var(--u)))] rotate-180" />
        </button>
        <button type="button" onClick={replay} aria-hidden="true" tabIndex={-1} className="grid size-[max(40px,calc(56*var(--u)))] cursor-pointer place-items-center rounded-full bg-[#124a8a] transition-colors hover:bg-accent">
          <img src={arrowWhite} alt="" className="w-[max(18px,calc(24*var(--u)))]" />
        </button>
      </div>
    </section>
  )
}

export default AuthorStories
