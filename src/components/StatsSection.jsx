import statAuthors from "@/assets/images/stat-authors.webp";
import statBooks from "@/assets/images/stat-books.webp";
import statGlobal from "@/assets/images/stat-global.webp";
import statRights from "@/assets/images/stat-rights.webp";

const STATS = [
  { value: "500+", label: "Authors supported", icon: statAuthors, tone: "cream" },
  { value: "1,000+", label: "Books published", icon: statBooks, tone: "ice" },
  { value: "Global", label: "Distribution", icon: statGlobal, tone: "cream" },
  { value: "100%", label: "Author rights", icon: statRights, tone: "ice" },
];

const TONES = {
  cream: { card: "bg-cream", blob: "text-cream-deep" },
  ice: { card: "bg-ice", blob: "text-ice-deep" },
};

// No GSAP here. In the story layout this scene is a transparent full-frame layer whose white
// panel slides up over the lower half of the process scene. Animated classes: `.scene-stats`
// and `.stat-card` (see LandingPage.jsx).
export default function StatsSection() {
  return (
    <section className="scene scene-stats relative bg-white px-5 py-16 story:pointer-events-none story:absolute story:inset-0 story:z-20 story:bg-transparent story:p-0">
      <div className="story:pointer-events-auto story:absolute story:inset-x-0 story:top-[352px] story:bottom-0 story:bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-5 tablet-sm:grid-cols-2 laptop:grid-cols-4 story:gap-[24px] story:px-[15px] story:pt-[16px]">
          {STATS.map((stat) => (
            <article
              key={stat.label}
              className={`stat-card reveal relative overflow-hidden rounded-[28px] p-6 text-ink ${TONES[stat.tone].card} story:h-[273px] story:p-[25px]`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 200 280"
                preserveAspectRatio="none"
                className={`absolute inset-y-0 right-0 h-full w-[62%] ${TONES[stat.tone].blob}`}
              >
                <path
                  fill="currentColor"
                  d="M60 0c-40 60 50 100 10 150-40 50 20 90-15 130h145V0Z"
                />
              </svg>
              <img src={stat.icon} alt="" className="relative size-[72px] mix-blend-multiply" />
              <p className="relative mt-4 font-display text-6xl leading-none font-bold tracking-tight story:mt-[16px] story:text-[72px]">
                {stat.value}
              </p>
              <p className="relative mt-4 font-display text-xl font-semibold story:mt-[26px] story:text-[21px]">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
