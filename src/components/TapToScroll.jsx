import { ArrowDownIcon } from "./Icons";

// Only shown in the story layout. LandingPage passes `onNext`, which scrolls to the next scene.
export default function TapToScroll({ onNext }) {
  return (
    <button
      type="button"
      onClick={onNext}
      aria-label="Scroll to the next section"
      className="absolute top-[322px] right-0 z-50 hidden h-[140px] w-[34px] cursor-pointer flex-col items-center justify-center gap-2 rounded-l-full border border-r-0 border-slate-200/80 bg-white/70 text-slate-500 backdrop-blur-sm transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal story:flex"
    >
      <span className="rotate-180 text-[13px] [writing-mode:vertical-rl]">Tap to Scroll</span>
      <ArrowDownIcon className="tap-arrow size-4" />
    </button>
  );
}
