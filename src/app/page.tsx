import { HeroSection } from "@/components/landing-page/HeroSection";
import { ResultsTable } from "@/components/landing-page/ResultsTable";
import HowItWorksSkewStack from "@/components/landing-page/test";
import ParticleSphereScroll from "@/components/landing-page/FloatingParticlesSphere";

export default function Home() {
  return (
    <main className="h-screen">
      <HeroSection />
      <ResultsTable />
      <ParticleSphereScroll />
      <HowItWorksSkewStack />
    </main>
  );
}
