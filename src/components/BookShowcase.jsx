import bookBack from "@/assets/images/book-back.webp";
import bookFront from "@/assets/images/book-front.webp";
import bookFan from "@/assets/images/book-fan.webp";
import logo from "@/assets/images/logo.webp";

// No GSAP here. LandingPage.jsx runs the whole sequence:
//   back cover rises → 3D flip to the front cover → books fan out → books collapse into the logo.
//
// In the story layout every image is stacked inside `.book-frame` using coordinates measured from
// the Figma frame, so the cross-fades line up. The fanned-out image already contains the front
// cover in the same spot, which makes the front → fan cross-fade seamless.
// Images use `mix-blend-multiply` so their white backgrounds disappear into the white scene.
export default function BookShowcase() {
  return (
    <section className="scene scene-book relative bg-white px-5 py-20 story:absolute story:inset-0 story:z-0 story:p-0">
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center gap-14 story:block story:h-full">
        <div className="book-frame relative w-full max-w-[320px] story:absolute story:top-[66px] story:left-[280px] story:h-[635px] story:w-[700px] story:max-w-none">
          <img
            src={bookBack}
            alt=""
            aria-hidden="true"
            className="book-back hidden mix-blend-multiply story:absolute story:top-[10px] story:left-[140px] story:block story:w-[560px]"
          />
          <img
            src={bookFront}
            alt="Embracing Vulnerability by Dominic McFarland, published by Cambridge Book Publishing"
            className="book-front reveal w-full mix-blend-multiply story:absolute story:top-[80px] story:left-[170px] story:w-[510px]"
          />
          <img
            src={bookFan}
            alt=""
            aria-hidden="true"
            className="book-fan hidden mix-blend-multiply story:absolute story:inset-0 story:block story:w-[700px]"
          />
        </div>

        <div className="flex flex-col items-center story:absolute story:inset-x-0 story:top-[352px]">
          <img
            src={logo}
            alt="Cambridge Book Publishing"
            className="brand-logo reveal w-[280px] mix-blend-multiply tablet-sm:w-[360px] story:w-[430px]"
          />
          <div
            aria-hidden="true"
            className="brand-shadow mt-10 h-6 w-[85%] max-w-[800px] rounded-[50%] bg-[radial-gradient(closest-side,rgb(15_23_42/0.35),transparent)] blur-[5px] story:mt-[170px] story:w-[800px]"
          />
        </div>
      </div>
    </section>
  );
}
