import stepSubmit from "@/assets/images/step-submit.webp";
import stepPlan from "@/assets/images/step-plan.webp";
import stepCreate from "@/assets/images/step-create.webp";
import stepPublish from "@/assets/images/step-publish.webp";
import CtaButton from "./CtaButton";

const STEPS = [
  {
    label: "Step#1",
    title: "Submit Your Manuscript",
    body: "Send us your completed manuscript, draft or book idea. Our team will review your work, understand your goals.",
    image: stepSubmit,
    color: "bg-step-cyan",
  },
  {
    label: "Step#2",
    title: "Choose Publishing Plan",
    body: "Following the assessment, we will recommend a suitable publishing package covering the services.",
    image: stepPlan,
    color: "bg-step-pink",
  },
  {
    label: "Step#3",
    title: "Create & Prepare Book",
    body: "Your dedicated team will professionally edit, design and format your book for print and digital publication.",
    image: stepCreate,
    color: "bg-step-cream",
  },
  {
    label: "Step#4",
    title: "Publish & Promote",
    body: "We will publish your book and make it available on distribution networks, including Amazon, Foyles and many more.",
    image: stepPublish,
    color: "bg-step-lilac",
  },
];

// Soft brush-stroke arches behind the cards (desktop story layout only).
const ARCHES = [
  "left-[-40px] rotate-[-4deg]",
  "left-[320px] rotate-[3deg]",
  "left-[690px] rotate-[-2deg]",
  "left-[1050px] rotate-[4deg]",
  "left-[1300px] rotate-[-3deg]",
];

// No GSAP here: this scene is choreographed by the master timeline in LandingPage.jsx.
// The classes it animates are `.scene-process`, `.process-intro`, `.process-cards` and `.process-card`.
export default function ProcessSection() {
  return (
    <section className="scene scene-process relative bg-mist px-5 py-20 story:absolute story:overflow-hidden story:inset-0 story:z-10 story:p-0">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden story:block">
        {ARCHES.map((arch) => (
          <div
            key={arch}
            className={`absolute bottom-[-120px] h-[700px] w-[300px] rounded-t-full bg-[#e4f0fc] ${arch}`}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1440px] story:h-full">
        <div className="flex flex-col gap-6 laptop:flex-row laptop:items-start laptop:justify-between story:absolute story:top-[92px] story:right-[100px] story:left-[110px]">
          <h2 className="process-intro reveal font-display text-4xl leading-[1.05] font-bold tracking-tight text-ink tablet-sm:text-5xl story:text-[64px] story:leading-[1.12]">
            Publishing doesn’t have <br className="hidden tablet-sm:block" />
            to be complicated.
          </h2>
          <div className="process-intro reveal story:pt-[14px]">
            <p className="font-display text-lg leading-tight font-semibold text-ink story:text-[21px]">
              We take care of the process.
              <br />
              You focus on the story.
            </p>
            <CtaButton className="mt-5 story:mt-[26px]" />
          </div>
        </div>

        <div className="process-cards mt-12 grid gap-6 tablet-sm:grid-cols-2 laptop:grid-cols-4 story:absolute story:top-[296px] story:left-[166px] story:mt-0 story:flex story:gap-0">
          {STEPS.map((step) => (
            <article
              key={step.label}
              className={`process-card reveal rounded-[26px] px-7 pt-5 pb-8 text-ink shadow-[0_18px_40px_-24px_rgb(11_27_63/0.35)] ${step.color} story:h-[404px] story:w-[270px] story:px-[26px]`}
            >
              <p className="text-center font-script text-[18px]">{step.label}</p>
              <img
                src={step.image}
                alt=""
                className="mx-auto mt-3 h-[150px] w-auto object-contain"
              />
              <h3 className="mt-4 font-display text-[22px] leading-tight font-bold">
                {step.title}
              </h3>
              <p className="mt-3 text-[15px] leading-snug text-ink/85">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
