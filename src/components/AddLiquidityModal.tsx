import { useState } from "react";
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

interface AddLiquidityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddLiquidityModal = ({ open, onOpenChange }: AddLiquidityModalProps) => {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { address } = useAppKitAccount();

  const durationOptions = [
    { value: "1", label: "1 Month" },
    { value: "2", label: "2 Months" },
    { value: "3", label: "3 Months" },
    { value: "6", label: "6 Months" },
  ];

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
      // TODO: Replace with actual API call
      // await addLiquidity({ address, amount: parseFloat(amount), duration });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Liquidity added successfully!");

      // Reset form
      setAmount("");
      setDuration("");
      onOpenChange(false);
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
            Provide liquidity to the pool by entering your wallet address,
            amount, and duration.
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
            <Label className="text-[13.78px] font-medium text-[#1A1A21]">
              Duration
            </Label>
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
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#504CF6] hover:bg-[#504CF6]/90 text-white"
            >
              {isSubmitting ? "Adding..." : "Add Liquidity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLiquidityModal;
