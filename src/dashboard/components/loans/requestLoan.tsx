import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

import {
  getAssets,
  getCurrentUser,
  requestLoan,
  type Asset,
  type LoanRequest,
} from "@/lib/api-service";

// Using LoanRequest from api-service for payload shape

interface RepaymentPlan {
  id: string;
  installments: number;
  percent: number;
}

interface RequestLoanFormProps {
  onSuccess?: () => void;
}

const RequestLoanForm: React.FC<RequestLoanFormProps> = ({ onSuccess }) => {
  const [plan, setPlan] = useState<string>("one");
  const [purpose, setPurpose] = useState<string>("");
  const [assetId, setAssetId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [borrower, setBorrower] = useState<string>("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [loanLoading, setLoanLoading] = useState(false);

  const repaymentPlans: RepaymentPlan[] = [
    { id: "one", installments: 1, percent: 5 },
    { id: "two", installments: 2, percent: 10 },
    { id: "three", installments: 3, percent: 15 },
  ];

  useEffect(() => {
    const fetchAssets = async () => {
      setAssetsLoading(true);
      try {
        const response = await getAssets();
        console.log(response);
        if (response?.success) {
          const assetsData = Array.isArray(response?.data) ? response.data : [];
          setAssets(assetsData);
        } else {
          console.error("Failed to fetch assets:", response?.message);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setAssetsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        const response = await getCurrentUser();
        console.log("borrower", response);
        if (response.success && response.data && response.data._id) {
          setBorrower(response.data._id);
        } else {
          console.error("Failed to fetch user:", response.message);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  const getMaxLoanAmount = (): number => {
    const selectedAsset = assets.find((asset) => asset._id === assetId);
    if (!selectedAsset) return 0;
    const worth = Number(selectedAsset.assetWorth);
    return worth > 0 ? Math.floor(worth * 0.3) : 0;
  };

  const validateLoanAmount = (value: string): boolean => {
    const numValue = Number(value);
    const maxAmount = getMaxLoanAmount();
    if (numValue > maxAmount && maxAmount > 0) {
      toast.error(
        `Maximum loan amount for this asset is $${maxAmount.toLocaleString()}`
      );
      return false;
    }
    return true;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (assetId && value && !validateLoanAmount(value)) {
      return;
    }
    setAmount(value);
  };

  const resetForm = (): void => {
    setPlan("one");
    setPurpose("");
    setAssetId("");
    setAmount("");
    setDuration("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!purpose.trim())
      return toast.error("Please enter the purpose of the loan");
    if (!assetId) return toast.error("Please select a collateral asset");
    if (!amount || Number(amount) <= 0)
      return toast.error("Please enter a valid loan amount");
    if (!validateLoanAmount(amount)) return;
    if (!duration) return toast.error("Please select a loan duration");
    if (!borrower)
      return toast.error(
        "User information not loaded. Please refresh and try again."
      );

    const selectedPlan = repaymentPlans.find((p) => p.id === plan);
    if (!selectedPlan) return toast.error("Please select a repayment plan");

    const formData: LoanRequest = {
      loanPurpose: purpose.trim(),
      borrower,
      assetId,
      amount: Number(amount),
      duration: Number(duration),
      paymentPlan: selectedPlan.installments,
      interestRate: selectedPlan.percent,
    };

    setLoanLoading(true);
    try {
      const response = await requestLoan(formData);
      if (response.success) {
        resetForm();
        toast.success("Loan request submitted successfully");
        onSuccess?.();
      } else {
        throw new Error(response.message || "Failed to request loan");
      }
    } catch (err) {
      console.error("Loan request failed:", err);
      toast.error("Something went wrong while requesting the loan.");
    } finally {
      setLoanLoading(false);
    }
  };

  if (assetsLoading || userLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading your information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-fit max-w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Purpose of Loan */}
        <div className="grid gap-1.5">
          <Label
            htmlFor="purpose"
            className="text-[13.78px] font-medium text-[#1A1A21]"
          >
            Purpose of loan
          </Label>
          <Input
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="What do you need the loan for?"
            className="w-[454px] h-[37px] rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5]"
            disabled={loanLoading}
          />
        </div>

        {/* Eligible Collateral */}
        <div className="grid gap-1.5">
          <Label className="text-[13.78px] font-medium text-[#1A1A21]">
            Select Eligible Collateral
          </Label>
          <Select
            value={assetId}
            onValueChange={setAssetId}
            disabled={loanLoading}
          >
            <SelectTrigger className="w-full h-[37px] rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5]">
              <SelectValue placeholder="Select asset from your list" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Your Assets</SelectLabel>
                {assets.length === 0 ? (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    No assets available
                  </div>
                ) : (
                  assets.map((asset) => (
                    <SelectItem key={asset._id} value={asset._id}>
                      {asset.assetTitle} - $
                      {Number(asset.assetWorth).toLocaleString()}{" "}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({asset.assetCategory})
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {assets.length === 0 && (
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
            Amount Needed
          </Label>
          <Input
            id="amount"
            type="number"
            min="1"
            step="0.01"
            max={getMaxLoanAmount()}
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount ($)"
            className="w-[454px] h-[37px] rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5]"
            disabled={loanLoading || !assetId}
          />
          <div className="flex flex-col gap-1">
            <span className="text-[#A19821] font-medium text-[12px]">
              *Maximum of 30% of asset value
            </span>
            {assetId && getMaxLoanAmount() > 0 && (
              <span className="text-[#10b981] font-medium text-[11px]">
                Maximum available: ${getMaxLoanAmount().toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Duration */}
        <div className="grid gap-1.5">
          <Label className="text-[13.78px] font-medium text-[#1A1A21]">
            Select Loan Duration
          </Label>
          <Select
            value={duration}
            onValueChange={setDuration}
            disabled={loanLoading}
          >
            <SelectTrigger className="w-full h-[37px] rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5]">
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
            Select Repayment Plan
          </Label>
          <RadioGroup
            value={plan}
            onValueChange={setPlan}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {repaymentPlans.map((p) => (
              <label
                key={p.id}
                htmlFor={`plan-${p.id}`}
                className={cn(
                  "cursor-pointer block rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
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
                      <div className="text-[13.78px] font-medium">
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
                />
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Submit */}
        <div className="mt-6">
          <Button
            type="submit"
            disabled={loanLoading || assets.length === 0 || !borrower}
            className="bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] cursor-pointer text-white rounded-[10px] w-full h-[40px] disabled:opacity-50"
          >
            {loanLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Request Loan"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestLoanForm;
