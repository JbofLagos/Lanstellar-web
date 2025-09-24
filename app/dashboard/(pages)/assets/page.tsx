import React from "react";
import AssetHeader from "./components/asset-header";
import AssetsList from "./components/assets-list";
//import Image from "next/image";
//import { Button } from "@/components/ui/button";
//import { CircleAlert, Plus } from "lucide-react";
//import { Dialog, DialogTrigger } from "@/components/ui/dialog";
//import AddAssetsDialog from "./components/add-assets-dialog";

const Page = () => {
  return (
    <div className="">
      {/*
      <div className="flex p-6 flex-col items-center justify-center gap-4 h-screen">
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className=" cursor-pointer bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] text-white px-4 py-2 rounded-[10px] flex items-center gap-2">
              <Plus />
              Add Asset
            </Button>
          </DialogTrigger>
          <AddAssetsDialog />
        </Dialog>
      </div>
      <div className="flex justify-center items-center ">
        <div className="bg-gradient-to-r from-[#468FF7] to-[#844CCB] w-fit p-[1px] flex justify-center items-center rounded-full">
          <div className="   bg-white rounded-full h-[26px] w-fit flex justify-center items-center px-2 mx-auto">
            <h2 className=" text-[#8C94A6]  flex flex-row items-center justify-center gap-1 font-semibold text-[12.6px] ">
              <CircleAlert
                size={25}
                className="text-[#8C94A6] w-[14.75px] h-[14.75px]"
                strokeWidth={1.5}
              />{" "}
              Learn more about how asset works!
            </h2>
          </div>
        </div>
      </div>*/}
      <AssetHeader />
      <div className="">
        <AssetsList />
      </div>
    </div>
  );
};

export default Page;
