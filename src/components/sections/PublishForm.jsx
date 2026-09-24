import { useRef, useState } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'
import underline from '../../assets/form/underline.svg'
import iconPhone from '../../assets/form/icon-phone.svg'
import iconLocation from '../../assets/form/icon-location.svg'
import iconEmail from '../../assets/form/icon-email.svg'
import iconManuscript from '../../assets/form/icon-manuscript.svg'
import iconDraft from '../../assets/form/icon-draft.svg'
import iconIdea from '../../assets/form/icon-idea.svg'
import arrow24 from '../../assets/form/arrow-24.svg'
import bgWave1 from '../../assets/form/bg-wave-1.svg'
import bgWave2 from '../../assets/form/bg-wave-2.svg'
import bgEllipse1 from '../../assets/form/bg-ellipse-1.svg'
import bgEllipse2 from '../../assets/form/bg-ellipse-2.svg'
import bgBlob from '../../assets/form/bg-blob.svg'
import sparkleA from '../../assets/form/sparkle-a.svg'
import sparkleB from '../../assets/form/sparkle-b.svg'
import sparkleC from '../../assets/form/sparkle-c.svg'
import sparkleD from '../../assets/form/sparkle-d.svg'
import sparkleE from '../../assets/form/sparkle-e.svg'
import clouds from '../../assets/hero/clouds.png'

const CONTACT = [
  { icon: iconPhone, label: 'Phone No', value: '+1(514) 578-4779', href: 'tel:+15145784779' },
  { icon: iconLocation, label: 'Location', value: 'Quebec, Canada' },
  { icon: iconEmail, label: 'Email Address', value: 'eugene.museve@aliongoaero.com', href: 'mailto:eugene.museve@aliongoaero.com' },
]

// Question 1 is from the comp; 2–4 are placeholders so the stepper works
// end to end. Swap the copy when the real questions land.
const QUESTIONS = [
  {
    title: 'Where is your book right now?',
    hint: 'We are here to help. Our editors will make the difficult process of publication easier for you.',
    options: [
      { icon: iconManuscript, title: 'Complete manuscript', text: 'Finished and ready for editing' },
      { icon: iconDraft, title: 'Draft manuscript', text: 'Written, but it needs work' },
      { icon: iconIdea, title: 'Just an idea so far', text: 'Concept stage, needs guidance' },
    ],
  },
  {
    title: 'What kind of book is it?',
    hint: 'Genre shapes the editing, design and distribution plan we recommend.',
    options: [
      { icon: iconManuscript, title: 'Fiction', text: 'Novels, short stories, poetry' },
      { icon: iconDraft, title: 'Non-fiction', text: 'Memoir, self-help, history, business' },
      { icon: iconIdea, title: "Children's book", text: 'Picture books and early readers' },
    ],
  },
  {
    title: 'Which services do you need?',
    hint: 'Pick the closest match. We will fine-tune the package together.',
    options: [
      { icon: iconManuscript, title: 'Editing only', text: 'Copy editing and proofreading' },
      { icon: iconDraft, title: 'Editing and design', text: 'Plus cover and interior layout' },
      { icon: iconIdea, title: 'Full publishing', text: 'Editing, design, distribution, marketing' },
    ],
  },
  {
    title: 'When would you like to publish?',
    hint: 'Timelines help us schedule your editor and designer.',
    options: [
      { icon: iconManuscript, title: 'As soon as possible', text: 'Ready to start this month' },
      { icon: iconDraft, title: 'In the next 3–6 months', text: 'Still finishing the manuscript' },
      { icon: iconIdea, title: 'Not sure yet', text: 'Exploring options for now' },
    ],
  },
]

// Sparkles inside the form's tinted background, as % of the 1683x982 art box.
const SPARKLES = [
  { src: sparkleA, left: 50, top: 61.25, w: 3.5 },
  { src: sparkleB, left: 95.47, top: 12.67, w: 2.03 },
  { src: sparkleA, left: 7.24, top: 46.37, w: 3.5 },
  { src: sparkleC, left: 64.43, top: 62.72, w: 1.82 },
  { src: sparkleC, left: 63.49, top: 45, w: 1.82 },
  { src: sparkleD, left: 85.47, top: 43.71, w: 3.28 },
  { src: sparkleE, left: 50.83, top: 13.96, w: 2.56 },
]

function FormBackground() {
  return (
    <div
      className="pointer-events-none absolute top-1/2 left-1/2 aspect-[1683/982] w-[169%] -translate-x-1/2 -translate-y-1/2 overflow-clip bg-[#76b7ff] opacity-30"
      aria-hidden="true"
    >
      <img src={bgWave1} alt="" className="absolute top-[43.75%] left-[35.84%] w-[82.14%] max-w-none" />
      <img src={bgWave2} alt="" className="absolute top-[51.07%] left-[35.84%] w-[82.14%] max-w-none" />
      <img src={bgEllipse1} alt="" className="absolute top-1/2 left-1/2 w-[87.15%] max-w-none -translate-x-1/2 -translate-y-1/2" />
      <img src={bgBlob} alt="" className="absolute top-[-7.86%] left-[-8.86%] w-[39.21%] max-w-none" />
      <img src={bgEllipse2} alt="" className="absolute top-[-2.63%] left-full w-[72.7%] max-w-none -translate-x-1/2 -translate-y-1/2" />
      {SPARKLES.map((s, i) => (
        <img key={i} src={s.src} alt="" className="absolute max-w-none" style={{ left: `${s.left}%`, top: `${s.top}%`, width: `${s.w}%` }} />
      ))}
      <img src={clouds} alt="" className="absolute top-[66.43%] left-[-16.88%] w-[45.57%] max-w-none mix-blend-color-burn" />
    </div>
  )
}

function Radio({ selected }) {
  return (
    <span className="grid size-[max(28px,calc(38*var(--u)))] shrink-0 place-items-center rounded-full border-[max(4px,calc(5.5*var(--u)))] border-gold bg-white">
      <span className={`size-[max(8px,calc(11.5*var(--u)))] rounded-full bg-gold transition-transform duration-200 ${selected ? 'scale-100' : 'scale-0'}`} />
    </span>
  )
}

function PublishForm() {
  const container = useRef(null)
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [answers, setAnswers] = useState([2, null, null, null])
  const question = QUESTIONS[step]
  const isFirst = step === 0
  const isLast = step === QUESTIONS.length - 1

  // Slide the question block in whenever the step changes.
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from('.form-question > *', { x: 32, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out' })
    })
    return () => mm.revert()
  }, { scope: container, dependencies: [step, done] })

  const choose = (index) => setAnswers((prev) => prev.map((a, i) => (i === step ? index : a)))
  const next = () => (isLast ? setDone(true) : setStep((s) => s + 1))
  const back = () => {
    if (done) setDone(false)
    else if (!isFirst) setStep((s) => s - 1)
  }

  return (
    <section ref={container} className="flex flex-col gap-10 px-(--gutter) py-(--pad) lg:flex-row lg:items-center lg:gap-[calc(80*var(--u))]">
      {/* Intro + contact details */}
      <div className="flex flex-1 flex-col gap-[max(32px,calc(60*var(--u)))]">
        <div className="flex flex-col gap-[max(6px,calc(8*var(--u)))]" data-reveal>
          <h2 className="t-h3 relative w-fit text-navy">
            Ready to Turn Manuscript<br />
            Into a{' '}
            <span className="relative inline-block">
              Published eBook?
              <img
                src={underline}
                alt=""
                aria-hidden="true"
                className="absolute top-full left-0 w-full max-w-none -translate-y-[35%] rotate-[2.39deg]"
              />
            </span>
          </h2>
          <p className="t-body-xl text-navy">
            Tell us a little about your book and publishing goals. Our team will review your project.
          </p>
        </div>
        <ul className="flex flex-col gap-[max(20px,calc(40*var(--u)))]" data-reveal-stagger>
          {CONTACT.map((item) => (
            <li key={item.label} className="flex items-center gap-[max(14px,calc(24*var(--u)))]">
              <img src={item.icon} alt="" className="aspect-square w-[max(40px,calc(50*var(--u)))] shrink-0" />
              <div className="flex flex-col gap-[calc(8*var(--u))]">
                <p className="t-h5 text-navy">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="t-body-lg text-muted transition-colors hover:text-navy">{item.value}</a>
                ) : (
                  <p className="t-body-lg text-muted">{item.value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Quiz card */}
      <div
        className="relative flex flex-1 flex-col justify-between gap-8 overflow-clip rounded-[max(24px,calc(48*var(--u)))] bg-white px-[max(20px,calc(56*var(--u)))] py-[max(24px,calc(48*var(--u)))] lg:min-h-[calc(819*var(--u))]"
        data-reveal
        data-reveal-delay="0.1"
      >
        <FormBackground />

        <div className="relative flex flex-col gap-[max(6px,calc(8*var(--u)))]">
          <h3 className="t-h3 text-navy">Publish Your Book</h3>
          <p className="t-body text-navy">
            Answer four quick questions and we'll recommend the right package, with the price shown up front. You keep 100% of your rights and royalties.
          </p>
        </div>

        <div className="relative flex flex-col gap-[max(16px,calc(24*var(--u)))]">
          {/* Stepper */}
          <ol className="flex h-[max(8px,calc(11*var(--u)))] gap-1" aria-label={`Step ${step + 1} of ${QUESTIONS.length}`}>
            {QUESTIONS.map((_, i) => (
              <li key={i} className={`flex-1 rounded-full transition-colors duration-300 ${done || i <= step ? 'bg-gold' : 'bg-gold/50'}`} />
            ))}
          </ol>

          {done ? (
            <div className="form-question flex flex-col gap-[max(8px,calc(16*var(--u)))]" key="done">
              <p className="font-script text-[max(18px,calc(24*var(--u)))] leading-none tracking-[-0.02em] text-gold">
                All four answered
              </p>
              <p className="t-h4 text-navy">Thanks — we have what we need.</p>
              <p className="t-body text-navy">
                Our team will put together the package that fits and come back to you with the price
                up front. Use Back if you want to change an answer.
              </p>
            </div>
          ) : (
          <div className="form-question flex flex-col gap-[max(16px,calc(32*var(--u)))]" key={step}>
            <div className="flex flex-col gap-[max(8px,calc(16*var(--u)))]">
              <p className="font-script text-[max(18px,calc(24*var(--u)))] leading-none tracking-[-0.02em] text-gold">
                Question {String(step + 1).padStart(2, '0')}
              </p>
              <div className="flex flex-col gap-[calc(8*var(--u))] text-navy">
                <p className="t-h4">{question.title}</p>
                <p className="t-body">{question.hint}</p>
              </div>
            </div>

            <div className="flex flex-col gap-[max(8px,calc(12*var(--u)))]" role="radiogroup" aria-label={question.title}>
              {question.options.map((opt, i) => {
                const selected = answers[step] === i
                return (
                  <button
                    key={opt.title}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => choose(i)}
                    className={`flex w-full cursor-pointer items-center gap-[max(10px,calc(16*var(--u)))] rounded-[max(20px,calc(36*var(--u)))] px-[max(14px,calc(24*var(--u)))] py-[max(10px,calc(16*var(--u)))] text-left transition-[background-color,border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                      selected
                        ? 'border-4 border-[#1671d3] bg-[linear-gradient(128deg,#0063c2_7%,#014e98_105%)] text-white'
                        : 'border border-[#d4e7fc] bg-white text-navy hover:border-[#9cc6f5]'
                    }`}
                  >
                    <img src={opt.icon} alt="" className={`aspect-square w-[max(36px,calc(58*var(--u)))] shrink-0 object-contain ${selected ? 'brightness-0 invert' : ''}`} />
                    <span className="flex flex-1 flex-col leading-[1.4]">
                      <span className="font-body text-[max(16px,calc(24*var(--u)))] font-bold">{opt.title}</span>
                      <span className="t-body">{opt.text}</span>
                    </span>
                    <Radio selected={selected} />
                  </button>
                )
              })}
            </div>
          </div>
          )}
        </div>

        <div className="relative flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={isFirst && !done}
            className="flex h-[max(44px,calc(60*var(--u)))] cursor-pointer items-center gap-[calc(9*var(--u))] rounded-full bg-[#c0c0c0] pr-[max(14px,calc(18*var(--u)))] pl-[max(8px,calc(12*var(--u)))] font-display text-[max(15px,calc(24*var(--u)))] font-semibold text-navy transition-opacity disabled:cursor-default disabled:opacity-40"
          >
            <span className="grid size-[max(32px,calc(45*var(--u)))] place-items-center rounded-full bg-white">
              <img src={arrow24} alt="" className="w-[max(16px,calc(24*var(--u)))] rotate-180" />
            </span>
            Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={done}
            className="group flex h-[max(44px,calc(60*var(--u)))] disabled:cursor-default disabled:opacity-40 cursor-pointer items-center gap-[calc(9*var(--u))] rounded-full bg-gold pr-[max(8px,calc(12*var(--u)))] pl-[max(14px,calc(18*var(--u)))] font-display text-[max(14px,calc(15.75*var(--u)))] font-semibold text-navy transition-colors hover:bg-gold-light"
          >
            {done ? 'Done' : isLast ? 'Finish' : 'Next'}
            <span className="grid size-[max(32px,calc(45*var(--u)))] place-items-center rounded-full bg-white">
              <img src={arrow24} alt="" className="w-[max(16px,calc(24*var(--u)))] transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default PublishForm
