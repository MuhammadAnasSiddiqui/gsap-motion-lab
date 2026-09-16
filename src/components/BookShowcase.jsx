import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './BookShowcase.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Learning artwork only. Add a local image import as `src` to replace a cover.
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
  const timeline = useRef(null)
  const progress = useRef(null)
  const readout = useRef(null)
  const [mode, setMode] = useState('timeline')
  const [playing, setPlaying] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

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
      // Always start from the CSS end layout, including after a mode switch.
      gsap.set([...cards, ...copy, ...select('[data-panel], [data-intro]')], {
        clearProps: 'transform,opacity,visibility',
      })
      setReduceMotion(reduced)
      setPlaying(false)

      if (reduced) {
        // The unanimated CSS layout is already the complete, readable end state.
        progress.current.value = '100'
        readout.current.textContent = '100%'
        return
      }

      // 2. A paused timeline lets Play, the slider OR ScrollTrigger drive time.
      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 1.8, ease: 'power2.inOut' },
        onUpdate: () => {
          const value = Math.round(tl.progress() * 100)
          progress.current.value = String(value)
          readout.current.textContent = `${value}%`
        },
        onComplete: () => setPlaying(false),
      })
      timeline.current = tl

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
      //    property, so restart and backward seeking restore the fan reliably.

      tl.progress(0)
      if (mode === 'scroll') {
        // Our implementation choice: pin the stage and map scroll to timeline.
        // The recording shows the transition, but not its original Figma trigger.
        ScrollTrigger.create({
          trigger: stage.current,
          start: 'top 16px',
          end: () => `+=${window.innerHeight * 1.5}`,
          pin: true,
          scrub: 0.6,
          animation: tl,
          invalidateOnRefresh: true,
        })
      }

      // Keep the current visual progress when resizing in manual mode.
      let resizeTimer
      const resize = () => {
        if (mode === 'scroll') return // ScrollTrigger refreshes its own geometry.
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          const current = tl.progress()
          tl.invalidate().progress(current)
        }, 120)
      }
      window.addEventListener('resize', resize)
      return () => {
        clearTimeout(resizeTimer)
        window.removeEventListener('resize', resize)
        timeline.current = null
      }
    }, root)

    // 6. Removes the timeline, pin spacer and listeners on unmount/mode change.
    return () => media.revert()
  }, { scope: root, dependencies: [mode, books], revertOnUpdate: true })

  const play = () => {
    if (!timeline.current) return
    if (playing) {
      timeline.current.pause()
      setPlaying(false)
    } else {
      if (timeline.current.progress() === 1) timeline.current.restart()
      else timeline.current.play()
      setPlaying(true)
    }
  }

  const replay = () => {
    timeline.current?.restart()
    setPlaying(true)
  }

  return (
    <main ref={root} className="showcase-page">
      <header className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10">
        <a className="brand" href="#showcase">Cambridge<span>Publishing / motion study</span></a>
        <div className="mode-switch" role="group" aria-label="Animation control mode">
          {['timeline', 'scroll'].map((value) => (
            <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)}>
              {value === 'timeline' ? 'Timeline demo' : 'Scroll demo'}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-3 sm:px-6">
        <section id="showcase" ref={stage} className="book-stage" aria-label="From a collection of stories to your publishing partner">
          <div data-panel className="fan-panel" aria-hidden="true"><div className="panel-orbit" /></div>
          <div data-intro className="fan-intro">
            <p className="eyebrow">A shelf full of possibilities</p>
            <h1>Every story deserves<br className="sm:hidden" /> its place.</h1>
            <p>Ideas, imagined and published. Yours could be next.</p>
          </div>

          <div className="showcase-copy">
            <h2 data-copy>You bring the story.<br />We bring the expertise.</h2>
            <dl>
              {benefits.map(([title, description]) => (
                <div key={title} data-copy><dt>{title}</dt><dd>{description}</dd></div>
              ))}
            </dl>
            <a data-copy href="#next-step" className="explore-link">See what we can do <span aria-hidden="true">&rarr;</span></a>
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
          <span className="stage-caption">{books === sampleBooks ? 'Study edition · sample cover artwork' : 'Publishing collection'}</span>
          <span className="stage-number" aria-hidden="true">01 — 07</span>
        </section>

        <div className="playback-bar">
          <div className="flex items-center gap-2">
            <button className="play-button" type="button" onClick={play} disabled={reduceMotion || mode === 'scroll'}>{playing ? 'Pause' : 'Play transition'}</button>
            <button className="replay-button" type="button" onClick={replay} disabled={reduceMotion || mode === 'scroll'}>Replay</button>
          </div>
          <label className="progress-control">Progress
            <input ref={progress} type="range" min="0" max="100" defaultValue="0" disabled={reduceMotion || mode === 'scroll'} onChange={(event) => {
              timeline.current?.pause().progress(Number(event.target.value) / 100)
              setPlaying(false)
            }} />
            <output ref={readout}>0%</output>
          </label>
          <p className="playback-hint" role="status">{reduceMotion ? 'Reduced motion: final layout shown.' : mode === 'scroll' ? 'Scroll down to transform. Scroll up to reverse.' : 'Press play, or drag progress to explore the transition.'}</p>
        </div>
      </div>

      <section id="next-step" className="next-step mx-auto max-w-[1440px] px-6 py-20 sm:px-10">
        <p className="eyebrow">Your next chapter</p>
        <h2>From the first idea<br />to the finished book.</h2>
        <p>Author-first support, thoughtful design, and a story that stays yours.</p>
        <a href="#showcase">Back to the collection <span aria-hidden="true">&uarr;</span></a>
      </section>
    </main>
  )
}
