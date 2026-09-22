import ProcessSection from "../../components/ProcessSection";
import BookShowcase from "../../components/BookShowcase";
import StatsStrip from "../../components/StatsStrip";

const Home = () => {
  return (
    <div>
      <ProcessSection />
        <StatsStrip />
      <BookShowcase />
    </div>
  );
};

export default Home;
