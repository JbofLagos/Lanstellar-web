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
import { CheckCircle, CircleMinus, Clock } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const transactions = [
  {
    assetId: "ASD-10011",
    assetType: "Office Building",
    value: "$23,489",
    intrest: "7%",
    status: "Overdue",
    date: "Jun 3, 2025 ",
  },
  {
    assetId: "ASD-10012",
    assetType: "Precious Stones",
    value: "$60,000",
    intrest: "3%",
    status: "Repaid",
    date: "Aug 13, 2025 ",
  },
  {
    assetId: "ASD-10013",
    assetType: "Mining Equipment",
    value: "$98,000",
    intrest: "3%",
    status: "Cancelled",
    date: "Aug 21, 2025 ",
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

const AssetsTransaction = () => {
  return (
    <div>
      <Card className="border-[1px] border-[#FAFAFF] rounded-[10px] shadow-none p-[20px] gap-2">
        <CardHeader className=" flex flex-row justify-between text-[15.5px] p-0 text-[#1A1A21] font-semibold">
          <span> Loan Positions Table</span>
          <div className="flex flex-row items-center gap-1">
            <Button
              variant={"outline"}
              className="border-[1px] shadow-none border-[#f1f1f1] h-[26px] w-[82px] rounded-[6px] text-[#5D5D5F] text-[12px] gap-2 flex items-center hover:text-[#1A1A21]/90 font-medium transition-colors"
            >
              <Image
                src={"/maximize.svg"}
                alt="spark"
                width={20.67}
                height={20.67}
                className="w-[13.35px] h-[13.22px]"
              />{" "}
              View all
            </Button>
          </div>
        </CardHeader>

        <CardContent className="text-[12px] flex flex-col font-medium w-full justify-center items-center text-[#8C94A6] p-0 mt-0">
          <Table>
            <TableHeader className=" text-[#8C94A6]  font-medium text-[12px]">
              <TableRow>
                <TableHead className="font-medium text-[#8C94A6] text-[12px]">
                  Asset Type
                </TableHead>
                <TableHead className="font-medium text-[#8C94A6] text-[12px]">
                  Value
                </TableHead>
                <TableHead className="font-medium text-[#8C94A6] text-[12px]">
                  Interest Rate
                </TableHead>
                <TableHead className="font-medium text-[#8C94A6] text-[12px]">
                  Status
                </TableHead>
                <TableHead className="font-medium text-[#8C94A6] text-[12px]">
                  Maturity Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.assetId}
                  className="hover:bg-[#F8F8FB] transition-colors"
                >
                  <TableCell className="text-[#1A1A21] text-[13.78px]">
                    {transaction.assetType}
                  </TableCell>
                  <TableCell className="text-[#1A1A21] text-[13.78px] font-semibold">
                    {transaction.value}
                  </TableCell>
                  <TableCell className="text-[#1A1A21] text-[13.78px]">
                    {transaction.intrest}
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

export default AssetsTransaction;
