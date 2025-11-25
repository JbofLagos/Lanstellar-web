import { useState } from "react";
import { TrendingUp, TrendingDown, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const StatCard = ({ title, value, change, isPositive }: StatCardProps) => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-3">
        <h3 className="text-[13px] text-[#6B7280] font-medium">{title}</h3>
        <div className="flex flex-col gap-2">
          <p className="text-[32px] font-semibold text-[#111827]">{value}</p>
          <div className="flex items-center gap-1.5">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
            ) : (
              <TrendingDown className="w-4 h-4 text-[#EF4444]" />
            )}
            <span
              className={`text-[13px] font-medium ${
                isPositive ? "text-[#10B981]" : "text-[#EF4444]"
              }`}
            >
              {change}
            </span>
            <span className="text-[13px] text-[#6B7280]">from last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [dateRange] = useState({
    start: "30/06/2025",
    end: "30/06/2025",
  });

  const stats = [
    {
      title: "Total Assets Submitted",
      value: "223,433",
      change: "+12%",
      isPositive: true,
    },
    {
      title: "Pending Asset Verifications",
      value: "223,433",
      change: "+12%",
      isPositive: true,
    },
    {
      title: "Total Loan Requests",
      value: "223,433",
      change: "+12%",
      isPositive: true,
    },
    {
      title: "Active Loans",
      value: "223,433",
      change: "+12%",
      isPositive: true,
    },
    {
      title: "Defaulted Loans",
      value: "223,433",
      change: "+12%",
      isPositive: true,
    },
    {
      title: "Liquidity Locked on Platform",
      value: "223,433",
      change: "+12%",
      isPositive: true,
    },
    {
      title: "Total Repaid Loans",
      value: "223,433",
      change: "+12%",
      isPositive: true,
    },
    {
      title: "Total Registered Company",
      value: "223,433",
      change: "+12%",
      isPositive: true,
    },
  ];

  return (
    <div className="font-inter p-6 bg-[#F9FAFB] min-h-screen">
      {/* Header with Date Filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-[#8D9091] font-medium">
            Filter by date
          </span>
          <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {date ? date.toLocaleDateString() : "Select date"}
                  <CalendarDays />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
            <span className="text-[#CBCBCB]">to</span>
            <input
              type="text"
              value={dateRange.end}
              className="px-3 py-2 border border-[#E5E7EB] rounded-md text-[14px] text-[#111827] bg-white w-[109px] h-[30px] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
