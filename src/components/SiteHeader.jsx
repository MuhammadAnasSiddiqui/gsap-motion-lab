import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import logo from "@/assets/images/logo.webp";
import CtaButton from "./CtaButton";
import { ArrowLeftIcon } from "./Icons";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = ["Publish Your Book", "Services", "Portfolio", "Author Stories", "About"];

export default function SiteHeader({ onBack }) {
  const headerRef = useRef(null);

  // Intro: the whole bar drops in once on page load.
  // It animates `.header-bar` only. The children (`.header-logo`, `.header-cta`, `.nav-pill`,
  // `.header-back`) belong to the scroll timeline in LandingPage. Two tweens fighting over
  // the same element and property would record each other's values and break when reversed.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".header-bar", { y: -32, autoAlpha: 0, duration: 0.8, ease: "power3.out" });
      });
      return () => mm.revert();
    },
    { scope: headerRef },
  );

  return (
    <header ref={headerRef} className="absolute inset-x-0 top-0 z-50">
      <div className="header-bar mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 story:h-[104px] story:px-[52px] story:py-0">
        <div className="relative flex items-center story:w-[322px]">
          {/* Back button: hidden in the hero, faded in by the scroll timeline for later scenes. */}
          <button
            type="button"
            onClick={onBack}
            aria-label="Previous section"
            className="header-back absolute left-0 hidden size-11 cursor-pointer place-items-center rounded-full bg-sun text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal story:grid"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <a href="#top" className="header-logo block" aria-label="Cambridge Book Publishing home">
            <img
              src={logo}
              alt="Cambridge Book Publishing"
              className="h-10 w-auto mix-blend-multiply story:h-[58px]"
            />
          </a>
        </div>

        <nav aria-label="Main" className="hidden gap-2 tablet:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#top"
              className="nav-pill rounded-full bg-white px-4 py-2 text-[15px] whitespace-nowrap text-ink transition-colors hover:text-royal story:px-4 story:py-[9px] story:text-[18px]"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex justify-end story:w-[322px]">
          <CtaButton className="header-cta hidden tablet-sm:inline-flex" />
        </div>
      </div>
    </header>
  );
}
