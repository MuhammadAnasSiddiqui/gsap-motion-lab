import { gsap, useGSAP, MOTION_OK } from './gsap'

// Generic scroll reveals. Mark an element with `data-reveal` to fade/rise it
// in when it enters the viewport, or `data-reveal-stagger` on a parent to
// stagger its direct children. Sections with bespoke motion don't use these
// on the elements they already animate.
export function useReveal(scope) {
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray('[data-reveal]', scope.current).forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: Number(el.dataset.revealDelay || 0),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
      gsap.utils.toArray('[data-reveal-stagger]', scope.current).forEach((group) => {
        gsap.from(group.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        })
      })
    })
    return () => mm.revert()
  }, { scope })
}
