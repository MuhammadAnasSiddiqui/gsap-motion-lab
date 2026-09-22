import arrowRight from '../assets/hero/arrow-right.svg'

// Gold pill CTA from the comp: 80px tall, 23px Merculia Semibold, 60px white
// icon disc with a 32px arrow. All sizes scale with --u and floor for mobile.
function CtaButton({ label = 'Start Your Publishing Journey', href = '#', className = '' }) {
  return (
    <a
      href={href}
      className={`group inline-flex h-[max(52px,calc(80*var(--u)))] items-center gap-[max(8px,calc(12*var(--u)))] rounded-full bg-gold pl-[max(16px,calc(24*var(--u)))] pr-[max(8px,calc(16*var(--u)))] font-display text-[max(15px,calc(23*var(--u)))] font-semibold leading-[1.2] text-navy transition-colors hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy ${className}`}
    >
      <span className="whitespace-nowrap">{label}</span>
      <span className="grid size-[max(40px,calc(60*var(--u)))] shrink-0 place-items-center rounded-full bg-white">
        <img
          src={arrowRight}
          alt=""
          className="block w-[max(20px,calc(32*var(--u)))] transition-transform duration-300 ease-out group-hover:translate-x-1"
        />
      </span>
    </a>
  )
}

export default CtaButton
