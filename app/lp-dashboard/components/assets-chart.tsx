import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import Chart from "./chart";

const AssetsChart = () => {
  return (
    <Card className="w-full md:h-[430.67px] shadow-lg h-fit border-[0.86px]  border-[#E4E3EC] rounded-[5.17px] flex flex-col px-[24.98px]">
      <CardContent className="flex-1 p-0 ">
        <div className="flex md:h-full   flex-col md:flex-row">
          <div className="flex-1 flex flex-col ">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-3">
                <div className="h-[40px] w-[48px] bg-gradient-to-r from-[#1F90FF] to-[#504CF6] shadow-[0px_1px_2px_rgba(30,144,255,0.65)] rounded-full flex justify-center items-center">
                  <Image
                    src={"/icons/spark.svg"}
                    alt="spark"
                    width={20.67}
                    height={20.67}
                    className="w-[20.67px] h-[20.67px]"
                  />
                </div>
                <span className="text-[41px] font-medium text-[#1A1A21]">
                  $0
                  <span className="text-[25.84px] text-[#8C94A6]">.00</span>
                </span>
              </div>
            </div>

            <div className="">
              <div className="w-full h-[250px]">
                <Chart />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetsChart;
