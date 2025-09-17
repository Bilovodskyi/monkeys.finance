import { HeroSection } from "@/components/landing-page/HeroSection";
import { ResultsTable } from "@/components/landing-page/ResultsTable";
import HowItWorksSkewStack from "@/components/landing-page/HowItWorksSection";
import ParticleSphereScroll from "@/components/landing-page/FloatingParticlesSphere";
import { Reviews } from "@/components/landing-page/Reviews";
import Footer from "@/components/landing-page/Footer";

export default function Home() {
  return (
    <main className="h-screen">
      <HeroSection />
      <ResultsTable />
      <ParticleSphereScroll />
      <HowItWorksSkewStack />
      <Reviews />
      <Footer />
    </main>
  );
}
