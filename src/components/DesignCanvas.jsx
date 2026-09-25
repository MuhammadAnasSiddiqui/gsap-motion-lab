import React, { useLayoutEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { canvasScale, DESIGN_WIDTH } from '../lib/design'

/**
 * Renders its children on a fixed 1920px-wide canvas and scales that canvas to
 * the viewport width — the web equivalent of the prototype's "scale down width"
 * with fixed content scaling. Children can therefore use Figma's pixel values
 * verbatim and stay pixel-accurate at any window size.
 *
 * The outer element carries the scaled height so the document scrolls by the
 * right amount; the canvas itself is taken out of flow.
 */
const DesignCanvas = ({ children }) => {
  const outer = useRef(null)
  const canvas = useRef(null)

  useLayoutEffect(() => {
    const el = canvas.current
    let lastHeight = 0

    const apply = () => {
      const scale = canvasScale()
      const height = el.offsetHeight

      el.style.transform = `scale(${scale})`
      outer.current.style.height = `${height * scale}px`
      document.documentElement.style.setProperty('--design-scale', scale)

      // Only bother ScrollTrigger when the layout really moved.
      if (height !== lastHeight) {
        lastHeight = height
        ScrollTrigger.refresh()
      }
    }

    apply()

    const observer = new ResizeObserver(apply)
    observer.observe(el)
    window.addEventListener('resize', apply)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', apply)
    }
  }, [])

  return (
    <div ref={outer} data-design-canvas className="relative w-full overflow-x-clip">
      <div
        ref={canvas}
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: DESIGN_WIDTH }}
      >
        {children}
      </div>
    </div>
  )
}

export default DesignCanvas
