import { useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DraftIcon,
  IdeaIcon,
  MailIcon,
  ManuscriptIcon,
  MapPinIcon,
  PhoneIcon,
} from "./Icons";

const CONTACTS = [
  { label: "Phone No", value: "+1(514) 578-4779", Icon: PhoneIcon },
  { label: "Location", value: "Quebec, Canada", Icon: MapPinIcon },
  { label: "Email Address", value: "eugene.museve@aliongoaero.com", Icon: MailIcon },
];

const OPTIONS = [
  {
    id: "complete",
    title: "Complete manuscript",
    hint: "Finished and ready for editing",
    Icon: ManuscriptIcon,
  },
  { id: "draft", title: "Draft manuscript", hint: "Written, but it needs work", Icon: DraftIcon },
  {
    id: "idea",
    title: "Just an idea so far",
    hint: "Concept stage, needs guidance",
    Icon: IdeaIcon,
  },
];

// No GSAP here. The master timeline slides `.scene-publish` in and out and settles `.publish-card`.
export default function PublishSection() {
  const [stage, setStage] = useState("idea");

  return (
    <section
      id="publish"
      className="scene scene-publish relative bg-white px-5 py-20 story:absolute story:inset-0 story:z-30 story:p-0"
    >
      <div className="relative mx-auto grid max-w-360 gap-12 laptop:grid-cols-2 laptop:items-center story:block story:h-full">
        <div className="publish-copy reveal story:absolute story:top-49 story:left-13 story:w-155">
          <h2 className="font-display text-4xl leading-[1.1] font-bold tracking-tight text-ink story:text-[44px]">
            Ready to Turn Manuscript <br className="hidden tablet-sm:block" />
            Into a{" "}
            <span className="relative inline-block">
              Published eBook?
              <svg
                aria-hidden="true"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-[92%] text-royal"
              >
                <path
                  d="M2 9C80 2 190 1 298 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/85 tablet-sm:text-2xl story:mt-2.5 story:text-[30px] story:leading-[1.38]">
            Tell us a little about your book and publishing goals. Our team will review your
            project.
          </p>

          <ul className="mt-10 space-y-7 story:mt-12 story:space-y-7.5">
            {CONTACTS.map(({ label, value, Icon }) => (
              <li key={label} className="flex items-start gap-4 story:gap-4.5">
                <span className="mt-1 grid size-9.5 shrink-0 place-items-center rounded-lg bg-[#dce9fb] text-royal">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-[19px] font-semibold text-ink">
                    {label}
                  </span>
                  <span className="mt-1.5 block text-[18px] text-slate-600">{value}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="publish-card reveal relative overflow-hidden rounded-[36px] bg-linear-to-b from-[#d3e7ff] via-[#e3f0ff] to-[#d9eaff] p-6 text-ink tablet-sm:p-10 story:absolute story:top-26.5 story:left-177.25 story:h-160 story:w-169.5 story:px-10 story:py-8.5"
        >
          <h3 className="font-display text-3xl leading-tight font-bold tracking-tight tablet-sm:text-[42px]">
            Publish Your Book
          </h3>
          <p className="mt-2 text-[15px] leading-snug text-ink/85">
            Answer four quick questions and we'll recommend the right package, with the price shown
            up front. You keep 100% of your rights and royalties.
          </p>

          <div className="mt-5 grid grid-cols-4 gap-1" aria-hidden="true">
            {[0, 1, 2, 3].map((bar) => (
              <span
                key={bar}
                className={`h-2 rounded-full ${bar === 0 ? "bg-sun" : "bg-sun-soft"}`}
              />
            ))}
          </div>

          <fieldset className="mt-4">
            <legend className="font-script text-[18px] leading-none text-[#e0b43c]">
              Question 01
            </legend>
            <p className="mt-2 font-display text-[22px] leading-tight font-bold">
              Where is your book right now?
            </p>
            <p className="mt-1.5 text-[14px] leading-snug text-ink/85">
              We are here to help. Our editors will make the difficult process of publication easier
              for you.
            </p>

            <div className="mt-4 space-y-2.5">
              {OPTIONS.map(({ id, title, hint, Icon }) => {
                const selected = stage === id;
                return (
                  <label
                    key={id}
                    className={`flex min-h-16.5 cursor-pointer items-center gap-3 rounded-[22px] border px-4 py-2 tablet-sm:gap-5 tablet-sm:px-6 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-royal ${
                      selected
                        ? "border-royal bg-royal text-white shadow-[0_10px_24px_-12px_rgb(1_87_169/0.8)]"
                        : "border-white bg-white/85 text-ink hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="book-stage"
                      value={id}
                      checked={selected}
                      onChange={() => setStage(id)}
                      className="sr-only"
                    />
                    <Icon className={`size-9 shrink-0 ${selected ? "text-white" : "text-royal"}`} />
                    <span className="grow">
                      <span className="block font-display text-[19px] leading-tight font-semibold">
                        {title}
                      </span>
                      <span className={`block text-[15px] ${selected ? "text-white/90" : ""}`}>
                        {hint}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid size-6.5 shrink-0 place-items-center rounded-full border-[3px] border-sun ${
                        selected ? "bg-sun" : ""
                      }`}
                    >
                      {selected && <span className="size-2.5 rounded-full bg-white" />}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5 flex items-center justify-between">
            <button
              type="button"
              disabled
              className="flex h-11 items-center gap-2 rounded-full bg-slate-300/50 pr-5 pl-1.5 font-display font-semibold text-slate-400"
            >
              <span className="grid size-8 place-items-center rounded-full bg-white/80">
                <ArrowLeftIcon className="size-4" />
              </span>
              Back
            </button>
            <button
              type="submit"
              className="flex h-11 cursor-pointer items-center gap-2 rounded-full bg-sun pr-1.5 pl-5 font-display font-semibold text-ink hover:bg-[#f6d673] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
            >
              Next
              <span className="grid size-8 place-items-center rounded-full bg-white">
                <ArrowRightIcon className="size-4" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
