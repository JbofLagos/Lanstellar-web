const audiences = [
  { icon: "/icons/bank.svg", label: "Banks" },
  { icon: "/icons/money.svg", label: "Hard Money Lenders" },
  { icon: "/icons/properties.svg", label: "Property Owners" },
  { icon: "/icons/microfinance.svg", label: "Microfinance Institutions" },
  { icon: "/icons/defi.svg", label: "DeFi Investors" },
  { icon: "/icons/liquidity.svg", label: "Liquidity Providers" },
];

const About = () => {
  return (
    <div className="p-[32px] sm:p-[64px] space-y-8 font-inter">
      {/* Section Intro */}
      <div className="flex justify-center flex-col space-y-4">
        <h2 className="text-[24px] sm:text-[32px] font-bold text-center">
          What is <span className="text-[#5F5F60]">lanstellar ?</span>
        </h2>
        <p className="text-[#5F5F60] font-medium text-center max-w-3xl mx-auto text-base sm:text-[20px] leading-relaxed sm:leading-[34px]">
          Lanstellar is a non-custodial RWA lending platform that unlocks
          instant stable-coin liquidity for real-world asset owners and asset
          managers. We are bridging the gap between traditional asset holders
          (like real estate owners or institutions) and DeFi investors, enabling
          loans to be issued in stablecoins within minutes.
        </p>
      </div>

      {/* Decorative coins */}
      <div className="flex justify-between">
        <img
          src="/icons/coin.png"
          alt="coins"
          width={120}
          height={120}
          className="transform -rotate-45 w-[100px] sm:w-[156px]"
        />
        <img
          src="/icons/coin.png"
          alt="coins"
          width={120}
          height={120}
          className="transform rotate-45 w-[100px] sm:w-[156px]"
        />
      </div>

      {/* Target Audience */}
      <div className="space-y-10 relative">
        <div className="flex flex-col justify-center">
          <span className="text-[#969798] text-[12px] text-center">
            WHO IS LANSTELLAR FOR?
          </span>
          <h2 className="text-[24px] sm:text-[32px] text-[#212121] font-bold text-center">
            Our Target Audience
          </h2>
        </div>

        <div className="w-[90%] mx-auto absolute border ml-15 border-dashed h-0.5 top-38 hidden md:block"></div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 z-50 text-center relative">
          {audiences.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-3">
                <img
                  src={item.icon}
                  alt={item.label}
                  width={48}
                  height={48}
                  className="w-12 h-12 sm:w-16 sm:h-16"
                />
              </div>
              <p className="text-[#555555] text-xs sm:text-sm md:text-base">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
