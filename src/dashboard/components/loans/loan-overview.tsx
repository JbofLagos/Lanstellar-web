/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, CircleMinus, Clock, Loader, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DocsPreview from "../assets/docsPreview";
import { deleteLoan } from "@/lib/api-service";
import { useLoans } from "@/hook/useLoans";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import RequestLoanDialog from "./request-loan-dialog";

const StatusBadge = ({ status }: { status: string }) => {
  interface StatusStyles {
    bg: string;
    text: string;
    icon: React.ComponentType<{ className?: string }> | null;
  }

  const getStatusStyles = (status: string): StatusStyles => {
    switch (status.toLowerCase()) {
      case "requested":
        return { bg: "#FFF7E7", text: "#F4B027", icon: Clock };
      case "repaid":
        return { bg: "#ECFFF1", text: "#29B250", icon: CheckCircle };
      case "cancelled":
        return { bg: "#FFF1F0", text: "#FB3931", icon: CircleMinus };
      default:
        return { bg: "#F3F4F6", text: "#374151", icon: null };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <div
      className="items-center py-1.5 rounded-[4px] w-fit h-[21px] flex gap-2 px-2 justify-center"
      style={{ backgroundColor: styles.bg, color: styles.text }}
    >
      {styles.icon && <styles.icon className="w-3.5 h-3.5" />}
      <span className="text-[13.78px] font-medium">{status}</span>
    </div>
  );
};

interface Loan {
  _id: string;
  loanPurpose: string;
  assetId: {
    assetTitle: string;
    assetCategory: string;
    assetLocation: string;
    assetWorth: string;
    docs: string[];
    loanStatus: boolean;
    verified: boolean;
  };
  amount: number;
  loanStatus: boolean;
  verified: boolean;
  duration: string;
  status: string;
  createdAt: string;
  due?: string;
  interestRate: number;
  paymentPlan: number;
}

const LoanOverview = () => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const { isLoadingLoans, loans, error, refetch: fetchLoans } = useLoans();

  // Log any errors from the hook
  if (error) {
    console.error("Error fetching loans:", error);
  }

  const handleDeleteLoan = async (): Promise<void> => {
    if (!selectedLoan?._id) return;
    setIsDeleting(true);
    try {
      const response = await deleteLoan(selectedLoan._id);
      if (response.success) {
        // Refetch loans after successful deletion
        fetchLoans();
        setOpen(false);
      } else {
        console.error("Failed to delete loan:", response.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoadingLoans) {
    return (
      <div className="flex justify-center items-center py-10 text-[#8C94A6]">
        Loading loans...
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-[58vh]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="w-[215px] h-[142.01px] bg-white"
            >
              <img
                src="/empty.svg"
                alt="Empty"
                width={215}
                height={142}
                className="w-[215px] h-[142.01px]"
              />
            </EmptyMedia>
            <EmptyTitle>Loans</EmptyTitle>
            <EmptyDescription className="text-[13.78px] text-[#8C94A6] font-medium">
              No Loan Added Yet.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <RequestLoanDialog onSuccess={fetchLoans} className="w-full" />
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <Card className="border-none shadow-none rounded-none">
        <CardHeader className="flex flex-row justify-between items-center text-[16px] px-0 text-black font-semibold">
          <span>Loan Overview</span>
          <RequestLoanDialog />
        </CardHeader>

        <CardContent className="text-[13.78px] flex flex-col font-medium w-full justify-center items-center text-[#8C94A6] px-0">
          <Table className="scrollbar-hide">
            <TableHeader className="bg-[#F8F8FB] text-[#49576D] border-b border-b-[#E5E5E5] font-medium text-[12.06px]">
              <TableRow>
                <TableHead>Purpose of loan</TableHead>
                <TableHead>Asset Collateral</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Loan Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow
                  key={loan._id}
                  className="hover:bg-[#F8F8FB] transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedLoan(loan as unknown as Loan);
                    setOpen(true);
                  }}
                >
                  <TableCell className="text-[#1A1A1A] capitalize">
                    {loan.loanPurpose}
                  </TableCell>
                  <TableCell className="text-[#1A1A21]">
                    {typeof loan.assetId === "string"
                      ? loan.assetId
                      : (loan.assetId as { assetTitle: string }).assetTitle}
                  </TableCell>
                  <TableCell className="text-[#1A1A21] font-semibold">
                    ${loan.amount}
                  </TableCell>
                  <TableCell className="text-[#1A1A21]">
                    {loan.duration}
                  </TableCell>
                  <TableCell className="text-[#1A1A21]">
                    <StatusBadge status={loan.status ?? ""} />
                  </TableCell>
                  <TableCell className="text-[#1A1A21] gap-3 flex flex-col">
                    <div>{loan?.createdAt?.slice(0, 10) || ""}</div>

                    {(loan as any).due && (
                      <span className="text-[#49576D] flex flex-row items-center font-medium text-[12.06px]">
                        <img
                          src={"/icons/arrow.svg"}
                          width={24}
                          height={24}
                          alt="arrow"
                        />
                        <div>{(loan as any).due?.slice(0, 10) || ""}</div>
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-xl">
          {selectedLoan && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold capitalize">
                  {selectedLoan.loanPurpose}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-row items-center justify-between gap-2">
                <span className="text-[#8C94A6] capitalize font-medium text-[12.06px]">
                  {selectedLoan.assetId.assetCategory}
                </span>
                <span
                  className={`text-[10.34px] gap-1 font-medium flex flex-row items-center justify-center text-[#1A1A21] h-[20px] w-[76px] rounded-[4px] ${
                    selectedLoan.assetId.verified === true ||
                    String(selectedLoan.assetId.verified) === "true"
                      ? "bg-[#D3FED3]"
                      : "bg-[#FCDB86]"
                  } bg-opacity-10`}
                >
                  {selectedLoan.assetId.verified === true ||
                  String(selectedLoan.assetId.verified) === "true"
                    ? "Verified ✅"
                    : "In Review ⏳"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[13.78px] capitalize font-semibold">
                  {selectedLoan.assetId.assetTitle}
                </h2>
                <p className="text-[13.78px] text-[#1A1A21] font-medium">
                  {selectedLoan.assetId.assetLocation}
                </p>
              </div>
              <DocsPreview
                docs={
                  Array.isArray(selectedLoan.assetId.docs)
                    ? selectedLoan.assetId.docs.map((str) => ({
                        cloudinaryUrl: str,
                      }))
                    : selectedLoan.assetId.docs
                }
              />

              <div className="flex flex-col gap-4">
                <div className=" text-[12px] font-medium text-[#1A1A1A] flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-[#49576D] text-[13.78px] font-medium">
                      Purpose of loan
                    </span>
                    <span className=" capitalize">
                      {selectedLoan.loanPurpose}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#49576D] text-[13.78px] font-medium">
                      Asset Collateral
                    </span>
                    <span>{selectedLoan.assetId.assetTitle}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#49576D] text-[13.78px] font-medium">
                      Amount Loaned
                    </span>
                    <span>${selectedLoan.amount}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#49576D] text-[13.78px] font-medium">
                      Loan Duration
                    </span>
                    <span>{selectedLoan.duration} Months</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#49576D] text-[13.78px] font-medium">
                      Interest Rate – {selectedLoan.interestRate}%
                    </span>
                    <span>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        selectedLoan.amount * (selectedLoan.interestRate / 100)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#49576D] text-[13.78px] font-medium">
                      Processing Fee – 0.8%
                    </span>
                    <span>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(selectedLoan.amount * 0.008)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[13.78px] font-medium">
                    <span className="text-[#49576D]">Gas Fee – 0.2%</span>
                    <span>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(selectedLoan.amount * 0.002)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#49576D] text-[13.78px] font-medium">
                      Installment Amount – {selectedLoan.paymentPlan} payments
                      over {selectedLoan.duration} months
                    </span>
                    <span>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        (selectedLoan.amount *
                          (1 +
                            selectedLoan.interestRate / 100 +
                            0.008 +
                            0.002)) /
                          selectedLoan.paymentPlan
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between ">
                    <span className="text-[#49576D] text-[13.78px] font-medium">
                      Total Repayment Amount
                    </span>
                    <span className="text-black">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        selectedLoan.amount *
                          (1 + selectedLoan.interestRate / 100 + 0.008 + 0.002)
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className=" flex flex-row items-center justify-between gap-2 mt-4">
                <Button className=" cursor-pointer w-[90%] bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] text-white px-4 py-2 rounded-[10px] flex items-center gap-2">
                  Repay Now –{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(
                    (selectedLoan.amount *
                      (1 + selectedLoan.interestRate / 100 + 0.008 + 0.002)) /
                      selectedLoan.paymentPlan
                  )}{" "}
                  Due
                </Button>
                <Button
                  onClick={handleDeleteLoan}
                  disabled={isDeleting}
                  className="cursor-pointer w-fit bg-[#FF3B30]/30 hover:bg-[#FF3B30]/50 text-[#FF3B30] px-4 py-2 rounded-[10px] flex items-center gap-2 mx-auto justify-center"
                >
                  {isDeleting ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanOverview;
