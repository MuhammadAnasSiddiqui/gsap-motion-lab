import React from 'react'

/**
 * The yellow pill button, measured off the design export pixel by pixel:
 *
 *   box     430x80, fully rounded, #f3cd5a
 *   label   Merculia 600 at 23px, ink starting 24px in from the left, one line
 *   disc    60x60 white, 16px in from the right (so 10px top and bottom)
 *   arrow   24x20 of ink on a 4px stroke, centred in the disc
 *
 * Laid out with padding rather than absolute children, so the caller stays free
 * to position the button however it likes.
 */
const WIDTH = 430
const HEIGHT = 80
const FONT_SIZE = 23
const PAD_LEFT = 24
const PAD_RIGHT = 16
const DISC = 60
const ICON = 32

const CtaButton = ({
  label = 'Start Your Publishing Journey',
  href = '#start',
  className = '',
  style,
  ...rest
}) => (
  <a
    href={href}
    className={`group flex items-center justify-between rounded-full bg-cta transition-shadow hover:shadow-[0_12px_30px_-10px_rgba(242,208,90,0.9)] ${className}`}
    style={{ width: WIDTH, height: HEIGHT, paddingLeft: PAD_LEFT, paddingRight: PAD_RIGHT, ...style }}
    {...rest}
  >
    <span
      className="font-heading font-semibold whitespace-nowrap text-navy"
      style={{ fontSize: FONT_SIZE, lineHeight: '28px' }}
    >
      {label}
    </span>

    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-white text-navy transition-transform duration-300 group-hover:translate-x-1"
      style={{ width: DISC, height: DISC }}
    >
      {/* Endpoints inset by half the stroke so the ink measures exactly 24x20. */}
      <svg
        viewBox="0 0 32 32"
        style={{ width: ICON, height: ICON }}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 16h20M18 8l8 8-8 8" />
      </svg>
    </span>
  </a>
)

export default CtaButton
