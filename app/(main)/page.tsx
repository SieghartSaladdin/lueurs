import PromoBanner from "./components/PromoBanner";
import HeroSection from "./components/HeroSection";
import TrendingSection from "./components/TrendingSection";
import NewArrivalsSection from "./components/NewArrivalsSection";
import ProcessSection from "./components/ProcessSection";
import OlfactoryFamiliesSection from "./components/OlfactoryFamiliesSection";

export default function MainPage() {
  return (
    <>
      <PromoBanner />
      <HeroSection />
      <TrendingSection />
      <NewArrivalsSection />
      <ProcessSection />
      <OlfactoryFamiliesSection />
    </>
  )
}
