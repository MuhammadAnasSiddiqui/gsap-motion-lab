import React from 'react'

const ProcessCard = ({ step, title, description, image, placeholder, color, cardRef, onEnter, onLeave }) => {
  return (
    <article
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative flex w-full max-w-[360px] flex-col rounded-[32px] px-7 pt-6 pb-10 shadow-[0_20px_50px_-30px_rgba(11,22,56,0.35)] will-change-transform sm:min-h-[520px]"
      style={{ backgroundColor: color }}
    >
      <p className="text-center font-hand text-lg text-ink">Step#{step}</p>

      <div className="my-6 flex h-48 items-center justify-center">
        {image ? (
          <img src={image} alt="" className="h-full w-auto object-contain" loading="lazy" />
        ) : (
          // Replace with the 3D illustration: pass `image` in the steps data.
          <div className="flex size-40 items-center justify-center rounded-full bg-white/50 text-7xl">
            {placeholder}
          </div>
        )}
      </div>

      <h3 className="font-display text-2xl leading-tight font-bold text-ink">{title}</h3>
      <p className="mt-5 text-[17px] leading-relaxed text-ink/90">{description}</p>
    </article>
  )
}

export default ProcessCard
