import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * The scroll range over which a section hands over to the next one: from the
 * moment its bottom edge reaches the bottom of the screen — its last resting
 * position — to the moment that edge leaves the top.
 *
 * Returned as scroll positions rather than ScrollTrigger's "bottom bottom"
 * keywords so a section shorter than the screen cannot start part-way through
 * at scroll 0, and so nothing happens while the section is still being scrolled
 * through.
 */
export const exitRange = (el) => ({
  start: () =>
    Math.max(0, el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight),
  end: () => el.getBoundingClientRect().bottom + window.scrollY,
})

/**
 * Blurs a section so the one arriving reads as being in front of it. The
 * section stays on screen — it is only pushed out of focus, never hidden.
 *
 * Defaults to blurring as the section hands over. Pass a trigger and range to
 * tie the blur to the arrival of the next section instead, which is what a short
 * section resting on the bottom edge needs.
 *
 * The radius is in design pixels: the filter is applied before <DesignCanvas>
 * scales the element, so it shrinks with everything else.
 */
export const blurOnExit = (el, { amount = 12, trigger, start, end } = {}) => {
  const range = exitRange(el)

  return gsap.fromTo(
    el,
    { filter: 'blur(0px)' },
    {
      filter: `blur(${amount}px)`,
      ease: 'none',
      scrollTrigger: {
        trigger: trigger ?? el,
        start: start ?? range.start,
        end: end ?? range.end,
        scrub: true,
        invalidateOnRefresh: true,
      },
    }
  )
}
