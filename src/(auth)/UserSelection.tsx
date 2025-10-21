import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserTypePage = () => {
  const [selected, setSelected] = useState<"borrower" | "lender" | null>(null);
  const navigate = useNavigate();

  const handleSelect = (type: "borrower" | "lender") => {
    setSelected(type);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    navigate(
      selected === "borrower"
        ? `/signup?userType=${selected}`
        : `/liquidity-informations?userType=${selected}`
    );
  };

  return (
    <div className="min-h-screen bg-[url('/heropatern.svg')] bg-white/80 bg-blend-overlay font-inter flex flex-col justify-center items-center bg-center bg-cover px-4 sm:px-6 md:px-10">
      {/* Logo */}
      <div className="absolute top-4 left-4">
        <img src={"/logo3.svg"} height={40} width={150} alt="logo" />
      </div>

      {/* Card Container */}
      <div className="w-full max-w-[980px] mt-20 bg-[#FCFCFC] border border-[#E4E3EC] border-dashed rounded-[20px] p-6 sm:p-10 md:p-16 space-y-6">
        {/* Heading */}
        <div className="text-center md:text-left">
          <h2 className="font-semibold text-lg sm:text-xl md:text-2xl">
            How would you describe yourself? 🤔
          </h2>
          <p className="text-[#8C94A6] text-sm sm:text-[13px] font-medium mt-1">
            Select the type of account you want to create. This helps us tailor
            your experience.
          </p>
        </div>

        {/* Selection Cards */}
        <form className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-6 w-full">
            {/* Asset Manager */}
            <div
              onClick={() => handleSelect("borrower")}
              className={`rounded-[20px] p-[4px] w-full md:w-1/2 cursor-pointer transition-all ${
                selected === "borrower"
                  ? "bg-gradient-to-br from-[#439EFF] to-[#5B1E9F]"
                  : "bg-[#F4F3F7]"
              }`}
            >
              <div
                className={`rounded-[18px] p-6 flex flex-col gap-3 h-full ${
                  selected === "borrower" ? "bg-[#F2F7FF]" : "bg-white"
                }`}
              >
                <img
                  src="/mananger.png"
                  alt="Asset Manager"
                  className="h-[50px] w-[50px] object-contain"
                />
                <h2 className="text-black font-semibold text-lg sm:text-xl">
                  Asset manager
                </h2>
                <p className="text-[#8C94A6] text-sm sm:text-[13px] leading-relaxed">
                  Owned by businesses and organizations who need stable loans in
                  minutes.
                </p>
              </div>
            </div>

            {/* Liquidity Provider */}
            <div
              onClick={() => handleSelect("lender")}
              className={`rounded-[20px] p-[4px] w-full md:w-1/2 cursor-pointer transition-all ${
                selected === "lender"
                  ? "bg-gradient-to-br from-[#439EFF] to-[#5B1E9F]"
                  : "bg-[#F4F3F7]"
              }`}
            >
              <div
                className={`rounded-[18px] p-6 flex flex-col gap-3 h-full ${
                  selected === "lender" ? "bg-[#F2F7FF]" : "bg-white"
                }`}
              >
                <img
                  src="/provider.png"
                  alt="Liquidity Provider"
                  className="h-[50px] w-[50px] object-contain"
                />
                <h2 className="text-black font-semibold text-lg sm:text-xl">
                  Liquidity provider
                </h2>
                <p className="text-[#8C94A6] text-sm sm:text-[13px] leading-relaxed">
                  Provide liquidity in stablecoins and earn predictable yields
                  from loans backed by real-world assets.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mt-8">
            <a href={"/login"} className="w-full sm:w-auto">
              <Button
                variant={"outline"}
                className="w-full sm:w-auto py-2 shadow-none text-sm rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <img
                  src="/icons/arrow-left.svg"
                  alt=""
                  className="h-[20px] w-[20px]"
                />
                Go Back
              </Button>
            </a>

            <Button
              onClick={handleContinue}
              disabled={!selected}
              className={`w-full sm:w-auto bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] text-white text-sm py-2 px-6 rounded-md font-medium hover:opacity-90 transition-opacity ${
                !selected ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserTypePage;
