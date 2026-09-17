import { ArrowRightIcon } from "./Icons";

export default function CtaButton({ children = "Start Your Publishing Journey", className = "" }) {
  return (
    <a
      href="#publish"
      className={`group inline-flex items-center gap-3 rounded-full bg-sun py-1.5 pr-1.5 pl-5 font-display text-[15px] font-semibold whitespace-nowrap text-ink shadow-[0_0_0_5px_rgb(243_205_90/0.35)] transition-colors hover:bg-[#f6d673] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal story:py-2 story:pr-2 story:pl-4.5 story:text-[18px] ${className}`}
    >
      <span>{children}</span>
      <span className="grid size-9 place-items-center rounded-full bg-white story:size-11">
        <ArrowRightIcon className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}
