import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, DollarSign, Loader2, Calendar } from "lucide-react";
import Chart from "react-apexcharts";
import "apexcharts/dist/apexcharts.css";
import { useGetLiquidity } from "@/hook/useLiquidity";
import type { Liquidity } from "@/lib/api-service";

const Analytics = () => {
  const [currentROIAmount, setCurrentROIAmount] = useState(0);

  // Fetch user's liquidity data from API
  const { data: liquidity, isLoading } = useGetLiquidity();

  // Calculate total liquidity from all user's entries
  const totalLiquidity = useMemo(() => {
    if (liquidity?.length === 0) return 0;
    return liquidity?.reduce(
      (sum: number, item: Liquidity) => sum + (item.amount || 0),
      0
    );
  }, [liquidity]);

  // Calculate weighted average interest rate
  const averageInterest = useMemo(() => {
    if (liquidity?.length === 0 || totalLiquidity === 0) return 0;
    const weightedSum = liquidity?.reduce(
      (sum, item) => sum + (item.amount || 0) * (item.interest || 0),
      0
    );
    return weightedSum / totalLiquidity;
  }, [liquidity, totalLiquidity]);

  // Calculate weighted average duration
  const averageDuration = useMemo(() => {
    if (!liquidity?.length || totalLiquidity === 0) return 0;
    const weightedSum = liquidity.reduce(
      (sum, item) => sum + (item.amount || 0) * (item.duration || 0),
      0
    );
    return weightedSum / totalLiquidity;
  }, [liquidity, totalLiquidity]);

  // Calculate total expected ROI amount based on all positions
  const totalExpectedROI = useMemo(() => {
    if (!liquidity?.length) return 0;
    return liquidity.reduce((sum, item) => {
      const amount = item.amount || 0;
      const interest = item.interest || 0;
      const duration = item.duration || 0;
      // Calculate ROI for each position: (amount * (interest/12) * duration) / 100
      const monthlyRate = interest / 12;
      const roiAmount = (amount * monthlyRate * duration) / 100;
      return sum + roiAmount;
    }, 0);
  }, [liquidity]);

  // Calculate end dates for all positions
  const positionEndDates = useMemo(() => {
    if (!liquidity?.length) return [];
    return liquidity.map((item) => {
      const createdAt = item.createdAt ? new Date(item.createdAt) : new Date();
      const duration = item.duration || 0;
      const endDate = new Date(createdAt);
      endDate.setMonth(endDate.getMonth() + duration);
      return {
        ...item,
        endDate,
      };
    });
  }, [liquidity]);

  // Get the nearest end date
  const nearestEndDate = useMemo(() => {
    if (!positionEndDates.length) return null;
    const sortedDates = positionEndDates
      .filter((p) => p.endDate > new Date())
      .sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
    return sortedDates[0]?.endDate || null;
  }, [positionEndDates]);

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Use API data or fallback to calculated values
  const liquidityAmount = totalLiquidity;

  // Calculate APY based on liquidity tiers
  const getAPYForLiquidity = (amount: number): number => {
    if (amount >= 1000000) {
      return 20; // 20% APY for 1M+
    } else if (amount >= 100000) {
      return 18; // 18% APY for 100k-999.9k
    } else if (amount >= 10000) {
      return 14; // 14% APY for 10k-99.9k
    } else if (amount >= 1000) {
      return 12; // 12% APY for 1k-9.9k
    } else {
      return 12; // Default to 12% for amounts below 1k
    }
  };

  const BASE_ROI_PER_YEAR = getAPYForLiquidity(liquidityAmount);

  // Get last 6 months for chart labels
  const chartMonths = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: date.toLocaleDateString("en-US", { month: "short" }),
        year: date.getFullYear(),
        month: date.getMonth(),
      });
    }
    return months;
  }, []);

  // Calculate earned ROI based on actual positions and their creation dates
  useEffect(() => {
    if (!liquidity?.length) {
      setCurrentROIAmount(0);
      return;
    }

    const calculateEarnedROI = () => {
      const now = new Date();
      let totalEarned = 0;

      liquidity.forEach((item) => {
        const amount = item.amount || 0;
        const interest = item.interest || 0;
        const duration = item.duration || 0;
        const createdAt = item.createdAt
          ? new Date(item.createdAt)
          : new Date();

        // Calculate end date
        const endDate = new Date(createdAt);
        endDate.setMonth(endDate.getMonth() + duration);

        // Calculate total expected ROI for this position
        const monthlyRate = interest / 12;
        const totalExpectedForPosition =
          (amount * monthlyRate * duration) / 100;

        // Calculate elapsed time
        const totalDurationMs = endDate.getTime() - createdAt.getTime();
        const elapsedMs = Math.min(
          now.getTime() - createdAt.getTime(),
          totalDurationMs
        );
        const progressRatio = Math.max(
          0,
          Math.min(1, elapsedMs / totalDurationMs)
        );

        // Calculate earned ROI for this position
        const earnedForPosition = totalExpectedForPosition * progressRatio;
        totalEarned += earnedForPosition;
      });

      setCurrentROIAmount(totalEarned);
    };

    calculateEarnedROI();

    // Update every second for smooth display
    const interval = setInterval(calculateEarnedROI, 1000);

    return () => clearInterval(interval);
  }, [liquidity]);

  // Expected ROI Chart Data - uses dynamic month labels
  const roiChartOptions = useMemo(
    () => ({
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
        categories: chartMonths.map((m) => m.label),
        labels: {
          style: { colors: "#8C94A6", fontSize: "12px", fontWeight: 500 },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: "#8C94A6", fontSize: "12px", fontWeight: 500 },
          formatter: (value: number) => `$${value.toLocaleString()}`,
        },
      },
      tooltip: {
        theme: "dark" as const,
        style: {
          fontSize: "12px",
        },
        y: {
          formatter: (value: number) =>
            `$${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
        },
      },
      colors: ["#504CF6"],
      fill: {
        type: "solid",
        opacity: 0.1,
      },
    }),
    [chartMonths]
  );

  // Compute ROI chart data based on actual positions over last 6 months
  const roiChartData = useMemo(() => {
    if (!liquidity?.length) {
      return Array(6).fill(0);
    }

    return chartMonths.map((monthInfo) => {
      let earnedInMonth = 0;
      const monthEnd = new Date(monthInfo.year, monthInfo.month + 1, 0);

      liquidity.forEach((item) => {
        const amount = item.amount || 0;
        const interest = item.interest || 0;
        const duration = item.duration || 0;
        const createdAt = item.createdAt
          ? new Date(item.createdAt)
          : new Date();

        // Skip if position was created after this month
        if (createdAt > monthEnd) return;

        // Calculate end date
        const endDate = new Date(createdAt);
        endDate.setMonth(endDate.getMonth() + duration);

        // Calculate ROI earned up to this month
        const monthlyRate = interest / 12 / 100;
        const totalExpected = amount * monthlyRate * duration;

        // Calculate progress up to end of this month
        const totalDurationMs = endDate.getTime() - createdAt.getTime();
        const elapsedMs = Math.min(
          monthEnd.getTime() - createdAt.getTime(),
          totalDurationMs
        );
        const progressRatio = Math.max(
          0,
          Math.min(1, elapsedMs / totalDurationMs)
        );

        earnedInMonth += totalExpected * progressRatio;
      });

      return parseFloat(earnedInMonth.toFixed(2));
    });
  }, [liquidity, chartMonths]);

  const roiChartSeries = [
    {
      name: "Earned ROI ($)",
      data: roiChartData,
    },
  ];

  // Liquidity Provided Chart Data - uses dynamic month labels
  const liquidityChartOptions = useMemo(
    () => ({
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
        categories: chartMonths.map((m) => m.label),
        labels: {
          style: { colors: "#8C94A6", fontSize: "12px", fontWeight: 500 },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: "#8C94A6", fontSize: "12px", fontWeight: 500 },
          formatter: (value: number) =>
            value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`,
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
    }),
    [chartMonths]
  );

  // Compute liquidity chart data based on actual positions over last 6 months
  const liquidityChartData = useMemo(() => {
    if (!liquidity?.length) {
      return Array(6).fill(0);
    }

    return chartMonths.map((monthInfo) => {
      let cumulativeLiquidity = 0;
      const monthEnd = new Date(monthInfo.year, monthInfo.month + 1, 0);

      liquidity.forEach((item) => {
        const amount = item.amount || 0;
        const duration = item.duration || 0;
        const createdAt = item.createdAt
          ? new Date(item.createdAt)
          : new Date();

        // Calculate end date
        const endDate = new Date(createdAt);
        endDate.setMonth(endDate.getMonth() + duration);

        // Include if position was active during this month
        // (created before month end AND not expired before month start)
        const monthStart = new Date(monthInfo.year, monthInfo.month, 1);
        if (createdAt <= monthEnd && endDate >= monthStart) {
          cumulativeLiquidity += amount;
        }
      });

      return cumulativeLiquidity;
    });
  }, [liquidity, chartMonths]);

  const liquidityChartSeries = [
    {
      name: "Active Liquidity",
      data: liquidityChartData,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Earned ROI Card - Featured with gradient */}
        <Card className="border-[0.86px] border-[#E4E3EC] rounded-[8px] shadow-none bg-gradient-to-br to-[#010101] from-[#5B1E9F]">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3 flex-col">
                <div className="flex flex-row items-center gap-2">
                  <TrendingUp className="w-[20.67px] h-[20.67px] text-white" />
                  <span className="text-[12.06px] font-medium text-white/90">
                    Earned ROI
                  </span>
                </div>
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-white/80" />
                ) : (
                  <span className="text-[25px] font-semibold text-white">
                    $
                    {currentROIAmount?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="text-[11px] text-white/80">
              {totalLiquidity > 0
                ? `Expected: $${totalExpectedROI?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} (${
                    averageInterest > 0
                      ? averageInterest.toFixed(1)
                      : BASE_ROI_PER_YEAR
                  }% APY × ${averageDuration.toFixed(0)}mo)`
                : "Add liquidity to start earning"}
            </div>
            {nearestEndDate && (
              <div className="flex items-center gap-1 text-[11px] text-white/70">
                <Calendar className="w-3 h-3" />
                <span>Next maturity: {formatDate(nearestEndDate)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Liquidity Provided Card */}
        <Card className="border-[0.86px] border-[#E4E3EC] rounded-[8px] shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3 flex-col">
                <div className="flex flex-row items-center gap-2">
                  <DollarSign className="w-[20.67px] h-[20.67px] text-[#1F90FF]" />
                  <span className="text-[12.06px] font-medium text-[#8C94A6]">
                    Liquidity Provided
                  </span>
                </div>
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#8C94A6]" />
                ) : (
                  <span className="text-[25px] font-semibold text-[#1A1A21]">
                    ${totalLiquidity?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-[11px] text-[#8C94A6]">
              {liquidity?.length > 0
                ? `${liquidity?.length} active position${
                    liquidity?.length > 1 ? "s" : ""
                  }`
                : "No liquidity added yet"}
            </div>
          </CardContent>
        </Card>

        {/* Expected Total ROI Card */}
        <Card className="border-[0.86px] border-[#E4E3EC] rounded-[8px] shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3 flex-col">
                <div className="flex flex-row items-center gap-2">
                  <DollarSign className="w-[20.67px] h-[20.67px] text-[#29B250]" />
                  <span className="text-[12.06px] font-medium text-[#8C94A6]">
                    Expected Total ROI
                  </span>
                </div>
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#8C94A6]" />
                ) : (
                  <span className="text-[25px] font-semibold text-[#1A1A21]">
                    $
                    {totalExpectedROI?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-[11px] text-[#8C94A6]">
              {totalLiquidity > 0
                ? `${
                    averageInterest > 0
                      ? averageInterest.toFixed(1)
                      : BASE_ROI_PER_YEAR
                  }% APY for avg ${averageDuration.toFixed(0)} month${
                    averageDuration > 1 ? "s" : ""
                  }`
                : "No active positions"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earned ROI Chart */}
        <Card className="border-[0.86px] border-[#E4E3EC] rounded-[8px] shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[15.5px] font-semibold text-[#1A1A21]">
                  Earned ROI Trend
                </span>
                <span className="text-[12.06px] font-medium text-[#8C94A6]">
                  Cumulative earnings over last 6 months
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

        {/* Active Liquidity Chart */}
        <Card className="border-[0.86px] border-[#E4E3EC] rounded-[8px] shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[15.5px] font-semibold text-[#1A1A21]">
                  Active Liquidity
                </span>
                <span className="text-[12.06px] font-medium text-[#8C94A6]">
                  Total active positions over last 6 months
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
      {/* <Card className="border-[0.86px] border-[#E4E3EC] rounded-[8px] shadow-none">
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
      </Card> */}
    </div>
  );
};

export default Analytics;
