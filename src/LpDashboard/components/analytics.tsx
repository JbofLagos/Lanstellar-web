import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";

const Analytics = () => {
  const [selectedDuration, setSelectedDuration] = useState("1");

  // Mock data - replace with actual data from API
  const analyticsData = {
    expectedROI: "12.5%",
    liquidityProvided: "$125,000",
    duration: selectedDuration,
  };

  const durationOptions = [
    { value: "1", label: "1 Month" },
    { value: "2", label: "2 Months" },
    { value: "3", label: "3 Months" },
    { value: "6", label: "6 Months" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Expected ROI Card */}
      <Card className="border-[0.86px] border-[#E4E3EC] rounded-[5.17px] shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-[40px] w-[48px] bg-gradient-to-r from-[#1F90FF] to-[#504CF6] shadow-[0px_1px_2px_rgba(30,144,255,0.65)] rounded-full flex justify-center items-center">
                <TrendingUp className="w-[20.67px] h-[20.67px] text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12.06px] font-medium text-[#8C94A6]">
                  Expected ROI
                </span>
                <span className="text-[25px] font-semibold text-[#1A1A21]">
                  {analyticsData.expectedROI}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-[11px] text-[#8C94A6]">
            Based on {durationOptions.find((opt) => opt.value === selectedDuration)?.label.toLowerCase()} duration
          </div>
        </CardContent>
      </Card>

      {/* Liquidity Provided Card */}
      <Card className="border-[0.86px] border-[#E4E3EC] rounded-[5.17px] shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-[40px] w-[48px] bg-gradient-to-r from-[#29B250] to-[#1F90FF] shadow-[0px_1px_2px_rgba(41,178,80,0.65)] rounded-full flex justify-center items-center">
                <DollarSign className="w-[20.67px] h-[20.67px] text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12.06px] font-medium text-[#8C94A6]">
                  Liquidity Provided
                </span>
                <span className="text-[25px] font-semibold text-[#1A1A21]">
                  {analyticsData.liquidityProvided}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-[11px] text-[#8C94A6]">
            Total liquidity added to the pool
          </div>
        </CardContent>
      </Card>

      {/* Duration Card */}
      <Card className="border-[0.86px] border-[#E4E3EC] rounded-[5.17px] shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 w-full">
              <div className="h-[40px] w-[48px] bg-gradient-to-r from-[#F4B027] to-[#FF6B6B] shadow-[0px_1px_2px_rgba(244,176,39,0.65)] rounded-full flex justify-center items-center flex-shrink-0">
                <Calendar className="w-[20.67px] h-[20.67px] text-white" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[12.06px] font-medium text-[#8C94A6] mb-1">
                  Duration
                </span>
                <Select
                  value={selectedDuration}
                  onValueChange={setSelectedDuration}
                >
                  <SelectTrigger className="w-full h-[32px] border-[#E4E3EC] text-[14px] font-semibold text-[#1A1A21] bg-white">
                    <SelectValue>
                      {durationOptions.find((opt) => opt.value === selectedDuration)?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-[11px] text-[#8C94A6]">
            Select liquidity duration period
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

