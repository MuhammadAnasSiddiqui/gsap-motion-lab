import DesignCanvas from "../../components/DesignCanvas";
import HeroSection from "../../components/HeroSection";
import ProcessSection from "../../components/ProcessSection";
import StatsStrip from "../../components/StatsStrip";
import SiteHeader from "../../components/SiteHeader";
import TapToScroll from "../../components/TapToScroll";
import FaqFooter from "../../components/sections/FaqFooter";
import Testimonials from "../../components/sections/Testimonials";
import Genres from "../../components/sections/Genres";
import Banners from "../../components/sections/Banners";
import AuthorStories from "../../components/sections/AuthorStories";
import WhyChoose from "../../components/sections/WhyChoose";
import Gallery from "../../components/sections/Gallery";
import BookSpin from "../../components/sections/BookSpin";
import PublishForm from "../../components/sections/PublishForm";

const Home = () => {
  return (
    <div>
      <SiteHeader />
      <TapToScroll />

      {/* Everything inside the canvas is laid out in Figma's own pixels. */}
      <DesignCanvas>
        <HeroSection />
        <ProcessSection />
        <StatsStrip />
      </DesignCanvas>

      {/* The motion study stays outside — it is our own responsive markup. */}
      {/* <BookShowcase /> */}

      {/* <Hero /> */}
      {/* <Stats />
      <Steps /> */}
      <PublishForm />
      <BookSpin />
      <Gallery />
      <WhyChoose />
      <AuthorStories />
      <Banners />
      <Genres />
      <Testimonials />
      <FaqFooter />
    </div>
  );
};

export default Home;
