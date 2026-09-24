import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './BookShowcase.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Placeholder artwork. Add a local image import as `src` to replace a cover.
// Pending: real cover exports from Figma.
const sampleBooks = [
  { title: 'The Wild Atlas', author: 'Mira Lane', color: '#153f38', accent: '#bdd69c' },
  { title: 'Half of a Sun', author: 'Noah Reed', color: '#69412b', accent: '#eed4a0' },
  { title: 'The Quiet Hours', author: 'Elena West', color: '#192f46', accent: '#acd3cf' },
  { title: 'Somewhere North', author: 'Owen Ellis', color: '#493755', accent: '#deb4c5' },
  { title: 'A Spark Remains', author: 'Isla Rivers', color: '#793f29', accent: '#ffce83' },
  { title: 'Beyond the Pines', author: 'Theo Wells', color: '#2e4035', accent: '#d7d6a2' },
  { title: 'Golden Days', author: 'Ada Brooks', color: '#9a642e', accent: '#ffe5a1' },
]

const benefits = [
  ['Author first', 'Your voice remains at the centre of the publishing process.'],
  ['End-to-end support', 'From editing and design to publishing and distribution.'],
  ['Professional quality', 'Specialists who know what it takes to create a polished book.'],
  ['Clear & transparent', 'Straightforward plans, pricing and communication.'],
]

export default function BookShowcase({ books = sampleBooks }) {
  const root = useRef(null)
  const stage = useRef(null)

  useGSAP(() => {
    const media = gsap.matchMedia()

    // 1. Rebuild on breakpoint / accessibility changes; GSAP reverts old styles.
    media.add({
      desktop: '(min-width: 900px)',
      mobile: '(max-width: 899px)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { mobile, reduced } = context.conditions
      const select = gsap.utils.selector(root)
      const cards = select('[data-book]')
      const copy = select('[data-copy]')
      // Always start from the CSS end layout, including after a rebuild.
      gsap.set([...cards, ...copy, ...select('[data-panel], [data-intro]')], {
        clearProps: 'transform,opacity,visibility',
      })

      // The unanimated CSS layout is already the complete, readable end state.
      if (reduced) return

      // 2. A paused timeline lets ScrollTrigger drive time.
      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 1.8, ease: 'power2.inOut' },
      })

      // 3. Cards live in their final CSS grid positions. These functions calculate
      //    the transform needed to move each one BACK to the opening fan.
      //    Animate transforms, not React state or seven different DOM copies.
      tl.fromTo(cards, {
        autoAlpha: 1,
        x: (i, card) => stage.current.clientWidth * (0.075 + i * 0.12) - card.offsetLeft,
        y: (i, card) => stage.current.clientHeight * ((mobile ? 0.25 : 0.39) + Math.abs(i - 3) * 0.012) - card.offsetTop,
        rotation: (i) => (i - 3) * 6,
        scale: (i, card) => stage.current.clientWidth * (mobile ? 0.18 : 0.145) / card.offsetWidth,
      }, {
        x: (i, card) => i === 6 ? stage.current.clientWidth * 1.15 - card.offsetLeft : 0,
        autoAlpha: (i) => i === 6 ? 0 : 1,
        y: 0, rotation: 0, scale: 1,
        stagger: { each: 0.045, from: 'start' },
      }, 0.25)

      // 4. Labels are named moments. All tweens at "reveal" start together.
      tl.addLabel('reveal', 0.45)
        .fromTo('[data-panel]', { opacity: 1 }, { opacity: 0, duration: 1.3 }, 'reveal')
        .fromTo('[data-intro]', { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -35, duration: 0.65 }, 'reveal')
        .fromTo(copy, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.09 }, 'reveal+=0.5')

      // 5. Index 6 exits/fades in the SAME card tween above. One tween owns each
      //    property, so backward seeking restores the fan reliably.

      tl.progress(0)

      // 6. Pin the stage and map scroll to timeline. Exact trigger points are
      //    still our own choice; confirm them against the Figma prototype.
      ScrollTrigger.create({
        trigger: stage.current,
        start: 'top 16px',
        end: () => `+=${window.innerHeight * 1.5}`,
        pin: true,
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true,
      })
    }, root)

    // 7. Removes the timeline, pin spacer and ScrollTrigger on unmount.
    return () => media.revert()
  }, { scope: root, dependencies: [books], revertOnUpdate: true })

  return (
    <section ref={root} className="showcase-page">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6">
        <div id="showcase" ref={stage} className="book-stage" aria-label="From a collection of stories to your publishing partner">
          <div data-panel className="fan-panel" aria-hidden="true"><div className="panel-orbit" /></div>
          <div data-intro className="fan-intro">
            <p className="eyebrow">A shelf full of possibilities</p>
            <h2>Every story deserves<br className="sm:hidden" /> its place.</h2>
            <p>Ideas, imagined and published. Yours could be next.</p>
          </div>

          <div className="showcase-copy">
            <h2 data-copy>You bring the story.<br />We bring the expertise.</h2>
            <dl>
              {benefits.map(([title, description]) => (
                <div key={title} data-copy><dt>{title}</dt><dd>{description}</dd></div>
              ))}
            </dl>
            {/* Pending: the CTA destination is not yet confirmed from Figma. */}
            <a data-copy href="#" className="explore-link">See what we can do <span aria-hidden="true">&rarr;</span></a>
          </div>

          <ul className="book-layer" aria-label="Sample book collection">
            {books.slice(0, 7).map((book, index) => (
              <li data-book key={book.title} className={`book book-${index}`} style={{ '--cover': book.color, '--ink': book.accent }}>
                {book.src ? (
                  <img src={book.src} alt={book.title} width="280" height="420" />
                ) : (
                  <div className="sample-cover">
                    <span className="cover-edition">The independent collection</span>
                    <span className="cover-title">{book.title}</span>
                    <span className={`cover-art art-${index % 3}`} aria-hidden="true" />
                    <span className="cover-author">{book.author}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
