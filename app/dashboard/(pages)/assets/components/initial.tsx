import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import React from "react";

const Initial = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 h-screen">
        <Image
          src="/empty.svg"
          alt="Logo"
          width={100}
          height={100}
          className=" w-[215px] h-[142.01px]"
        />
        <h2 className=" text-[20px] font-semibold ">Assets</h2>
        <p className="text-[13.78px] text-[#8C94A6] font-medium">
          You haven’t added any asset! Add one and get started.
        </p>
        <Button className="bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] text-white px-4 py-2 rounded-[10px] flex items-center gap-2">
          <Plus />
          Add Asset
        </Button>
      </div>
    </div>
  );
};

export default Initial;
