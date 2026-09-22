import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'
import bookSpin from '../../assets/animation/book-spin.png'

// In Figma this is a video of a hardcover turning. We only get a frame, so
// the frame is scrubbed through a perspective tilt as it passes the viewport.
function BookSpin() {
  const container = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        '.spin-book',
        { rotationY: -28, rotationX: 4, scale: 0.92 },
        {
          rotationY: 28,
          rotationX: -4,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: container.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        },
      )
    })
    return () => mm.revert()
  }, { scope: container })

  return (
    <section ref={container} className="overflow-clip bg-white [perspective:1600px]">
      <img
        src={bookSpin}
        alt="Embracing Vulnerability, a hardcover published by Cambridge Book Publishing"
        className="spin-book block aspect-[1920/1080] w-full [transform-style:preserve-3d]"
      />
    </section>
  )
}

export default BookSpin
