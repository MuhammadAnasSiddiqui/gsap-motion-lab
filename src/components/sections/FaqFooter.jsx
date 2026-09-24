import { useRef, useState } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'
import CtaButton from '../CtaButton'
import brush from '../../assets/footer/bg-brush.svg'
import chevron from '../../assets/footer/chevron-24.svg'
import bookGlow from '../../assets/footer/book-glow.png'
import logoWhite from '../../assets/footer/logo-white.svg'
import iconPhone from '../../assets/footer/icon-phone.svg'
import iconLocation from '../../assets/footer/icon-location.svg'
import iconEmail from '../../assets/footer/icon-email.svg'
import linkedin from '../../assets/footer/social-linkedin.svg'
import facebook from '../../assets/footer/social-facebook.svg'
import instagram from '../../assets/footer/social-instagram.svg'

// Questions are from the comp; the answers are placeholders until the real
// copy is supplied.
const FAQS = [
  {
    q: 'What is Publishing and how does it work?',
    a: 'Publishing turns your finished manuscript into a book people can buy. We edit, design and format it, then list it with print and digital distributors so readers can find it in stores and online.',
  },
  {
    q: 'Should I hire an agent to publish my book?',
    a: "Not with us. Agents pitch to traditional houses; we work with you directly, so there's no commission and you keep full control of your rights and royalties.",
  },
  {
    q: 'Which publisher is best for first-time authors?',
    a: 'Look for a team that explains every step, shows pricing up front and lets you keep your rights. That is how we work with every first-time author.',
  },
]

const CONTACT = [
  { icon: iconPhone, label: 'Phone No', value: '0121 815 8355', href: 'tel:01218158355' },
  { icon: iconLocation, label: 'Location', value: 'Unit#43,20 Queensway, Birmingham B4 6At, UK' },
  { icon: iconEmail, label: 'Email Address', value: 'info@cambridgebookpublishing.co.uk', href: 'mailto:info@cambridgebookpublishing.co.uk' },
]

const LINKS = ['Home', 'Services', 'Portfolio', 'Author Stories', 'Testimonials', 'Publish Your Book']
const SOCIAL = [
  { icon: linkedin, label: 'LinkedIn' },
  { icon: facebook, label: 'Facebook' },
  { icon: instagram, label: 'Instagram' },
]

function FaqItem({ item, open, onToggle }) {
  const body = useRef(null)
  const icon = useRef(null)

  useGSAP(() => {
    gsap.to(body.current, { height: open ? 'auto' : 0, duration: 0.45, ease: 'power2.inOut' })
    gsap.to(icon.current, { rotation: open ? 180 : 0, duration: 0.35, ease: 'power2.out' })
  }, { dependencies: [open] })

  return (
    <li className="rounded-[max(10px,calc(12*var(--u)))] border-[3px] border-[rgba(128,191,255,0.1)] bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-6 px-[max(16px,calc(20*var(--u)))] py-[max(16px,calc(24*var(--u)))] text-left"
      >
        <span className="flex-1 font-lexend text-[max(15px,calc(18*var(--u)))] leading-[1.4] text-navy">{item.q}</span>
        <span ref={icon} className="grid size-[max(28px,calc(32*var(--u)))] shrink-0 place-items-center rounded-full bg-accent">
          <img src={chevron} alt="" className="w-[max(16px,calc(20*var(--u)))] rotate-180" />
        </span>
      </button>
      <div ref={body} className="h-0 overflow-hidden">
        <p className="t-body px-[max(16px,calc(20*var(--u)))] pb-[max(16px,calc(24*var(--u)))] text-muted">{item.a}</p>
      </div>
    </li>
  )
}

// FAQ panel that fades into the dark footer, with the glowing hardcover
// bridging the two.
function FaqFooter() {
  const container = useRef(null)
  const [openIndex, setOpenIndex] = useState(-1)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from('.footer-book', {
        y: 120,
        rotation: 12,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-grid', start: 'top 85%', once: true },
      })
      gsap.to('.footer-book', {
        y: -20,
        duration: 3.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.4,
      })
    })
    return () => mm.revert()
  }, { scope: container })

  return (
    <div ref={container} className="flex flex-col gap-[calc(10*var(--u))] bg-[linear-gradient(to_top,#050a1d_40%,#fff)] px-(--pad) pb-(--pad)">
      {/* FAQ */}
      <section className="pt-(--pad)">
        <div className="panel relative flex flex-col items-center gap-[max(20px,calc(32*var(--u)))] bg-sky px-(--gutter) pt-[max(48px,calc(100*var(--u)))] pb-[max(200px,calc(560*var(--u)))] lg:px-[calc(260*var(--u))]">
          <img
            src={brush}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-[-32%] left-[-86.8%] w-[155.9%] max-w-none"
          />
          <h2 className="t-h2 relative text-center text-navy" data-reveal>Common Questions</h2>
          <ul className="relative flex w-full flex-col gap-[max(8px,calc(12*var(--u)))]" data-reveal-stagger>
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} item={item} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
            ))}
          </ul>
          <div className="relative" data-reveal>
            <CtaButton />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative">
        <div className="footer-grid relative flex flex-col gap-12 px-(--gutter) pt-[max(24px,calc(30*var(--u)))] pb-[max(60px,calc(150*var(--u)))] lg:flex-row lg:justify-between">
          <div className="flex flex-col lg:max-w-[calc(470*var(--u))] gap-[max(28px,calc(48*var(--u)))]">
            <img src={logoWhite} alt="Cambridge Book Publishing" className="w-[max(180px,calc(263*var(--u)))]" />
            <p className="t-body-lg text-white">
              Our UK-based team of editors, designers, marketers, and publishing consultants brings professional expertise to every author we work with, regardless of genre.
            </p>
            <ul className="flex flex-col gap-[max(16px,calc(23*var(--u)))]">
              {CONTACT.map((item) => (
                <li key={item.label} className="flex items-center gap-[max(14px,calc(24*var(--u)))]">
                  <img src={item.icon} alt="" className="aspect-square w-[max(40px,calc(50*var(--u)))] shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <p className="t-h5 text-[#7d9cd3]">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="t-body-lg text-white transition-opacity hover:opacity-80">{item.value}</a>
                    ) : (
                      <p className="t-body-lg text-white">{item.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-[max(28px,calc(48*var(--u)))] lg:w-[calc(480*var(--u))] lg:pl-[calc(76*var(--u))]">
            <div className="flex flex-col gap-[max(14px,calc(24*var(--u)))]">
              <p className="t-h4 text-white">Quick Links</p>
              <ul className="flex flex-wrap gap-[max(8px,calc(12*var(--u)))]">
                {LINKS.map((link, i) => (
                  <li key={link}>
                    <a
                      href="#"
                      className={`block rounded-full px-[max(12px,calc(16*var(--u)))] py-[max(6px,calc(8*var(--u)))] font-body text-[max(15px,calc(24*var(--u)))] leading-[1.4] whitespace-nowrap transition-colors ${
                        i === 0 ? 'bg-white text-navy' : 'border border-white/50 text-white hover:bg-white hover:text-navy'
                      }`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-[max(14px,calc(24*var(--u)))]">
              <p className="t-h4 text-white">Social Media</p>
              <ul className="flex gap-[7px]">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <a href="#" aria-label={s.label} className="grid size-[max(40px,calc(50*var(--u)))] place-items-center rounded-full bg-white transition-colors hover:bg-gold">
                      <img src={s.icon} alt="" className="w-[max(20px,calc(26*var(--u)))]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Glowing hardcover bridging the FAQ panel and the footer */}
          <img
            src={bookGlow}
            alt="How to Publish Your Book, a Cambridge Book Publishing hardcover"
            className="footer-book pointer-events-none absolute top-[calc(-267*var(--u))] left-[18.5%] hidden w-[56%] max-w-none rotate-[4.54deg] drop-shadow-[0_25px_120px_rgba(19,35,94,0.4)] lg:block"
          />
        </div>

        <div className="flex flex-col gap-3 rounded-[max(20px,calc(140*var(--u)))] bg-sky px-[max(20px,calc(60*var(--u)))] py-[max(12px,calc(16*var(--u)))] font-lexend text-[max(13px,calc(18*var(--u)))] leading-[1.4] text-[#04032c] sm:flex-row sm:items-center sm:justify-between lg:h-[calc(75*var(--u))]">
          <p>All right reserved cambridge</p>
          <div className="flex gap-[max(16px,calc(32*var(--u)))] whitespace-nowrap">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Term&amp; Condition</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default FaqFooter
