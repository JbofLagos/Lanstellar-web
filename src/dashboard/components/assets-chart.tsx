import { CircleAlert } from "lucide-react";
import Chart from "./chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AssetsChart = () => {
  return (
    <Card className="w-full md:h-[430.67px] h-fit border-[0.86px] shadow-none border-[#E4E3EC] rounded-[5.17px] flex flex-col px-[24.98px]">
      <CardHeader className="h-[40.12px] border-b border-[#E4E3EC] flex flex-row justify-between items-center">
        <span className="text-[13.78px] text-[#1A1A21] font-medium">
          Total Tokenized Assets
        </span>
        <span className="font-semibold text-[#8C94A6] text-[10.34px] gap-2 flex items-center">
          <img
            src="/icons/calendar.svg"
            alt="calendar"
            className="w-[20.67px] h-[20.67px]"
          />
          LAST 7 DAYS
        </span>
      </CardHeader>

      <CardContent className="flex-1 p-0 ">
        <div className="flex md:h-full   flex-col md:flex-row">
          <div className="flex-1 flex flex-col ">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-3">
                <div className="h-[40px] w-[48px] bg-gradient-to-r from-[#1F90FF] to-[#504CF6] shadow-[0px_1px_2px_rgba(30,144,255,0.65)] rounded-full flex justify-center items-center">
                  <img
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
              <Button
                variant={"outline"}
                className="border shadow-none border-[#E4E3EC] h-[34.78px] w-[138.13px] rounded-[3.45px] text-[#1A1A21] text-[13.78px] gap-2 flex items-center hover:text-[#1A1A21]/90 font-medium transition-colors"
              >
                <img
                  src={"/sync.svg"}
                  alt="spark"
                  width={20.67}
                  height={20.67}
                  className="w-[13.35px] h-[13.22px]"
                />{" "}
                Refresh Data
              </Button>
            </div>

            <div className="">
              <div className="w-full h-[230px]">
                <Chart />
              </div>
            </div>
          </div>

          <div className="md:w-[278px] w-11/12 h-[327.3px] bg-[#F7F7F8] rounded-[3.45px] md:ml-6 mt-15 md:mt-0 mx-auto flex flex-col justify-center  gap-2 p-6">
            <div className="text-[13.78px] h-[81px] md:w-[223px] w-full text-[#1A1A21] font-medium mt-2 bg-white p-2 rounded-sm">
              <div className="text-[12.06px] font-medium text-[#8C94A6] mb-1">
                Total Verified Asset
              </div>
              <div className="text-[20px] font-semibold text-[#1A1A21]">
                $0.0
              </div>
            </div>

            <div className="text-[13.78px] h-[81px] md:w-[223px] w-full text-[#1A1A21] font-medium mt-2 bg-white p-2 rounded-sm">
              <div className="text-[12.06px] font-medium text-[#8C94A6] mb-1">
                Pending Verification
              </div>
              <div className="text-[20px] font-semibold text-[#1A1A21]">0</div>
            </div>

            <div className="text-[13.78px] h-[81px] md:w-[223px] w-full text-[#1A1A21] font-medium mt-2 bg-white p-2 rounded-sm">
              <div className="text-[12.06px] font-medium text-[#8C94A6] mb-1">
                Failed Verification
              </div>
              <div className="text-[20px] font-semibold text-[#1A1A21]">0</div>
            </div>

            <div className="text-[10px] text-[#8C94A6] flex items-center gap-2">
              <CircleAlert
                size={13}
                className="text-[#8C94A6] w-[13.78px] h-[13.78px]"
                strokeWidth={1.5}
              />{" "}
              Total estimation as at 4:23pm today
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetsChart;
