import React from "react";
import AssetsChart from "./components/assets-chart";
import AssetsTransaction from "./components/assets-transaction";
import LoanAllocation from "./components/loan-allocation";

const Page = () => {
  return (
    <div className=" font-inter space-y-[27px] p-6">
      <div className=" flex flex-row justify-between items-center mb-6">
        <span className=" text-[15.5px] text-black gap-2 flex items-center font-medium">
          Total Capital Allocated
        </span>
        <div className=" flex items-end gap-1">
          <span className=" font-semibold text-[15.5px]">$223,433.78</span>
          <span className=" text-[#339969] text-[10.34px] font-light">
            +3.8%
          </span>
          <span className=" text-[#339969] text-[10.34px] font-medium">
            +$102.88
          </span>
        </div>
      </div>
      <div className="">
        <AssetsChart />
      </div>
      <div className=" w-full flex justify-between flex-col md:flex-row gap-6">
        <div className="w-[692px]">
          <AssetsTransaction />
        </div>
        <div className="w-[392px] h-[348px]">
          <LoanAllocation />
        </div>
      </div>
    </div>
  );
};

export default Page;
