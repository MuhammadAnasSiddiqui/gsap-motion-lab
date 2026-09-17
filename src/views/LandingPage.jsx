import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import {
  BookShowcase,
  HeroSection,
  ProcessSection,
  PublishSection,
  SiteHeader,
  StatsSection,
  TapToScroll,
} from "@/components/index";

// Register every plugin once, before any animation uses it.
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

/*
 * THE MAIN ANIMATION
 * ==================
 * The Figma prototype is a "scroll story": the screen stays still while each section animates
 * into the next one. It's built from three GSAP pieces:
 *
 *  1. One master timeline holds every transition in order. Between transitions, `addLabel()`
 *     marks the resting points (hero, process, stats, ...).
 *  2. ScrollTrigger pins the stage (keeps it fixed on screen) and links the timeline's progress
 *     to the scroll position (`scrub`). Scrolling down plays it forward and scrolling up plays it
 *     in reverse. `snap` lets it settle on the nearest label.
 *  3. ScrollToPlugin powers "Tap to Scroll" and the back button by smoothly scrolling the page
 *     to a label's scroll position. The scrub then plays the transition.
 *
 * All five scenes are stacked on top of each other inside a 1440 × 780 "canvas" (the Figma frame
 * size), and the canvas is scaled to fit the viewport. Because every tween uses design pixels,
 * the choreography looks the same at any screen size.
 *
 * The story only runs on large screens with motion allowed. Everywhere else the sections render
 * as a normal stacked page with simple fade-ups, and with reduced motion there's no animation.
 */

// Must match the `story` custom variant in src/index.css (the `laptop` breakpoint, 1023px).
const STORY_QUERY = "(min-width: 1023px) and (prefers-reduced-motion: no-preference)";
const SIMPLE_QUERY = "(max-width: 1022.98px) and (prefers-reduced-motion: no-preference)";

const STORY_TRIGGER_ID = "landing-story";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 780;

// Final resting tilt of the four process cards, in degrees (measured from the design).
const CARD_TILT = [-4.5, 5, -4.5, 4.5];

const LandingPage = () => {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  // useGSAP works like useLayoutEffect, but every animation, ScrollTrigger and matchMedia created
  // inside it is recorded in a GSAP Context. On unmount (and on React Strict Mode's double run in
  // development) it all gets reverted: inline styles are removed and pins are undone.
  // `scope: rootRef` makes selector strings like ".scene-hero" only match inside this component.
  const { contextSafe } = useGSAP(
    () => {
      // gsap.matchMedia() runs a setup function only while its media query matches. When the
      // query stops matching (for example the window gets narrower), everything created in that
      // function is reverted automatically, so the two layouts never leak into each other.
      const mm = gsap.matchMedia();

      mm.add(STORY_QUERY, () => {
        // ── Fit the 1440 × 780 canvas to the viewport ─────────────────────────────────────────
        const fitCanvas = () => {
          const scale = Math.min(
            window.innerWidth / DESIGN_WIDTH,
            window.innerHeight / DESIGN_HEIGHT,
          );
          gsap.set(canvasRef.current, { scale });
        };
        fitCanvas();
        // "refreshInit" fires before ScrollTrigger recalculates on resize.
        ScrollTrigger.addEventListener("refreshInit", fitCanvas);

        // ── Starting states ───────────────────────────────────────────────────────────────────
        // gsap.set() applies values instantly. Hiding everything that enters later lets the
        // timeline below use only `.to()` tweens, which scrub cleanly in both directions.
        // (`autoAlpha` is opacity plus `visibility: hidden` at 0, so hidden elements can't be clicked.)
        gsap.set(".header-back", { autoAlpha: 0, x: -16 });
        gsap.set(".process-intro", { autoAlpha: 0, y: 80 });
        gsap.set(".process-card", {
          autoAlpha: 0,
          y: 460,
          rotation: (index) => CARD_TILT[index] * 4, // function-based value: runs once per card
        });
        gsap.set(".scene-stats", { yPercent: 100 });
        gsap.set(".stat-card", { autoAlpha: 0, y: 90 });
        gsap.set(".scene-publish", { yPercent: 100 });
        gsap.set(".publish-card", { x: 90, rotation: 2 });
        gsap.set(".book-back", { yPercent: 110, rotation: -10 });
        // transformPerspective gives rotationY real 3D depth instead of a flat squash.
        gsap.set(".book-back, .book-front", { transformPerspective: 1400 });
        gsap.set(".book-front", { autoAlpha: 0, rotationY: -90 });
        gsap.set(".book-fan", {
          autoAlpha: 0,
          scale: 0.92,
          rotation: 6,
          transformOrigin: "70% 90%",
        });
        gsap.set(".brand-logo", { autoAlpha: 0, scale: 0.6, filter: "blur(14px)" });
        gsap.set(".brand-shadow", { autoAlpha: 0, scaleX: 0.2 });

        // ── Master timeline ───────────────────────────────────────────────────────────────────
        const tl = gsap.timeline({
          // Defaults apply to every tween unless it overrides them.
          defaults: { duration: 1, ease: "power2.inOut" },
          scrollTrigger: {
            id: STORY_TRIGGER_ID, // lets the click handlers look this ScrollTrigger up later
            trigger: stageRef.current,
            pin: true, // keep the stage fixed while the timeline plays
            start: "top top", // start when the top of the stage reaches the top of the viewport
            // Total scroll distance. A function is re-evaluated on every refresh (resize).
            end: () => `+=${window.innerHeight * 7}`,
            scrub: 1, // follow the scrollbar with 1 second of smoothing
            snap: {
              snapTo: "labels", // when scrolling stops, settle on the nearest label
              duration: { min: 0.3, max: 0.9 },
              delay: 0.15,
              ease: "power1.inOut",
            },
            invalidateOnRefresh: true, // recalculate function-based values after a resize
          },
        });

        // Position parameter cheat sheet (the last argument of .to()):
        //   (none) → start after the previous tween ends
        //   "<"    → start at the same time as the previous tween
        //   "<0.3" → start 0.3s after the previous tween starts
        tl.addLabel("hero")

          // Scene 1 → 2: the hero slides up; the process heading and cards rise into a fan.
          .to(".scene-hero", { yPercent: -100 })
          .to(".header-logo, .header-cta", { autoAlpha: 0, y: -24, duration: 0.4 }, "<")
          .to(".nav-pill", { backgroundColor: "rgb(255 255 255 / 0)", duration: 0.4 }, "<")
          .to(".header-back", { autoAlpha: 1, x: 0, duration: 0.4 }, "<0.3")
          .to(".process-intro", { autoAlpha: 1, y: 0, stagger: 0.12 }, "<")
          .to(
            ".process-card",
            {
              autoAlpha: 1,
              y: 0,
              rotation: (index) => CARD_TILT[index],
              stagger: 0.12, // each card starts 0.12s after the one before it
              ease: "back.out(1.2)", // a slight overshoot, like the cards landing
            },
            "<0.2",
          )
          .addLabel("process")

          // Scene 2 → 3: the cards drift up and blur out of focus; the stats panel slides in.
          .to(".process-intro", { autoAlpha: 0, y: -70, duration: 0.6 })
          .to(".process-cards", { y: -290, scale: 0.94, autoAlpha: 0.5, filter: "blur(6px)" }, "<")
          .to(".scene-stats", { yPercent: 0 }, "<")
          .to(".stat-card", { autoAlpha: 1, y: 0, stagger: 0.08, ease: "power3.out" }, "<0.2")
          .addLabel("stats")

          // Scene 3 → 4: process and stats move up together as the publish scene pushes in below.
          .to(".scene-process, .scene-stats", { yPercent: -100 })
          .to(".scene-publish", { yPercent: 0 }, "<")
          .to(".publish-card", { x: 0, rotation: 0, ease: "power3.out" }, "<0.2")
          .addLabel("publish")

          // Scene 4 → 5: publish moves away, revealing the book scene; the back cover rises.
          .to(".scene-publish", { yPercent: -100 })
          .to(".book-back", { yPercent: 0, rotation: 0, ease: "power3.out" }, "<0.2")
          .addLabel("book")

          // 3D flip: turn the back cover edge-on (90°), swap the images, then turn the front
          // cover from -90° to face the viewer. The swap happens while the book is edge-on,
          // so it's never seen. `.set()` is a zero-duration tween, so it reverses correctly too.
          .to(".book-back", { rotationY: 90, duration: 0.5, ease: "power2.in" })
          .set(".book-back", { autoAlpha: 0 })
          .set(".book-front", { autoAlpha: 1 })
          .to(".book-front", { rotationY: 0, duration: 0.5, ease: "power2.out" })
          .addLabel("bookFront")

          // More books fan out behind the front cover.
          .to(".book-fan", { autoAlpha: 1, scale: 1, rotation: 0, ease: "back.out(1.4)" })
          .to(".book-front", { autoAlpha: 0, duration: 0.3 }, "<0.4")
          .addLabel("bookFan")

          // The books collapse and blur away while the logo comes into focus above its shadow.
          .to(".book-fan", { autoAlpha: 0, scale: 0.7, filter: "blur(12px)" })
          .to(".brand-logo", { autoAlpha: 1, scale: 1, filter: "blur(0px)" }, "<0.3")
          .to(".brand-shadow", { autoAlpha: 1, scaleX: 1 }, "<")
          .addLabel("brand");

        // A standalone loop, separate from the scroll timeline: nudge the Tap to Scroll arrow.
        gsap.to(".tap-arrow", { y: 4, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: -1 });

        // Cleanup for this matchMedia branch. GSAP reverts the tweens and ScrollTriggers itself;
        // this removes the event listener, which GSAP doesn't track.
        return () => ScrollTrigger.removeEventListener("refreshInit", fitCanvas);
      });

      // Small screens with motion allowed: a normal page with each block fading up once as it
      // scrolls into view.
      mm.add(SIMPLE_QUERY, () => {
        gsap.utils.toArray(".reveal").forEach((element) => {
          gsap.from(element, {
            autoAlpha: 0,
            y: 40,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 85%", once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  // Click handlers run after useGSAP has finished, outside its Context. Wrapping them in
  // contextSafe() adds the animations they create to the same Context, so they're cleaned up too.
  const scrollToScene = contextSafe((direction) => {
    // The trigger only exists while the story layout is active.
    const trigger = ScrollTrigger.getById(STORY_TRIGGER_ID);
    if (!trigger) return;
    const tl = trigger.animation;

    // labelToScroll() converts a timeline label into the scroll position where it's reached.
    const stops = Object.keys(tl.labels)
      .map((label) => trigger.labelToScroll(label))
      .sort((a, b) => a - b);
    const current = window.scrollY;

    const target =
      direction > 0
        ? (stops.find((stop) => stop > current + 2) ?? stops[0]) // past the last scene → loop to the start
        : (stops.findLast((stop) => stop < current - 2) ?? stops[0]);

    gsap.to(window, {
      scrollTo: target,
      duration: 1.2,
      ease: "power2.inOut",
      overwrite: "auto", // a quick second click replaces the running scroll tween
    });
  });

  return (
    <main ref={rootRef} className="bg-white text-ink">
      <div
        ref={stageRef}
        className="relative story:flex story:h-svh story:items-center story:justify-center story:overflow-hidden"
      >
        <div
          ref={canvasRef}
          className="relative story:h-195 story:w-360 story:shrink-0 story:overflow-hidden"
        >
          <SiteHeader onBack={() => scrollToScene(-1)} />
          <HeroSection />
          <ProcessSection />
          <StatsSection />
          <PublishSection />
          <BookShowcase />
          <TapToScroll onNext={() => scrollToScene(1)} />
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
