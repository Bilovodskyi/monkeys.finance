import { CustomButton } from "@/components/CustomButton";
import HeroBoard from "@/components/HeroAnimation";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen px-16 py-8">
      <main className="flex">
        <section className="flex flex-col w-1/3 px-24 pt-32">
          <div className="border border-zinc-800 rounded-full px-6 py-2 mb-6 text-[12px] font-semibold w-fit">Improved algorithm performance with ML</div>
          <h1 className="text-5xl font-title mb-6">The All in One Crypto <span className="text-highlight">Trading</span> Bot</h1>
          <p className="text-secondary mb-8">
            Our best algorithms implemented with machine learning conected to your exchange.
          </p>
          <div className="flex gap-4 items-center">

            <CustomButton isBlue={true}>Start Trading</CustomButton>
            <CustomButton isBlue={false}>Documentation</CustomButton>
          </div>
        </section>
        <section className="w-2/3 overflow-hidden">
          <HeroBoard />
        </section>
        <section className="absolute right-0 bottom-12 bg-black w-full border-y border-zinc-800 flex [&>div:not(:first-child)]:border-l [&>div]:border-zinc-800">
          <div className="flex-1 px-4 py-3"></div>
          <div className="flex-1 px-4 py-3 flex flex-col justify-center">Supported exchanges: <br /> <span className="text-secondary text-sm">we are working on adding more</span></div>
          <div className="flex items-center justify-center flex-1 px-4 py-3">
            <Image src="/exchange-logo/binance.png" alt="Binance" width={100} height={100} className="grayscale" />
          </div>
          <div className="flex items-center justify-center flex-1 px-4 py-3">
            <Image src="/exchange-logo/kraken.webp" alt="Kraken" width={100} height={100} className="brightness-0 invert" />
          </div>
          <div className="flex items-center justify-center flex-1 px-4 py-3">
            <Image src="/exchange-logo/okx.png" alt="OKX" width={100} height={100} />
          </div>
          <div className="flex items-center justify-center flex-1 px-4 py-3">
            <Image src="/exchange-logo/coinbase.png" alt="Coinbase" width={100} height={100} className="brightness-0 invert" />
          </div>
          <div className="flex-1 px-4 py-3"></div>
        </section>
      </main>
    </div>
  );
}
