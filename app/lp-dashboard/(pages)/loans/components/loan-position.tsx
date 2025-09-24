import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CircleMinus,
  Clock,
} from "lucide-react";
import Image from "next/image";

const transactions = [
  {
    purpose_of_loan: "ASD-10011",
    asset_collateral: "Office Building",
    amount: "$23,489",
    loanTaken: "$7,200",
    interest: "2%",
    status: "Overdue",
    date: "Jun 3, 2025 ",
    due: "Due Jun 10, 2026",
  },
  {
    purpose_of_loan: "ASD-10012",
    asset_collateral: "Precious Stones",
    amount: "$60,000",
    loanTaken: "$30,000",
    interest: "2%",
    status: "Repaid",
    date: "Aug 13, 2025 ",
    due: "Due Mar 13, 2026",
  },
  {
    purpose_of_loan: "ASD-10013",
    asset_collateral: "Mining Equipment",
    amount: "$98,000",
    loanTaken: "$30,000",
    interest: "2%",
    status: "Cancelled",
    date: "Aug 21, 2025 ",
    due: "Due Aug 21, 2026",
  },
];

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
      className=" items-center  py-1.5 rounded-[4px] w-fit h-[21px]  flex gap-2 px-2 justify-center"
      style={{ color: styles.text }}
    >
      {styles.icon && <styles.icon className="w-3.5 h-3.5" />}
      <span className="text-[13.78px] font-medium">{status}</span>
    </div>
  );
};

const LoanPosition = () => {
  return (
    <div>
      <Card className="border-none shadow-none rounded-none pt-2">
        <CardHeader className=" flex flex-row justify-between text-[15.5px] px-0 text-black font-semibold">
          <span> Loan Positions Table</span>
          <div className="flex flex-row items-center gap-2">
            <div className=" border-r border-r[#E4E3EC] pr-4">
              <Image
                src="/icons/export.svg"
                width={24}
                height={24}
                alt="export"
                className="cursor-pointer h-[41.34px] w-[41.34px] "
              />
            </div>

            <div className=" w-[183.25px] h-[41.34px] bg-white flex flex-row justify-between items-center  gap-2">
              <div className=" bg-[#F4F3F7] h-[41.34px] w-[41.34px] rounded-full  flex justify-center items-center cursor-pointer">
                <ChevronLeft color="#8C94A6" size={16} />
              </div>
              <div className=" whitespace-nowrap text-[#49576D] text-[12.06px] ">
                1-50 of 234
              </div>
              <div className=" bg-[#F4F3F7] h-[41.34px] w-[41.34px] rounded-full  flex justify-center items-center cursor-pointer">
                <ChevronRight color="#8C94A6" size={16} />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="text-[13.78px] flex flex-col font-medium w-full justify-center items-center text-[#8C94A6] px-0">
          <Table>
            <TableHeader className="bg-[#F4F3F7] text-[#49576D] border-b border-b-[#E5E5E5] font-medium text-[12.06px]">
              <TableRow>
                <TableHead className="font-medium text-[#49576D]">
                  Loan ID
                </TableHead>
                <TableHead className="font-medium text-[#49576D]">
                  Asset Type
                </TableHead>
                <TableHead className="font-medium text-[#49576D]">
                  Value
                </TableHead>
                <TableHead className="font-medium text-[#49576D]">
                  Interest Rate
                </TableHead>
                <TableHead className="font-medium text-[#49576D]">
                  Status
                </TableHead>
                <TableHead className="font-medium text-[#49576D]">
                  Maturity Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.purpose_of_loan}
                  className="hover:bg-[#F8F8FB] transition-colors"
                >
                  <TableCell className=" text-[#1A1A1A] text-[13.78px]">
                    {transaction.purpose_of_loan}
                  </TableCell>
                  <TableCell className="text-[#1A1A21] text-[13.78px]">
                    {transaction.asset_collateral}
                  </TableCell>
                  <TableCell className="text-[#1A1A21] text-[13.78px] font-semibold">
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-[#1A1A21] text-[13.78px]">
                    {transaction.interest}
                  </TableCell>
                  <TableCell className="text-[#1A1A21] text-[13.78px]">
                    <StatusBadge status={transaction.status} />
                  </TableCell>
                  <TableCell className="text-[#1A1A21] text-[13.78px] gap-3 flex flex-col">
                    <div className="">{transaction.date}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanPosition;
