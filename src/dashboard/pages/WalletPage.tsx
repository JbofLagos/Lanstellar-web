import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function WalletPage() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="p-4">
      <div className="w-full space-y-5 ">
        {/* <div className="flex flex-col gap-2">
          <h1 className="text-[15.5px] text-black font-medium">Wallet</h1>
        </div> */}
        <div className="w-full bg-gradient-to-r from-[#1c1c1c] to-[#5B1E9F] p-5 rounded-[5.17px]">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <h1 className="text-[14px] text-white/70 font-normal">
                Available Balance
              </h1>
              {isVisible ? (
                <Eye
                  className="w-4 h-4 text-white cursor-pointer"
                  onClick={() => setIsVisible(!isVisible)}
                />
              ) : (
                <EyeOff
                  className="w-4 h-4 text-white cursor-pointer"
                  onClick={() => setIsVisible(!isVisible)}
                />
              )}
            </div>
            <h1 className="text-[36px] -mt-1 text-white font-semibold">
              {isVisible ? "$0.0" : "********"}
            </h1>
          </div>
          <div className="mt-3 flex gap-3 items-center w-full">
            <button className="bg-white/30 hover:bg-white/50 transition-all duration-300 text-white px-4 py-1.5 rounded-full text-[12px] font-medium cursor-pointer">
              Deposit
            </button>
            <button className="bg-white/30 hover:bg-white/50 transition-all duration-300 text-white px-4 py-1.5 rounded-full text-[12px] font-medium cursor-pointer">
              Withdraw
            </button>
          </div>
        </div>
        <div className="w-full space-y-4">
          <h1 className="text-[15.5px] text-black font-medium">
            Transaction History
          </h1>
        </div>
      </div>
    </div>
  );
}
