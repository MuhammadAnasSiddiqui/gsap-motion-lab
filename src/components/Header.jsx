import logo from '../assets/hero/logo.svg'
import CtaButton from './CtaButton'

const NAV = ['Publish Your Book', 'Services', 'Portfolio', 'Author Stories', 'About']

function Header() {
  return (
    <header className="hero-header absolute inset-x-0 top-[max(16px,calc(30*var(--u)))] z-30 flex items-center justify-between gap-4 px-(--gutter)">
      <a href="#" className="block w-[max(160px,calc(307*var(--u)))] shrink-0">
        <img src={logo} alt="Cambridge Book Publishing" className="block h-auto w-full" />
      </a>

      <nav className="hidden flex-1 justify-center xl:flex" aria-label="Primary">
        <ul className="flex items-center gap-[calc(7*var(--u))]">
          {NAV.map((label) => (
            <li key={label}>
              <a
                href="#"
                className="block rounded-full bg-white px-[max(10px,calc(16*var(--u)))] py-[max(5px,calc(8*var(--u)))] font-body text-[max(15px,calc(24*var(--u)))] leading-[1.4] whitespace-nowrap text-navy transition-colors hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <CtaButton className="max-sm:[&>span:first-child]:hidden max-sm:pl-[max(8px,calc(16*var(--u)))]" />
    </header>
  )
}

export default Header
