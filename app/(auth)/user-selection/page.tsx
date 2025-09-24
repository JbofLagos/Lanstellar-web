"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const [selected, setSelected] = useState<"asset" | "liquidity" | null>(null);

  const handleSelect = (type: "asset" | "liquidity") => {
    setSelected(type);
  };

  const handleContinue = () => {
    if (!selected) return; // Prevent continue without selection
    console.log("Selected:", selected);
    // redirect or store in context / state management
  };

  return (
    <div className="h-screen bg-[url('/heropatern.svg')] font-inter justify-center relative items-center flex flex-col bg-white bg-center bg-cover">
      {/* Logo */}
      <div className="self-start ml-[20px] z-50 mt-[10px] top-0 left-0 absolute">
        <Image src={"/logo3.svg"} height={48} width={174} alt="logo" />
      </div>

      {/* Card Container */}
      <div className="flex justify-center items-center">
        <div className="space-y-5 flex justify-center flex-col px-[40px] py-[80px] bg-[#FCFCFC] border border-[#E4E3EC] border-dashed rounded-[20px] h-auto w-[968px] max-w-full">
          {/* Heading */}
          <div>
            <h2 className="font-inter font-semibold text-[20px]">
              How would you describe yourself? 🤔
            </h2>
            <p className="text-[#8C94A6] text-[13px] font-medium">
              Select the type of account you want to create. This helps us
              tailor your experience.
            </p>
          </div>

          {/* Selection Cards */}
          <form className="gap-4 mt-4 flex flex-col justify-between ">
            <div className=" flex flex-col md:flex-row justify-center items-center gap-6">
              <div
                onClick={() => handleSelect("asset")}
                className={`rounded-[20px] p-[4px] cursor-pointer transition-all ${
                  selected === "asset"
                    ? "bg-gradient-to-br from-[#439EFF] to-[#5B1E9F]"
                    : "bg-[#F4F3F7]"
                }`}
              >
                <div className="w-full md:w-[420px] h-[190px] rounded-[18px] bg-white p-[24px] flex flex-col gap-2">
                  <img
                    src="/mananger.png"
                    alt=""
                    className="h-[60px] w-[60px]"
                  />
                  <h2 className="text-black font-semibold text-[20px]">
                    Asset manager
                  </h2>
                  <p className="text-[#8C94A6] text-[13px] font-medium">
                    Owned by businesses and organizations who need stable loans
                    in minutes
                  </p>
                </div>
              </div>

              {/* Liquidity Provider */}
              <div
                onClick={() => handleSelect("liquidity")}
                className={`rounded-[20px] p-[4px] cursor-pointer transition-all ${
                  selected === "liquidity"
                    ? "bg-gradient-to-br from-[#439EFF] to-[#5B1E9F]"
                    : "bg-[#F4F3F7]"
                }`}
              >
                <div className="w-full md:w-[420px] h-[190px] rounded-[18px] bg-white p-[24px] flex flex-col gap-2">
                  <img
                    src="/provider.png"
                    alt=""
                    className="h-[60px] w-[60px]"
                  />
                  <h2 className="text-black font-semibold text-[20px]">
                    Liquidity provider
                  </h2>
                  <p className="text-[#8C94A6] text-[13px] font-medium">
                    Provide liquidity in stablecoins and earn predictable yields
                    from loans backed by real-world assets.
                  </p>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-row justify-between gap-6 mt-10">
              <Link href={"/login"}>
                <Button
                  variant={"outline"}
                  className="py-2 shadow-none text-[13.78px] rounded-md font-medium hover:opacity-90 transition-opacity mt-2 cursor-pointer flex items-center gap-2"
                >
                  <img
                    src="/icons/arrow-left.svg"
                    alt=""
                    className="h-[20px] w-[20px]"
                  />
                  Go Back
                </Button>
              </Link>
              <Link href={"/informations"}>
                <Button
                  onClick={handleContinue}
                  disabled={!selected}
                  className={`bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] text-white text-[13.78px] py-2 px-[20px] rounded-md font-medium hover:opacity-90 transition-opacity mt-2 cursor-pointer ${
                    !selected ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Continue
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
