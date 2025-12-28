import { HeroSection } from "@/components/landing-page/HeroSection";
import BacktestTable from "@/components/landing-page/BacktestTable";
import HowItWorksSkewStack from "@/components/landing-page/HowItWorksSection";
import ParticleSphereScroll from "@/components/landing-page/FloatingParticlesSphere";
import { Reviews } from "@/components/landing-page/Reviews";
import Footer from "@/components/landing-page/Footer";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChartCompareToBitcoin from "@/components/landing-page/ChartCompareToBitcoin";
import StaticDitherBackground from "@/components/landing-page/StaticDitherBackground";
import Philosophy from "@/components/landing-page/Philosophy";

export default async function Home() {
  const { userId } = await auth();
  if (userId != null) redirect("/instances");
  return (
    <main>
      <HeroSection />
      {/* <BluePixelAnimation /> */}
      <ParticleSphereScroll />
      <ChartCompareToBitcoin />
      <StaticDitherBackground />
      <BacktestTable />
      <Philosophy />
      <HowItWorksSkewStack />
      <Reviews />
      <Footer />
    </main>
  );
}
