"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAssets,
  useCurrentUser,
  useRequestLoan,
} from "@/lib/hooks/use-react-query";
import { toast } from "sonner";

const RequestLoan = () => {
  const [plan, setPlan] = useState<string>("one");
  const [purpose, setPurpose] = useState("");
  const [assetId, setAssetId] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [borrower, setBorrower] = useState("");

  // ✅ React Query hooks
  const { data: rawAssets, isLoading: assetsLoading } = useAssets();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { mutateAsync: requestLoan, isPending: loanLoading } = useRequestLoan();

  // ✅ Normalize the assets data to always be an array
  const assets = Array.isArray(rawAssets) ? rawAssets : rawAssets?.assets || [];

  // Repayment plan mapping
  const repaymentPlans = [
    { id: "one", installments: 1, percent: 5 },
    { id: "two", installments: 2, percent: 10 },
    { id: "three", installments: 3, percent: 15 },
  ];

  const resetForm = () => {
    setPlan("one");
    setPurpose("");
    setAssetId("");
    setAmount("");
    setDuration("");
  };

  // ✅ Set borrower name when user data is loaded
  useEffect(() => {
    if (user?.fullName) {
      setBorrower(user.fullName);
    }
  }, [user]);

  // ✅ Calculate maximum loan amount based on selected asset
  const getMaxLoanAmount = () => {
    if (!assets || assets.length === 0) return 0;
    const selectedAsset = assets.find((asset) => asset._id === assetId);
    return selectedAsset
      ? Math.floor(Number(selectedAsset.assetWorth) * 0.3)
      : 0;
  };

  // ✅ Validate loan amount
  const validateLoanAmount = (value: string) => {
    const numValue = Number(value);
    const maxAmount = getMaxLoanAmount();

    if (maxAmount > 0 && numValue > maxAmount) {
      toast.error(
        `Maximum loan amount for this asset is $${maxAmount.toLocaleString()}`
      );
      return false;
    }
    return true;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);

    // Validate amount if asset is selected
    if (assetId && value) {
      validateLoanAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Validation checks
    if (!purpose.trim()) {
      toast.error("Please enter the purpose of the loan");
      return;
    }

    if (!assetId) {
      toast.error("Please select a collateral asset");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid loan amount");
      return;
    }

    if (!validateLoanAmount(amount)) {
      return;
    }

    if (!duration) {
      toast.error("Please select a loan duration");
      return;
    }

    if (!borrower) {
      toast.error("User information not loaded. Please refresh and try again.");
      return;
    }

    const selectedPlan = repaymentPlans.find((p) => p.id === plan);
    if (!selectedPlan) {
      toast.error("Please select a repayment plan");
      return;
    }

    const formData = {
      loanPurpose: purpose.trim(),
      borrower,
      assetId,
      amount: Number(amount),
      duration: Number(duration),
      paymentPlan: selectedPlan.installments,
      interestRate: selectedPlan.percent,
    };

    try {
      await requestLoan(formData);
      toast.success("Loan request submitted successfully!");
      resetForm();
    } catch (err) {
      console.error("Failed to request loan:", err);
      toast.error("Something went wrong while requesting loan.");
    }
  };

  // ✅ Loading state
  if (assetsLoading || userLoading) {
    return (
      <DialogContent className="w-fit border-[4px] border-[#F8F8F8] rounded-[20px]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-semibold text-black">
            Request loan
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading your information...</span>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="w-fit border-[4px] border-[#F8F8F8] scrollbar-hide rounded-[20px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-[20px] font-semibold text-black">
          Request loan
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Purpose of loan */}
        <div className="grid gap-1.5">
          <Label
            htmlFor="purpose"
            className="text-[13.78px] font-medium text-[#1A1A21]"
          >
            Purpose of loan <span className="text-red-500">*</span>
          </Label>
          <Input
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="What do you need the loan for?"
            className="w-[454px] h-[37px] rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#333]"
            disabled={loanLoading}
            required
          />
        </div>

        {/* Select Eligible Collateral */}
        <div className="grid gap-1.5">
          <Label className="text-[13.78px] font-medium text-[#1A1A21]">
            Select Eligible Collateral <span className="text-red-500">*</span>
          </Label>
          <Select
            value={assetId}
            onValueChange={setAssetId}
            disabled={loanLoading}
            required
          >
            <SelectTrigger className="w-full h-[37px] rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#333] shadow-none">
              <SelectValue placeholder="Select asset from your list of collateral" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Your Assets</SelectLabel>
                {!assets || assets.length === 0 ? (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    No assets available
                  </div>
                ) : (
                  assets.map((asset) => (
                    <SelectItem key={asset._id} value={asset._id}>
                      {asset.assetTitle} - $
                      {asset.assetWorth?.toLocaleString() || "N/A"}
                      <span className="text-xs text-muted-foreground ml-2">
                        ({asset.assetCategory})
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {(!assets || assets.length === 0) && (
            <span className="text-[#ef4444] text-[11px] font-medium">
              *You need to add assets first to use as collateral
            </span>
          )}
        </div>

        {/* Amount Needed */}
        <div className="grid gap-1.5">
          <Label
            htmlFor="amount"
            className="text-[13.78px] font-medium text-[#1A1A21]"
          >
            Amount Needed <span className="text-red-500">*</span>
          </Label>
          <Input
            id="amount"
            type="number"
            min="1"
            step="0.01"
            max={getMaxLoanAmount() || undefined}
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount ($)"
            className="w-[454px] h-[37px] rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#333]"
            disabled={loanLoading || !assetId}
            required
          />
          <div className="flex flex-col gap-1">
            <span className="text-[#A19821] font-medium text-[12px]">
              *Amount must be at max of 30% of asset value
            </span>
            {assetId && getMaxLoanAmount() > 0 && (
              <span className="text-[#10b981] font-medium text-[11px]">
                Maximum available: ${getMaxLoanAmount().toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Select Loan Duration */}
        <div className="grid gap-1.5">
          <Label className="text-[13.78px] font-medium text-[#1A1A21]">
            Select Loan Duration <span className="text-red-500">*</span>
          </Label>
          <Select
            value={duration}
            onValueChange={setDuration}
            disabled={loanLoading}
            required
          >
            <SelectTrigger className="w-full h-[37px] rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#333] shadow-none">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Duration</SelectLabel>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
                <SelectItem value="24">24 Months</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Repayment Plan */}
        <div className="grid gap-1.5">
          <Label className="text-[13.78px] font-medium text-[#1A1A21]">
            Select Repayment Plan <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={plan}
            onValueChange={setPlan}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            disabled={loanLoading}
          >
            {repaymentPlans.map((p) => (
              <label
                key={p.id}
                htmlFor={`plan-${p.id}`}
                className={cn(
                  "cursor-pointer",
                  "block rounded-lg border bg-card text-card-foreground shadow-sm transition-all",
                  "hover:shadow-md",
                  plan === p.id
                    ? "border-[#5B1E9F] ring-[1px] ring-[#5B1E9F] bg-[#5B1E9F]/5"
                    : "border-muted hover:border-[#5B1E9F]/30",
                  loanLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                <Card className="border-0 bg-transparent shadow-none h-[64px] w-[112px] p-0">
                  <CardContent className="flex h-full w-full items-center justify-center p-0">
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="text-xs text-muted-foreground">
                        ({p.percent}% interest)
                      </span>
                      <div className="text-[13.78px] whitespace-nowrap font-medium">
                        {p.installments}{" "}
                        {p.installments === 1 ? "installment" : "installments"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <RadioGroupItem
                  id={`plan-${p.id}`}
                  value={p.id}
                  className="sr-only"
                  disabled={loanLoading}
                />
              </label>
            ))}
          </RadioGroup>
          <span className="text-[#8C94A6] text-[11px] font-medium">
            *Interest rates are calculated based on the repayment plan
          </span>
        </div>

        <DialogFooter className="mt-6">
          <Button
            type="submit"
            disabled={
              loanLoading || (assets && assets.length === 0) || !borrower
            }
            className="bg-gradient-to-r cursor-pointer from-[#439EFF] to-[#5B1E9F] text-white px-4 py-2 rounded-[10px] flex items-center justify-center gap-2 w-full h-[40px] disabled:opacity-50"
          >
            {loanLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Request Loan"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default RequestLoan;
