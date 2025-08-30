import { HeroSection } from "@/components/landing-page/HeroSection";
import { ResultsTable } from "@/components/landing-page/ResultsTable";

export default function Home() {
  return (
    <main className="h-screen">
      <HeroSection />
      <ResultsTable />
    </main>
  );
}
