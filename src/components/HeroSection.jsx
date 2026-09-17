import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import heroBook from "@/assets/images/hero-book.webp";
import heroClouds from "@/assets/images/hero-clouds.webp";
import CtaButton from "./CtaButton";
import { SparkleIcon } from "./Icons";

gsap.registerPlugin(useGSAP, SplitText);

// Positions and sizes come from the 1440 × 780 Figma frame (desktop story layout only).
const SPARKLES = [
  "top-[124px] left-[730px] size-9",
  "top-[116px] left-[1380px] size-6",
  "top-[350px] left-[104px] size-11",
  "top-[454px] left-[722px] size-11",
  "top-[338px] left-[914px] size-5",
];

export default function HeroSection() {
  const heroRef = useRef(null);

  // The hero has two kinds of motion, and neither depends on scroll:
  //   1. an intro timeline that plays once on page load
  //   2. ambient loops (floating book, twinkling sparkles, light sweep) that repeat forever
  // Moving the hero out of view on scroll is handled separately by LandingPage,
  // which animates the outer `.scene-hero` wrapper and never touches these inner elements.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // SplitText wraps each line and word of the heading in its own element.
        // `mask: "lines"` adds an overflow-hidden wrapper per line, so words slide up
        // from behind an invisible edge instead of fading in from nowhere.
        // `autoSplit` re-splits when fonts load or the width changes. Returning the tween
        // from `onSplit` lets SplitText revert it and rebuild it at the same progress.
        SplitText.create(".hero-title", {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 110,
              duration: 0.9,
              stagger: 0.06,
              ease: "power4.out",
              delay: 0.25,
            }),
        });

        // Timeline positions (the number after the vars object) are absolute times in seconds,
        // so each element can start while the previous one is still moving.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-card", { autoAlpha: 0, scale: 0.97, duration: 1 }, 0)
          .from(".hero-book", { autoAlpha: 0, x: 160, rotation: 10, duration: 1.2 }, 0.35)
          .from(".hero-fade", { autoAlpha: 0, y: 30, duration: 0.8, stagger: 0.12 }, 0.75)
          .from(
            ".hero-sparkle",
            { scale: 0, rotation: -90, duration: 0.6, stagger: 0.08, ease: "back.out(2)" },
            0.9,
          );

        // Ambient loops. `yoyo` plays each repeat backwards, so the motion eases back and forth
        // without a jump. They animate child elements (`-float`, `-glyph`, `-shine`) so they never
        // compete with the intro tweens above for the same transform.
        gsap.to(".hero-book-float", {
          y: -14,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        gsap.to(".hero-sparkle-glyph", {
          scale: 0.55,
          opacity: 0.45,
          duration: 1.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.35, from: "random" },
          delay: 1.6,
        });

        // A soft highlight sweeps across the book cover every few seconds.
        gsap.fromTo(
          ".hero-book-shine",
          { xPercent: -160 },
          {
            xPercent: 260,
            duration: 1.4,
            ease: "power2.inOut",
            repeat: -1,
            repeatDelay: 2.6,
            delay: 1.8,
          },
        );
      });

      return () => mm.revert();
    },
    { scope: heroRef },
  );

  return (
    <section
      id="top"
      ref={heroRef}
      className="scene scene-hero relative story:absolute story:inset-0 story:z-40 story:bg-white"
    >
      <div className="hero-card relative overflow-hidden rounded-b-[48px] bg-[linear-gradient(135deg,#d2e6fc_0%,#eef5fe_42%,#e4effd_68%,#a9cbfa_100%)] px-5 pt-28 pb-20 story:absolute story:inset-x-0 story:top-0 story:h-187.5 story:rounded-b-[90px] story:p-0">
        {/* Background decoration */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 750"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <defs>
            <linearGradient id="hero-wave" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#a8cdfb" />
              <stop offset="1" stopColor="#5f97f7" />
            </linearGradient>
          </defs>
          <path
            d="M0 0h440c-40 70-170 96-300 120C70 132 25 150 0 176Z"
            fill="#cfe3fb"
            opacity="0.6"
          />
          <path
            d="M500 750c170-120 380-170 600-214 170-34 270-150 340-220v434Z"
            fill="#b9d6fb"
            opacity="0.6"
          />
          <path
            d="M950 750c120-96 260-118 380-150 60-16 90-60 110-96v246Z"
            fill="url(#hero-wave)"
          />
        </svg>
        <img
          src={heroClouds}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 w-85 mix-blend-multiply mask-[radial-gradient(110%_95%_at_0%_100%,black_55%,transparent_85%)] story:bottom-2.5 story:w-125"
        />
        {SPARKLES.map((position) => (
          <span
            key={position}
            aria-hidden="true"
            className={`hero-sparkle absolute hidden text-[#bcd6f5] story:block ${position}`}
          >
            <SparkleIcon className="hero-sparkle-glyph size-full" />
          </span>
        ))}

        <div className="relative mx-auto flex max-w-360 flex-col gap-12 laptop:flex-row laptop:items-center laptop:justify-between story:block story:h-full">
          <div className="story:absolute story:top-46.5 story:left-13">
            <h1 className="hero-title font-display text-5xl leading-[1.02] font-bold tracking-tight text-ink tablet-sm:text-6xl story:text-[88px] story:leading-[1.02] story:tracking-[-0.015em]">
              Your Story Deserves <br className="hidden tablet-sm:block" />
              To Be A Book.
            </h1>
            <p className="hero-fade mt-6 max-w-170 text-lg leading-relaxed text-slate-600 tablet-sm:text-xl story:mt-13 story:text-[30px] story:leading-[1.4]">
              We are here to help. Our editors will make the difficult process of publication easier
              for you.
            </p>
            <CtaButton className="hero-fade mt-8 story:mt-9" />
          </div>

          <div className="hero-book mx-auto w-60 shrink-0 tablet-sm:w-75 story:absolute story:top-49 story:left-234.5 story:w-93">
            <div className="hero-book-float relative">
              <img
                src={heroBook}
                alt="10 Reasons to Choose Cambridge for Book Publishing, a Cambridge Book Publishing guide"
                className="w-full mix-blend-multiply"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-[2%] right-[8%] left-[12%] overflow-hidden"
              >
                <div className="hero-book-shine absolute inset-y-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
