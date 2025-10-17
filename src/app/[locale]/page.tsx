import { HeroSection } from "@/components/landing-page/HeroSection";
import BacktestTable from "@/components/landing-page/BacktestTable";
import HowItWorksSkewStack from "@/components/landing-page/HowItWorksSection";
import ParticleSphereScroll from "@/components/landing-page/FloatingParticlesSphere";
import { Reviews } from "@/components/landing-page/Reviews";
import Footer from "@/components/landing-page/Footer";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId != null) redirect("/instances");
  return (
    <main>
      <HeroSection />
      <BacktestTable />
      <ParticleSphereScroll />
      <HowItWorksSkewStack />
      <Reviews />
      <Footer />
    </main>
  );
}
