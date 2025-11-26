import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, DollarSign } from "lucide-react";
import Chart from "react-apexcharts";
import "apexcharts/dist/apexcharts.css";

const Analytics = () => {
  const [selectedDuration, setSelectedDuration] = useState("1");
  const [currentROIAmount, setCurrentROIAmount] = useState(0);
  const startTimeRef = useRef<Date>(new Date());

  // Mock data - replace with actual data from API
  const analyticsData = {
    expectedROI: "12%",
    liquidityProvided: "$125,000",
    duration: selectedDuration,
  };

  // Base ROI: 12% per 12 months = 1% per month
  const BASE_ROI_PER_MONTH = 12 / 12; // 1% per month
  const BASE_ROI_PER_YEAR = 12; // 12% per year

  // Parse liquidity amount (remove $ and commas)
  const liquidityAmount = parseFloat(
    analyticsData.liquidityProvided.replace(/[$,]/g, "")
  );

  // Calculate ROI percentage for selected duration
  const selectedMonths = parseInt(selectedDuration);
  const roiPercentage = BASE_ROI_PER_MONTH * selectedMonths;
  const totalROIAmount = (liquidityAmount * roiPercentage) / 100;

  // Calculate total days in selected duration
  const totalDays = selectedMonths * 30; // Approximate 30 days per month
  const totalMinutes = totalDays * 24 * 60; // Total minutes in duration
  const roiPerMinute = totalROIAmount / totalMinutes;

  // Update ROI amount - increments every minute, but checks every second for smooth UI
  useEffect(() => {
    // Reset start time when duration changes
    startTimeRef.current = new Date();

    const interval = setInterval(() => {
      const now = new Date();
      const elapsedMilliseconds = now.getTime() - startTimeRef.current.getTime();
      // Calculate elapsed minutes (ROI increments every full minute)
      const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));

      // Calculate current ROI based on elapsed minutes
      // ROI accumulates every minute until reaching total ROI amount
      const elapsedROI = Math.min(
        roiPerMinute * elapsedMinutes,
        totalROIAmount
      );
      setCurrentROIAmount(elapsedROI);
    }, 1000); // Check every second for smooth display, but value increments every minute

    // Initial calculation on mount and when duration changes
    const calculateInitialROI = () => {
      const now = new Date();
      const elapsedMilliseconds = now.getTime() - startTimeRef.current.getTime();
      const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));
      const initialROI = Math.min(
        roiPerMinute * elapsedMinutes,
        totalROIAmount
      );
      setCurrentROIAmount(initialROI);
    };

    calculateInitialROI();

    return () => clearInterval(interval);
  }, [selectedDuration, roiPerMinute, totalROIAmount]);

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
            <div className="flex items-center gap-3">
              <TrendingUp className="w-[20.67px] h-[20.67px] text-[#504CF6]" />
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
      <Card className="border-[0.86px] border-[#E4E3EC] rounded-[5.17px] shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-[20.67px] h-[20.67px] text-[#1F90FF]" />
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

      {/* ROI Card */}
      <Card className="border-[0.86px] border-[#E4E3EC] rounded-[5.17px] shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-full">
              <span className="text-[12.06px] font-medium text-[#8C94A6] mb-2">
                ROI
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[25px] font-semibold text-[#1A1A21]">
                  ${currentROIAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-[14px] font-medium text-[#8C94A6]">
                  ({roiPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-[11px] text-[#8C94A6]">
            Based on {BASE_ROI_PER_YEAR}% annual ROI for {durationOptions.find((opt) => opt.value === selectedDuration)?.label.toLowerCase()}
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

