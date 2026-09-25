import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'
import stars from '../../assets/testimonials/stars.svg'
import divider from '../../assets/testimonials/divider.svg'
import trustpilot from '../../assets/testimonials/trustpilot.svg'
import play24 from '../../assets/testimonials/play-24.svg'
import play32 from '../../assets/testimonials/play-32.svg'
import arrowWhite from '../../assets/gallery/arrow-white-24.svg'
import avatar1 from '../../assets/testimonials/avatar-1.jpg'
import avatar2 from '../../assets/testimonials/avatar-2.jpg'
import avatar3 from '../../assets/testimonials/avatar-3.jpg'
import avatar4 from '../../assets/testimonials/avatar-4.jpg'
import avatar5 from '../../assets/testimonials/avatar-5.jpg'
import book1 from '../../assets/testimonials/book-1.jpg'
import book2 from '../../assets/testimonials/book-2.jpg'
import book3 from '../../assets/testimonials/book-3.jpg'
import video1 from '../../assets/testimonials/video-1.jpg'
import video2 from '../../assets/testimonials/video-2.jpg'

const CARDS = [
  {
    kind: 'review',
    quote: 'My contact and guide through this first book journey has been patient and supportive with a desire to create the book that I wanted. He answered all my questions resolved any issue..',
    name: 'Chris Duffy',
    date: '18 Dec 2026',
    avatar: avatar1,
    book: book1,
    bookAlt: 'My Down to Earth Poems by A. P. Cutler',
    small: true,
  },
  { kind: 'video', name: 'Kathleen Dalton', date: '18 Dec 2026', avatar: avatar2, still: video1 },
  {
    kind: 'review',
    quote: 'I have attempted to get my book listed with a major distributor for almost three years and each ....',
    name: 'Etta Netherton',
    date: '18 Dec 2026',
    avatar: avatar3,
    book: book2,
    bookAlt: 'The Tales of Beacon Tarn by Michael Adams',
  },
  { kind: 'video', name: 'Kathleen Dalton', date: '18 Dec 2026', avatar: avatar4, still: video2, large: true },
  {
    kind: 'review',
    quote: 'My name is Tracey-Ann Beckett and I am a writer of Romantic fiction. When I finished my first.....',
    name: 'Chelle Johnson',
    date: '18 Dec 2026',
    avatar: avatar5,
    book: book3,
    bookAlt: 'A Novel by Chelle Johnson',
  },
]

function Byline({ name, date, avatar, light = false }) {
  return (
    <div className="flex items-center gap-[max(10px,calc(16*var(--u)))]">
      <img src={avatar} alt="" className="size-[max(40px,calc(53*var(--u)))] rounded-full border border-white object-cover" />
      <div className={`flex flex-col gap-0.5 font-lexend leading-[1.4] ${light ? 'text-white' : ''}`}>
        <p className={`text-[max(14px,calc(18*var(--u)))] ${light ? '' : 'text-navy'}`}>{name}</p>
        <p className={`text-[max(11px,calc(13*var(--u)))] ${light ? '' : 'text-muted'}`}>{date}</p>
      </div>
    </div>
  )
}

function ReviewCard({ card }) {
  return (
    <article className="flex h-full w-[85vw] max-w-[560px] shrink-0 snap-start overflow-clip rounded-[max(16px,calc(24*var(--u)))] border-[3px] border-border bg-white lg:w-[calc(725*var(--u))] lg:max-w-none">
      <div className="flex flex-1 flex-col justify-center gap-[max(14px,calc(24*var(--u)))] px-[max(16px,calc(24*var(--u)))] py-[max(16px,calc(24*var(--u)))]">
        <img src={stars} alt="Five stars" className="w-[max(90px,calc(120*var(--u)))]" />
        <div className="flex flex-col gap-[calc(10*var(--u))]">
          <p className={`font-body leading-[1.4] text-muted ${card.small ? 'text-[max(14px,calc(20*var(--u)))]' : 'text-[max(15px,calc(24*var(--u)))]'}`}>
            {card.quote}
          </p>
          <a href="#" className="t-body w-fit font-bold text-accent underline">Read More</a>
        </div>
        <img src={divider} alt="" className="h-px w-full" />
        <div className="flex items-center justify-between gap-6">
          <Byline name={card.name} date={card.date} avatar={card.avatar} />
          <img src={trustpilot} alt="Trustpilot" className="w-[max(64px,calc(81*var(--u)))]" />
        </div>
      </div>
      <div className="hidden p-1.5 sm:block">
        <img src={card.book} alt={card.bookAlt} className="h-full w-[max(140px,calc(264*var(--u)))] rounded-[max(16px,calc(24*var(--u)))] object-cover" />
      </div>
    </article>
  )
}

function VideoCard({ card }) {
  const pad = card.large ? 'p-[max(8px,calc(12*var(--u)))]' : 'p-1.5'
  const button = card.large ? 'size-[max(56px,calc(80*var(--u)))]' : 'size-[max(44px,calc(60*var(--u)))]'
  return (
    <article className={`shrink-0 snap-start rounded-[max(16px,calc(24*var(--u)))] border-[3px] border-border bg-white ${pad}`}>
      <button type="button" className="group relative block h-full cursor-pointer overflow-clip rounded-[max(16px,calc(24*var(--u)))]" aria-label={`Play video testimonial from ${card.name}`}>
        <img src={card.still} alt="" className="h-[max(280px,calc(393*var(--u)))] w-[max(190px,calc(264*var(--u)))] object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className={`absolute top-1/2 left-1/2 grid -translate-1/2 place-items-center rounded-full bg-navy transition-transform group-hover:scale-110 ${button}`}>
          <img src={card.large ? play32 : play24} alt="" className={card.large ? 'w-[max(24px,calc(32*var(--u)))]' : 'w-[max(18px,calc(24*var(--u)))]'} />
        </span>
        <span className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-b from-transparent to-black px-3.5 pt-5 pb-[max(14px,calc(22*var(--u)))]">
          <Byline name={card.name} date={card.date} avatar={card.avatar} light />
        </span>
      </button>
    </article>
  )
}

// Testimonials rail. Native horizontal scroll (so it's swipeable), with the
// arrows tweening scrollLeft one card at a time.
function Testimonials() {
  const container = useRef(null)
  const rail = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from('.testimonial-card', {
        x: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rail.current, start: 'top 80%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: container })

  const scrollBy = (dir) => {
    const el = rail.current
    const step = el.querySelector('.testimonial-card').getBoundingClientRect().width + 24
    gsap.to(el, { scrollTo: { x: el.scrollLeft + dir * step }, duration: 0.6, ease: 'power2.out' })
  }

  return (
    <section ref={container} className="flex flex-col gap-[max(24px,calc(60*var(--u)))] py-[max(48px,calc(100*var(--u)))]">
      <div className="flex items-center justify-between gap-8 px-(--gutter)">
        <h2 className="t-h2 text-navy" data-reveal>Testimonials</h2>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous testimonials" className="grid size-[max(40px,calc(56*var(--u)))] cursor-pointer place-items-center rounded-full bg-[#124a8a]/40 transition-colors hover:bg-[#124a8a]/60">
            <img src={arrowWhite} alt="" className="w-[max(18px,calc(24*var(--u)))] rotate-180" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Next testimonials" className="grid size-[max(40px,calc(56*var(--u)))] cursor-pointer place-items-center rounded-full bg-[#124a8a] transition-colors hover:bg-accent">
            <img src={arrowWhite} alt="" className="w-[max(18px,calc(24*var(--u)))]" />
          </button>
        </div>
      </div>

      <ul ref={rail} className="no-scrollbar flex snap-x gap-6 overflow-x-auto px-(--gutter) py-2">
        {CARDS.map((card, i) => (
          <li key={i} className="testimonial-card flex shrink-0">
            {card.kind === 'review' ? <ReviewCard card={card} /> : <VideoCard card={card} />}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Testimonials
