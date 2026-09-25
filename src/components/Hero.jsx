import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import Header from './Header'
import CtaButton from './CtaButton'
import cloudBlob from '../assets/hero/cloud-blob.svg'
import heroBackground from '../assets/hero/hero-background.svg'
import clouds from '../assets/hero/clouds.png'
import book from '../assets/hero/book.png'
import backArrow from '../assets/hero/back-arrow.svg'
import scrollArrow from '../assets/hero/scroll-arrow.svg'


// Layout follows the 1920x1000 comp. Background art is positioned as a
// percentage of that box; type and spacing scale with --u (see index.css).
function Hero() {
  const container = useRef(null)
  const intro = useRef(null)

  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      // Entrance: art settles, header drops in, headline lines wipe up,
      // copy + CTA follow, book slides in from the right.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-art', { opacity: 0, scale: 1.05, duration: 1.4, ease: 'power2.out' }, 0)
        .from('.hero-clouds', { xPercent: -12, opacity: 0, duration: 1.6, ease: 'power2.out' }, 0.2)
        .from('.hero-header > *', { y: -24, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.2)
        .from('.hero-line', { yPercent: 120, duration: 1.1, ease: 'power4.out', stagger: 0.14 }, 0.35)
        .from('.hero-sub', { y: 28, opacity: 0, duration: 0.9 }, 0.75)
        .from('.hero-cta', { y: 24, opacity: 0, scale: 0.95, duration: 0.7, ease: 'back.out(1.7)' }, 0.9)
        .from('.hero-book', { xPercent: 20, yPercent: 8, rotation: 8, opacity: 0, duration: 1.4 }, 0.45)
        .from('.hero-aside', { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 }, 1.1)
      intro.current = tl

      // Ambient loops live on inner wrappers so they never fight the
      // entrance tweens or the parallax for the same transform property.
      gsap.to('.hero-book-float', { y: -18, rotation: 1.5, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.hero-clouds-drift', { xPercent: 4, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.hero-scroll-arrow', { y: 5, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })

      return () => { intro.current = null }
    })

    // Pointer parallax: each [data-depth] layer drifts with the cursor.
    media.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
      const layers = gsap.utils.toArray('[data-depth]').map((el) => ({
        depth: Number(el.dataset.depth),
        x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }),
      }))
      const onMove = (event) => {
        const nx = (event.clientX / window.innerWidth - 0.5) * 2
        const ny = (event.clientY / window.innerHeight - 0.5) * 2
        layers.forEach(({ depth, x, y }) => { x(nx * 24 * depth); y(ny * 16 * depth) })
      }
      const onLeave = () => layers.forEach(({ x, y }) => { x(0); y(0) })
      const el = container.current
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      return () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      }
    })

    return () => media.revert()
  }, { scope: container })

  const scrollPastHero = () => {
    const el = container.current
    if (el) window.scrollTo({ top: el.offsetHeight, behavior: 'smooth' })
  }

  return (
    <section
      ref={container}
      className="relative isolate overflow-clip rounded-b-[max(40px,calc(150*var(--u)))] bg-sky"
    >
      {/* Background art (Vector 9 blob + gradient waves, glows and sparkles).
          Below lg the panel is taller than the comp ratio, so the art keeps
          its own ratio and hugs the bottom edge instead of stretching. */}
      <div
        className="hero-art pointer-events-none absolute bottom-0 left-[-65%] aspect-[1920/1000] w-[230%] lg:inset-0 lg:aspect-auto lg:w-auto"
        data-depth="0.25"
        aria-hidden="true"
      >
        <img src={cloudBlob} alt="" className="absolute top-[-8.8%] left-[-8.85%] w-[39.2%] max-w-none" />
        <img src={heroBackground} alt="" className="absolute top-[-53.14%] left-[-9.01%] w-[145.54%] max-w-none" />
      </div>

      {/* Cloud bank, colour-burned into the sky like the comp */}
      <div
        className="hero-clouds pointer-events-none absolute bottom-[-4%] left-[-5.21%] z-10 w-[90%] max-w-none mix-blend-color-burn lg:top-[61.2%] lg:bottom-auto lg:w-[45.57%]"
        data-depth="0.5"
        aria-hidden="true"
      >
        <div className="hero-clouds-drift">
          <img src={clouds} alt="" className="block w-full max-w-none" />
        </div>
      </div>

      <Header />

      {/* Content band: centred in the 40-1000px region of the comp */}
      <div className="relative flex flex-col justify-center px-(--gutter) pt-32 pb-28 lg:min-h-[max(640px,calc(1000*var(--u)))] lg:pt-[calc(40*var(--u))] lg:pb-0">
        <div className="relative z-[5] flex flex-col items-start gap-[max(20px,calc(42*var(--u)))] lg:max-w-[calc(1226*var(--u))]">
          <h1 className="font-display text-[max(44px,calc(120*var(--u)))] leading-none font-extrabold text-navy">
            <span className="-mb-[0.15em] block overflow-hidden pb-[0.15em]">
              <span className="hero-line block">Your Story Deserves</span>
            </span>
            <span className="-mb-[0.15em] block overflow-hidden pb-[0.15em]">
              <span className="hero-line block">To Be A Book.</span>
            </span>
          </h1>
          <p className="hero-sub max-w-[max(22rem,calc(908*var(--u)))] font-body text-[max(18px,calc(40*var(--u)))] leading-[1.4] tracking-[-0.4px] text-muted">
            We are here to help. Our editors will make the difficult process of publication easier for you.
          </p>
          <CtaButton className="hero-cta" />
        </div>

        {/* Floating hardcover */}
        <div
          className="hero-book relative z-20 mx-auto mt-12 w-[min(72%,420px)] lg:absolute lg:top-[26.6%] lg:left-[65.35%] lg:mx-0 lg:mt-0 lg:w-[25.63%]"
          data-depth="1"
        >
          <div className="hero-book-float">
            <img
              src={book}
              alt="Hardcover book titled 10 Reasons to Choose Cambridge for Book Publishing"
              className="block w-full drop-shadow-[0_24px_36px_rgba(8,26,58,0.18)]"
            />
          </div>
        </div>
      </div>

      {/* Back control, bottom-left in the comp; here it replays the intro */}
      <button
        type="button"
        onClick={() => intro.current?.restart()}
        aria-label="Replay intro"
        className="hero-aside absolute bottom-[max(20px,calc(54*var(--u)))] left-(--gutter) z-30 grid size-[max(44px,calc(60*var(--u)))] cursor-pointer place-items-center rounded-full bg-gold transition-colors hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
      >
        <img src={backArrow} alt="" className="block w-[max(22px,calc(30*var(--u)))] rotate-180" />
      </button>

      {/* "Tap to Scroll" pill, right edge, vertically centred */}
      <button
        type="button"
        onClick={scrollPastHero}
        className="group hero-aside absolute top-[52%] right-0 z-30 hidden w-11 -translate-y-1/2 cursor-pointer flex-col items-center gap-2 rounded-full bg-white/60 py-6 transition-colors hover:bg-white focus-visible:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy lg:flex"
      >
        <span className="rotate-180 font-body text-[20px] leading-[1.4] whitespace-nowrap text-navy/60 transition-colors group-hover:text-navy group-focus-visible:text-navy [writing-mode:vertical-rl]">
          Tap to Scroll
        </span>
        <img src={scrollArrow} alt="" className="hero-scroll-arrow block w-[22px] rotate-90 opacity-60 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
      </button>
    </section>
  )
}

export default Hero
