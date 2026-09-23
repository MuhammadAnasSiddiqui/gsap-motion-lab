import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Blurs a section so the one arriving reads as being in front of it. The
 * section stays on screen — it is only pushed out of focus, never hidden.
 *
 * By default it blurs as it leaves the top of the screen. Pass a trigger to tie
 * the blur to the arrival of the next section instead, which is what a short
 * section resting on the bottom edge needs.
 *
 * The radius is in design pixels: the filter is applied before <DesignCanvas>
 * scales the element, so it shrinks with everything else.
 */
export const blurOnExit = (
  el,
  { amount = 12, trigger = el, start = 'bottom bottom', end = 'bottom top' } = {}
) =>
  gsap.fromTo(
    el,
    { filter: 'blur(0px)' },
    {
      filter: `blur(${amount}px)`,
      ease: 'none',
      scrollTrigger: { trigger, start, end, scrub: true, invalidateOnRefresh: true },
    }
  )
