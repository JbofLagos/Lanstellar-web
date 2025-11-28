import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAppKitAccount } from "@reown/appkit/react";
import { truncateAddress } from "@/lib/utils";
import { useDepositLiquidity } from "@/hook/useDepositLiquidity";
import { useLiquidity } from "@/hook/useLiquidity";
import { parseUnits } from "viem";
import { CURRENCY_CONTRACT_ADDRESS } from "@/constant/contractABI";
import { Loader2 } from "lucide-react";

interface AddLiquidityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddLiquidityModal = ({ open, onOpenChange }: AddLiquidityModalProps) => {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { address } = useAppKitAccount();
  const {
    depositLiquidity,
    isLoading,
    isApproving,
    isConfirmed,
    hash,
    resetDeposit,
  } = useDepositLiquidity();
  const { submitLiquidity, isSubmitting: isSubmittingToAPI } = useLiquidity();

  // Track pending submission data for API call after blockchain confirmation
  const pendingSubmissionRef = useRef<{
    amount: number;
    interest: number;
    duration: number;
  } | null>(null);

  // Submit to API when blockchain transaction is confirmed
  useEffect(() => {
    if (isConfirmed && hash && pendingSubmissionRef.current) {
      const { amount, interest, duration } = pendingSubmissionRef.current;

      console.log("✅ Blockchain deposit confirmed, submitting to API...", {
        amount,
        interest,
        duration,
        hash,
      });

      // Submit to API
      submitLiquidity({
        amount,
        interest,
        duration,
        hash,
      });

      // Clear pending submission
      pendingSubmissionRef.current = null;

      // Reset form and close modal
      setAmount("");
      setDuration("");
      resetDeposit();
      onOpenChange(false);
    }
  }, [isConfirmed, hash, submitLiquidity, resetDeposit, onOpenChange]);

  // Calculate APY based on liquidity amount tiers
  const getAPYForLiquidity = (depositAmount: number): number => {
    if (depositAmount >= 1000000) {
      return 20; // 20% APY for 1M+
    } else if (depositAmount >= 100000) {
      return 18; // 18% APY for 100k-999.9k
    } else if (depositAmount >= 10000) {
      return 14; // 14% APY for 10k-99.9k
    } else if (depositAmount >= 1000) {
      return 12; // 12% APY for 1k-9.9k
    } else {
      return 12; // Default to 12% for amounts below 1k
    }
  };

  // Get current APY based on entered amount
  const currentAmount = parseFloat(amount) || 0;
  const currentAPY = getAPYForLiquidity(currentAmount);
  const monthlyROI = currentAPY / 12; // Monthly ROI percentage

  // Calculate ROI for each duration
  const calculateROI = (
    months: number
  ): { percentage: number; amount: number } => {
    const roiPercentage = monthlyROI * months;
    const roiAmount = (currentAmount * roiPercentage) / 100;
    return { percentage: roiPercentage, amount: roiAmount };
  };

  // Duration options with dynamic ROI calculation
  const durationOptions = [
    { value: "1", label: "1 Month", months: 1 },
    { value: "2", label: "2 Months", months: 2 },
    { value: "3", label: "3 Months", months: 3 },
  ].map((option) => {
    const roi = calculateROI(option.months);
    return {
      ...option,
      roiPercentage: roi.percentage,
      roiAmount: roi.amount,
    };
  });

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!duration) {
      toast.error("Please select a duration");
      return;
    }

    // Store pending submission data for API call after blockchain confirmation
    pendingSubmissionRef.current = {
      amount: currentAmount,
      interest: currentAPY,
      duration: parseInt(duration),
    };

    // Convert APY to basis points (1% = 100 BP)
    const interestBP = BigInt(currentAPY * 100);

    await depositLiquidity({
      loanId: 2n,
      tokenAddress: CURRENCY_CONTRACT_ADDRESS,
      amount: parseUnits(amount, 18),
      interestBP, // Dynamic APY based on deposit amount
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!duration) {
      toast.error("Please select a duration");
      return;
    }

    setIsSubmitting(true);

    try {
      await handleDeposit();
    } catch (error) {
      toast.error("Failed to add liquidity. Please try again.");
      console.error("Error adding liquidity:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAmount("");
      setDuration("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-semibold text-[#1A1A21]">
            Add Liquidity
          </DialogTitle>
          <DialogDescription className="text-[14px] text-[#8C94A6]">
            Provide liquidity to the pool by entering the amount and duration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Wallet Address */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13.78px] font-medium text-[#1A1A21]">
              Wallet Address
            </p>
            <p className="text-[13.78px] font-medium text-[#8C94A6]">
              {truncateAddress(address || "")}
            </p>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label className="text-[13.78px] font-medium text-[#1A1A21]">
              Amount (USD)
            </Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full h-[42px] rounded-[10px] border border-[#E4E3EC] bg-white text-[14px]"
              disabled={isSubmitting}
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[13.78px] font-medium text-[#1A1A21]">
                Duration
              </Label>
              {currentAmount > 0 && (
                <span className="text-[12px] text-[#504CF6] font-medium">
                  {currentAPY}% APY
                </span>
              )}
            </div>
            <Select
              value={duration}
              onValueChange={setDuration}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full h-[42px] rounded-[10px] border border-[#E4E3EC] bg-white text-[14px]">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{option.label}</span>
                      {currentAmount > 0 && (
                        <span className="text-[#504CF6] text-[12px]">
                          +{option.roiPercentage.toFixed(2)}% ($
                          {option.roiAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          )
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ROI Preview */}
          {currentAmount > 0 && duration && (
            <div className="bg-[#F8F8FF] border border-[#E4E3EC] rounded-[10px] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-[#8C94A6]">Expected ROI</span>
                <span className="text-[14px] font-semibold text-[#504CF6]">
                  +
                  {durationOptions
                    .find((d) => d.value === duration)
                    ?.roiPercentage.toFixed(2)}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#8C94A6]">
                  Expected Return
                </span>
                <span className="text-[14px] font-semibold text-[#1A1A21]">
                  $
                  {durationOptions
                    .find((d) => d.value === duration)
                    ?.roiAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto border-[#E4E3EC] text-[#49576D] hover:bg-[#F7F7F8]"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading || isSubmittingToAPI}
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-[#504CF6] hover:bg-[#504CF6]/90 text-white"
            >
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Approving...
                </>
              ) : isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Adding...
                </>
              ) : isSubmittingToAPI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                "Add Liquidity"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLiquidityModal;
