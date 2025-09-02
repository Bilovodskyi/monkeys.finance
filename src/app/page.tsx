import { HeroSection } from "@/components/landing-page/HeroSection";
import { ResultsTable } from "@/components/landing-page/ResultsTable";
import HowItWorksSkewStack from "@/components/landing-page/test";

export default function Home() {
  return (
    <main className="h-screen">
      <HeroSection />
      <ResultsTable />
      <HowItWorksSkewStack />
    </main>
  );
}
