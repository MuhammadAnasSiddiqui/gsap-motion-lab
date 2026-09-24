import DesignCanvas from "../../components/DesignCanvas";
import HeroSection from "../../components/HeroSection";
import ProcessSection from "../../components/ProcessSection";
import BookShowcase from "../../components/BookShowcase";
import StatsStrip from "../../components/StatsStrip";
import SiteHeader from "../../components/SiteHeader";
import TapToScroll from "../../components/TapToScroll";

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
      <BookShowcase />
    </div>
  );
};

export default Home;
