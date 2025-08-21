import { Button } from "@/components/ui/button";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-[#151515] bg-[url('/heropatern.svg')] bg-cover bg-center text-white flex flex-col items-center justify-center rounded-b-[24px] sm:rounded-b-[32px] lg:rounded-b-[40px]">
      {/* Noise background */}
      <Image
        src="/heronoise.png"
        alt="hero"
        width={1200}
        height={800}
        className="absolute top-0 left-0 w-full h-full z-0 opacity-20 object-cover"
      />

      {/* Content */}
      <div className="relative z-20 text-center max-w-3xl px-4 mt-16 sm:mt-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight md:leading-[56px] lg:leading-[72px] font-medium font-helvetica">
          Stablecoin Lending,
          <br className="hidden sm:block" /> For Real World Assets
        </h1>

        <p className="mt-4 text-gray-300 text-base sm:text-lg md:text-xl lg:text-[20px] leading-relaxed font-inter">
          Lanstellar connects asset owners, liquidity providers and asset{" "}
          <br className="hidden md:block" />
          managers for stable coin Loans. Tokenize real-world value.
          <br className="hidden md:block" /> Unlock stable-coin liquidity.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button className="h-[48px] sm:h-[56px] w-full sm:w-[190px] font-inter text-[14px] sm:text-[16px] bg-gradient-to-t from-[#2E2E2E] to-[#4A4A4A] text-white px-6 py-3 rounded-full">
            Request a Loan
          </Button>
          <Button className="bg-white h-[48px] sm:h-[56px] w-full sm:w-[190px] font-inter text-[14px] sm:text-[16px] text-black px-6 py-3 rounded-full">
            Partner with Us
          </Button>
        </div>

        {/* Trusted by */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="-space-x-2 flex items-center">
            <Image
              src="/lisk.png"
              alt="crypto"
              width={28}
              height={28}
              className="rounded-full sm:w-8 sm:h-8"
            />
            <Image
              src="/base.png"
              alt="crypto"
              width={28}
              height={28}
              className="rounded-full sm:w-8 sm:h-8"
            />
            <Image
              src="/moonriver.png"
              alt="crypto"
              width={28}
              height={28}
              className="rounded-full sm:w-8 sm:h-8 bg-white"
            />
            <Image
              src="/moonbeam.png"
              alt="crypto"
              width={28}
              height={28}
              className="rounded-full sm:w-8 sm:h-8"
            />
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">
            Trusted by leading crypto companies
          </p>
        </div>
      </div>

      {/* Decorative images */}
      <div className="absolute bottom-0 right-0 w-[180px] sm:w-[240px] lg:w-[307px]">
        <Image src="/coins.png" alt="coins" width={307} height={307} />
      </div>
      <div className="absolute -top-16 sm:-top-24 lg:-top-33 -left-20 sm:-left-32 lg:-left-44 transform -rotate-45 w-[160px] sm:w-[220px] lg:w-[307px]">
        <Image src="/coins.png" alt="coins" width={307} height={307} />
      </div>
    </section>
  );
};

export default Hero;
