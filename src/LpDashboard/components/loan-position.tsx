import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import {
  CheckCircle,
  CircleMinus,
  Clock,
  Calendar,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useGetAllLoans, type Loan } from "@/hook/useLoans";

const StatusBadge = ({ status }: { status: string }) => {
  interface StatusStyles {
    bg: string;
    text: string;
    icon: React.ComponentType<{ className?: string }> | null;
  }

  const getStatusStyles = (status: string): StatusStyles => {
    switch (status.toLowerCase()) {
      case "overdue":
        return {
          bg: "#FFF7E7",
          text: "#F4B027",
          icon: Clock,
        };
      case "repaid":
        return {
          bg: "#ECFFF1",
          text: "#29B250",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          bg: "#FFF1F0",
          text: "#FB3931",
          icon: CircleMinus,
        };
      case "pending":
        return {
          bg: "#E8F5FF",
          text: "#2196F3",
          icon: Clock,
        };
      default:
        return {
          bg: "#F3F4F6",
          text: "#374151",
          icon: null,
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <div
      className="items-center py-1.5 rounded-[6px] w-fit h-[24px] flex gap-1.5 px-2.5 justify-center"
      style={{ backgroundColor: styles.bg, color: styles.text }}
    >
      {styles.icon && <styles.icon className="w-3.5 h-3.5" />}
      <span className="text-[12px] font-medium capitalize">{status}</span>
    </div>
  );
};

const LoanPosition = () => {
  const { allLoans, isLoadingAllLoans } = useGetAllLoans();

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate due date based on duration (in months)
  const calculateDueDate = (createdAt?: string, duration?: number) => {
    if (!createdAt || !duration) return "N/A";
    const date = new Date(createdAt);
    date.setMonth(date.getMonth() + duration);
    return formatDate(date.toISOString());
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-row justify-between items-center mb-6 px-4">
        <h2 className="text-[18px] text-black font-semibold">Loan Positions</h2>
        <div className="flex flex-row items-center gap-2">
          <div className=" bg-white flex flex-row justify-between items-center gap-2">
            <div className="whitespace-nowrap text-[#49576D] text-[12.06px]">
              1-{allLoans?.length || 0} of {allLoans?.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoadingAllLoans && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B1E9F]"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoadingAllLoans && (!allLoans || allLoans.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center">
            <p className="text-[16px] text-[#8C94A6] font-medium mb-2">
              No loans available
            </p>
            <p className="text-[13px] text-[#8C94A6]">
              Loan positions will appear here once they are created
            </p>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {!isLoadingAllLoans && allLoans && allLoans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          {allLoans.map((loan: Loan) => (
            <Card
              key={loan._id}
              className="border border-[#E4E3EC] rounded-[12px] hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-5">
                {/* Header with Loan ID and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[11px] text-[#8C94A6] font-medium mb-1">
                      Loan ID
                    </p>
                    <p className="text-[15px] text-[#1A1A21] font-semibold">
                      {loan._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <StatusBadge status={loan.status || "Pending"} />
                </div>

                {/* Loan Purpose */}
                <div className="mb-4 pb-4 border-b border-[#F4F3F7]">
                  <p className="text-[11px] text-[#8C94A6] font-medium mb-1">
                    Loan Purpose
                  </p>
                  <p className="text-[13px] text-[#1A1A21] font-medium">
                    {loan.loanPurpose}
                  </p>
                </div>

                {/* Amount and Interest */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#8C94A6]" />
                      <p className="text-[11px] text-[#8C94A6] font-medium">
                        Amount
                      </p>
                    </div>
                    <p className="text-[15px] text-[#1A1A21] font-bold">
                      ${loan.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#8C94A6]" />
                      <p className="text-[11px] text-[#8C94A6] font-medium">
                        Interest Rate
                      </p>
                    </div>
                    <p className="text-[15px] text-[#1A1A21] font-bold">
                      {loan.interestRate}%
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <p className="text-[11px] text-[#8C94A6] font-medium mb-1">
                    Duration
                  </p>
                  <p className="text-[13px] text-[#1A1A21] font-semibold">
                    {loan.duration} {loan.duration === 1 ? "month" : "months"}
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#F4F3F7]">
                  <Calendar className="w-3.5 h-3.5 text-[#8C94A6]" />
                  <p className="text-[11px] text-[#8C94A6]">
                    {formatDate(loan.createdAt)}
                  </p>
                  <span className="text-[#E4E3EC]">•</span>
                  <p className="text-[11px] text-[#8C94A6]">
                    Due {calculateDueDate(loan.createdAt, loan.duration)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoanPosition;
