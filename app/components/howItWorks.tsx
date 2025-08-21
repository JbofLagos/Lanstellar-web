import Image from "next/image";
import React from "react";

const steps = [
  {
    id: "01",
    title: "Tokenize",
    description:
      "Upload your asset for AI powered verification. We’ll mint a secure NFT onchain.",
    image: "/upload.svg",
  },
  {
    id: "02",
    title: "Loan",
    description:
      "Once verified, request a stablecoin loan with your verified asset as collateral.",
    image: "/loan.svg",
  },
  {
    id: "03",
    title: "Grow",
    description:
      "Use the funds to grow your business. Repay with interest, reclaim your asset.",
    image: "/grow.svg",
  },
];

const HowItWorks = () => {
  return (
    <section className="px-4 sm:px-8 md:px-[64px] py-12 md:py-20 relative">
      <div className="relative overflow-hidden">
        <div className="absolute -top-20 -right-28 w-[120px] sm:w-[160px] md:w-[200px] opacity-25 rotate-150">
          <Image
            src="/coins.png"
            alt="coins"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
      </div>

      {/* Section Heading */}
      <div className="flex flex-col justify-start mb-8 sm:mb-12">
        <span className="text-[#969798] text-xs sm:text-sm tracking-wide">
          SIMPLE 3 STEP FLOW
        </span>
        <h2 className="text-xl sm:text-2xl md:text-[32px] text-[#212121] font-bold font-inter">
          How Lanstellar Works..
        </h2>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white font-inter rounded-xl border border-gray-200 shadow-sm flex flex-col"
          >
            <div className="p-4 sm:p-6 space-y-3">
              <span className="text-stroke font-semibold text-lg sm:text-xl text-transparent">
                {step.id}
              </span>

              <h3 className="text-lg sm:text-xl font-bold text-[#212121]">
                {step.title}
              </h3>

              <p className="text-sm sm:text-base text-[#555555]">
                {step.description}
              </p>
            </div>

            <div
              className={`mt-auto flex justify-end ${
                index === 1 ? "pr-4 sm:pr-8" : "pl-4 sm:pl-8"
              }`}
            >
              <Image
                src={step.image}
                alt={step.title}
                width={412}
                height={120}
                className="w-24 sm:w-32 md:w-[412px] md:h-[193px] h-auto object-fil"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
