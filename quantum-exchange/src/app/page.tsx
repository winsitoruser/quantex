import AnnouncementBanner from "@/components/home/AnnouncementBanner";
import HeroSection from "@/components/home/HeroSection";
import MarketOverview from "@/components/home/MarketOverview";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <AnnouncementBanner />
      <HeroSection />
      <MarketOverview />
      <FeaturesSection />
      <StatsSection />
      <Footer />
    </main>
  );
}
