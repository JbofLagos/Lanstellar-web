import Image from "next/image";
import React from "react";
import LoanPosition from "./components/loan-position";

const Page = () => {
  return (
    <div>
      <div className=" flex justify-between items-center border-b-[1px] border-[#F4F3F7] p-4 mb-4">
        <div className="bg-[#F7F7F8]  whitespace-nowrap text-[13.78px] text-[#8C94A6]  w-fit h-[37px] rounded-[10px] flex items-center gap-2 px-3  border-[1px] border-[#F4F3F7]">
          <Image
            src="/icons/filter.svg"
            alt="Description of the image"
            width={16}
            height={16}
          />
          Sorted by <span className=" text-[#1A1A21]">Date added</span>
        </div>
      </div>
      <div className=" px-6">
        <LoanPosition />
      </div>
    </div>
  );
};

export default Page;
