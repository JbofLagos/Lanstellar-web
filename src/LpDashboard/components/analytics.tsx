import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Chart from "react-apexcharts";
import "apexcharts/dist/apexcharts.css";

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

  // Expected ROI Chart Data
  const roiChartOptions = {
    chart: {
      type: "line" as const,
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth" as const,
      width: 2.5,
      colors: ["#504CF6"],
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#F4F3F7",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: { colors: "#8C94A6", fontSize: "12px", fontWeight: 500 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#8C94A6", fontSize: "12px", fontWeight: 500 },
        formatter: (value: number) => `${value}%`,
      },
    },
    tooltip: {
      theme: "dark" as const,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: (value: number) => `${value}%`,
      },
    },
    colors: ["#504CF6"],
    fill: {
      type: "solid",
      opacity: 0.1,
    },
  };

  const roiChartSeries = [
    {
      name: "Expected ROI",
      data: [8.5, 9.2, 10.1, 10.8, 11.5, 12.0, 12.3, 12.5, 12.6, 12.5, 12.4, 12.5],
    },
  ];

  // Liquidity Provided Chart Data
  const liquidityChartOptions = {
    chart: {
      type: "area" as const,
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth" as const,
      width: 2.5,
      colors: ["#1F90FF"],
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#F4F3F7",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: { colors: "#8C94A6", fontSize: "12px", fontWeight: 500 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#8C94A6", fontSize: "12px", fontWeight: 500 },
        formatter: (value: number) => `$${(value / 1000).toFixed(0)}k`,
      },
    },
    tooltip: {
      theme: "dark" as const,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: (value: number) => `$${value.toLocaleString()}`,
      },
    },
    colors: ["#1F90FF"],
    fill: {
      type: "solid",
      opacity: 0.1,
    },
  };

  const liquidityChartSeries = [
    {
      name: "Liquidity Provided",
      data: [45000, 52000, 61000, 72000, 85000, 95000, 105000, 115000, 120000, 125000, 125000, 125000],
    },
  ];

  // ROI by Duration Chart Data
  const durationChartOptions = {
    chart: {
      type: "bar" as const,
      height: 280,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: 600,
        colors: ["#1A1A21"],
      },
      formatter: (value: number) => `${value}%`,
    },
    grid: {
      borderColor: "#F4F3F7",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: ["1 Month", "2 Months", "3 Months", "6 Months"],
      labels: {
        style: { colors: "#8C94A6", fontSize: "12px", fontWeight: 500 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#8C94A6", fontSize: "12px", fontWeight: 500 },
        formatter: (value: number) => `${value}%`,
      },
    },
    tooltip: {
      theme: "dark" as const,
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: (value: number) => `${value}% ROI`,
      },
    },
    colors: ["#504CF6", "#1F90FF", "#29B250", "#F4B027"],
  };

  const durationChartSeries = [
    {
      name: "Expected ROI",
      data: [8.5, 10.2, 12.5, 15.8],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Expected ROI Card */}
      <Card className="border-[0.86px] border-[#E4E3EC] rounded-[5.17px] shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[12.06px] font-medium text-[#8C94A6]">
                Expected ROI
              </span>
              <span className="text-[25px] font-semibold text-[#1A1A21]">
                {analyticsData.expectedROI}
              </span>
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
      <Card className="border-[0.86px] border-[#E4E3EC] rounded-[5.17px] shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[12.06px] font-medium text-[#8C94A6]">
                Liquidity Provided
              </span>
              <span className="text-[25px] font-semibold text-[#1A1A21]">
                {analyticsData.liquidityProvided}
              </span>
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
      <Card className="border-[0.86px] border-[#E4E3EC] rounded-[5.17px] shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-full">
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
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-[11px] text-[#8C94A6]">
            Select liquidity duration period
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expected ROI Chart */}
        <Card className="border-[0.86px] border-[#E4E3EC] rounded-[5.17px] shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[15.5px] font-semibold text-[#1A1A21]">
                  Expected ROI Trend
                </span>
                <span className="text-[12.06px] font-medium text-[#8C94A6]">
                  Monthly ROI performance
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Chart
              options={roiChartOptions}
              series={roiChartSeries}
              type="line"
              height={280}
            />
          </CardContent>
        </Card>

        {/* Liquidity Provided Chart */}
        <Card className="border-[0.86px] border-[#E4E3EC] rounded-[5.17px] shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[15.5px] font-semibold text-[#1A1A21]">
                  Liquidity Provided Trend
                </span>
                <span className="text-[12.06px] font-medium text-[#8C94A6]">
                  Monthly liquidity growth
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Chart
              options={liquidityChartOptions}
              series={liquidityChartSeries}
              type="area"
              height={280}
            />
          </CardContent>
        </Card>
      </div>

      {/* ROI by Duration Chart */}
      <Card className="border-[0.86px] border-[#E4E3EC] rounded-[5.17px] shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[15.5px] font-semibold text-[#1A1A21]">
                Expected ROI by Duration
              </span>
              <span className="text-[12.06px] font-medium text-[#8C94A6]">
                ROI comparison across different durations
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Chart
            options={durationChartOptions}
            series={durationChartSeries}
            type="bar"
            height={280}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

