import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-[#151515] bg-blend-screen bg-[url('/heropatern.svg')] bg-cover bg-center text-white flex flex-col items-center justify-center rounded-b-[24px] sm:rounded-b-[32px] lg:rounded-b-[40px]">
      {/* Noise background */}
      <img
        src="/heronoise.png"
        alt="hero"
        width={1200}
        height={800}
        className="absolute top-0 left-0 w-full h-full z-0 opacity-20 object-cover"
      />

      {/* Content */}
      <div className="relative z-20 text-center max-w-3xl px-4 mt-5 space-y-7 sm:mt-20 ">
        <h1 className="text-4xl md:text-5xl lg:text-[64px] leading-tight md:leading-[56px] lg:leading-[72px] font-medium font-helvetica">
          Stablecoin Lending,
          <br className="hidden sm:block" /> For Real World Assets
        </h1>

        <p className="mt-4 text-gray-300 text-base sm:text-lg md:text-xl lg:text-[20px] leading-relaxed font-inter">
          Lanstellar connects asset managers and{" "}
          <br className="hidden md:block" /> liquidity providers for instant
          stablecoin loans
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-row justify-center items-center gap-3 sm:gap-4">
          <a
            href="https://calendly.com/femiadegolu/30min?month=2024-05"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="h-[48px] sm:h-[56px] w-full sm:w-[190px] font-inter text-[14px] sm:text-[16px] bg-gradient-to-t from-[#2E2E2E] to-[#4A4A4A] text-white px-6 py-3 rounded-full">
              Request a Demo
            </Button>
          </a>
          <a href="#waitlist">
            <Button className="h-[48px] sm:h-[56px] w-full sm:w-[190px] font-inter text-[14px] sm:text-[16px] bg-white m-2 hover:bg-white/90 cursor-pointer text-black px-6 py-3 rounded-full">
              <Zap fill="#000000" />
              Join the Waitlist
            </Button>
          </a>
        </div>

        {/* Trusted by */}
        <div className="">
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <div className="-space-x-2 flex items-center">
              <img
                src="/lisk.png"
                alt="crypto"
                width={28}
                height={28}
                className="rounded-full sm:w-8 sm:h-8"
              />
              <img
                src="/base.png"
                alt="crypto"
                width={28}
                height={28}
                className="rounded-full sm:w-8 sm:h-8"
              />
              <img
                src="/moonriver.png"
                alt="crypto"
                width={28}
                height={28}
                className="rounded-full sm:w-8 sm:h-8 bg-white"
              />
              <img
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
      </div>

      {/* Decorative images */}
      <div className="absolute bottom-0 right-0 w-[180px] sm:w-[240px] lg:w-[307px]">
        <img src="/coins.png" alt="coins" width={307} height={307} />
      </div>
      <div className="absolute -top-16 sm:-top-24 lg:-top-33 -left-20 sm:-left-32 lg:-left-44 transform -rotate-45 w-[160px] sm:w-[220px] lg:w-[307px]">
        <img src="/coins.png" alt="coins" width={307} height={307} />
      </div>
    </section>
  );
};

export default Hero;
