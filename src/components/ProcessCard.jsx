import React from 'react'

// Figma: 360x530 unrotated, 32px radius. Text colour #090c24 throughout.
export const CARD_WIDTH = 360
export const CARD_HEIGHT = 530

const ProcessCard = ({ step, title, description, image, placeholder, color, cardRef, onEnter, onLeave }) => {
  return (
    <article
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="js-process-card relative flex flex-col items-center rounded-[32px] shadow-[0_20px_50px_-30px_rgba(11,22,56,0.35)] will-change-transform"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT, backgroundColor: color, padding: 40 }}
    >
      <p
        className="font-hand text-[#090c24]"
        style={{ fontSize: 20, lineHeight: '24px' }}
      >{`Step#${step}`}</p>

      <div
        className="mt-3 flex items-center justify-center"
        style={{ width: 274, height: 250 }}
      >
        {image ? (
          <img src={image} alt="" className="h-full w-auto object-contain" loading="lazy" />
        ) : (
          <div className="flex size-40 items-center justify-center rounded-full bg-white/50 text-7xl">
            {placeholder}
          </div>
        )}
      </div>

      <h3
        className="mt-3 w-full font-heading font-semibold text-[#090c24]"
        style={{ fontSize: 28, lineHeight: '28px' }}
      >
        {title}
      </h3>

      <p
        className="mt-4 w-full text-[#090c24]"
        style={{ fontSize: 20, lineHeight: '28px' }}
      >
        {description}
      </p>
    </article>
  )
}

export default ProcessCard
