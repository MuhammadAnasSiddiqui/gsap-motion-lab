import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function App() {
  const container = useRef(null);
  const animation = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        animation.current = gsap.from(".animate-in", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        });
        return () => {
          animation.current = null;
        };
      });
      return () => media.revert();
    },
    { scope: container },
  );

  return (
    <main
      ref={container}
      className="flex min-h-svh items-center justify-center bg-zinc-950 px-6 py-16 text-zinc-100"
    >
      <section className="w-full max-w-2xl">
        <p className="animate-in text-sm font-medium uppercase tracking-widest text-lime-400">
          GSAP practice playground
        </p>
        <h1 className="animate-in mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
          Ready to animate.
        </h1>
        <p className="animate-in mt-6 text-lg leading-relaxed text-zinc-400">
          React + Vite + Tailwind CSS + GSAP are ready. Edit src/App.jsx to start building.
        </p>
        <div className="animate-in mt-10 flex gap-4" aria-hidden="true">
          <div className="h-16 w-16 rounded-2xl bg-lime-400" />
          <div className="h-16 w-16 rounded-2xl bg-cyan-400" />
          <div className="h-16 w-16 rounded-2xl bg-violet-400" />
        </div>
        <button
          type="button"
          onClick={() => animation.current?.restart()}
          className="mt-10 cursor-pointer rounded-full bg-lime-400 px-6 py-3 font-semibold text-zinc-950 transition-colors hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-400"
        >
          Replay animation
        </button>
      </section>
    </main>
  );
}

export default App;
