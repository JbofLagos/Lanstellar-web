import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <section className="relative min-h-screen bg-[#F5F5F5] bg-[url('/heropatern.svg')] bg-cover bg-center flex flex-col items-center justify-center">
      {/* Background Noise */}
      <Image
        src="/heronoise.png"
        alt="hero"
        width={1200}
        height={800}
        className="absolute top-0 left-0 w-full h-full z-0 opacity-20 object-cover"
      />

      {/* Main Content */}
      <div className="relative z-20 text-center px-4 my-16 sm:my-20 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] text-[#212121] leading-snug md:leading-[72px] font-medium font-helvetica">
          Bridging traditional assets with
          <br className="hidden sm:block" /> decentralized finance.
        </h1>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Button className="h-[50px] sm:h-[56px] w-full sm:w-[190px] font-inter text-[14px] sm:text-[16px] bg-gradient-to-t from-[#2E2E2E] to-[#4A4A4A] text-white px-6 py-3 rounded-full">
            Request a Loan
          </Button>
          <Button className="bg-white h-[50px] sm:h-[56px] w-full sm:w-[190px] font-inter text-[14px] sm:text-[16px] text-black px-6 py-3 rounded-full">
            Start Investing
          </Button>
        </div>
      </div>

      {/* Floating Image */}
      <div className="absolute w-[120px] sm:w-[160px] md:w-[200px] bottom-16 left-2 sm:left-6 opacity-80">
        <Image
          src="/assets.png"
          alt="coins"
          width={200}
          height={235}
          className="object-contain"
        />
      </div>

      {/* Footer Bar */}
      <div className="absolute bottom-0 z-20 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0 px-6 sm:px-12 md:px-[100px] py-6">
          {/* Logo */}
          <div className="flex items-center justify-center sm:justify-start">
            <Image src="/logo2.svg" alt="logo" width={120} height={40} />
          </div>

          {/* Navigation */}
          <nav>
            <ul className="flex flex-col sm:flex-row gap-4 sm:gap-[40px] font-inter text-[16px] sm:text-[18px] font-medium text-[#151515] text-center">
              <li className="cursor-pointer">Demo</li>
              <li className="cursor-pointer">Features</li>
              <li className="cursor-pointer">Contact</li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Footer;
