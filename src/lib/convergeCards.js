import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * The prototype's signature move: a row of cards sits spread far apart on a very
 * wide track and gathers into place as the section scrolls up.
 *
 * In Figma it is a smart-animate between two frames where every card sits the
 * same multiple further from the row centre — the row is scaled horizontally
 * about its middle, while the cards keep their own size and tilt. Nothing
 * fades, and all four land together (the outer pair simply travels ~3x as far).
 * Here that scaling is driven by scroll instead of a click.
 *
 * Offsets are read with offsetLeft rather than getBoundingClientRect, so they
 * stay in design pixels no matter what <DesignCanvas> is scaled to.
 *
 * @param cards  the elements to move — one wrapper per card
 * @param spread how far apart the row starts, as a multiple of its final width
 * @param trigger element whose entry drives the gather
 */
export const convergeCards = (cards, { spread, trigger, start = 'top bottom', end = 'top 55%' }) => {
  const measure = () => {
    const last = cards[cards.length - 1]
    const rowCentre = (cards[0].offsetLeft + last.offsetLeft + last.offsetWidth) / 2
    return cards.map((el) => el.offsetLeft + el.offsetWidth / 2 - rowCentre)
  }

  let offsets = measure()

  return gsap.from(cards, {
    x: (i) => offsets[i] * (spread - 1),
    ease: 'none',
    scrollTrigger: {
      trigger,
      start,
      end,
      // Enough smoothing to trail the scroll, little enough that the cards are
      // settled as soon as the step lands.
      scrub: 0.4,
      invalidateOnRefresh: true,
      // Re-measure at the resting positions, not mid-gather.
      onRefreshInit: () => {
        gsap.set(cards, { x: 0 })
        offsets = measure()
      },
    },
  })
}
