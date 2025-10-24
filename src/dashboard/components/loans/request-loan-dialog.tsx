import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RequestLoanForm from "./requestLoan";

interface RequestLoanDialogProps {
  onSuccess?: () => void;
  triggerLabel?: string;
  className?: string;
  preSelectedAssetId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const RequestLoanDialog: React.FC<RequestLoanDialogProps> = ({
  onSuccess,
  triggerLabel = "Request Loan",
  className,
  preSelectedAssetId,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const handleSuccess = () => {
    onSuccess?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button
            className={
              className +
              " bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] text-white rounded-[10px]"
            }
          >
            {triggerLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-fit border-[4px] border-[#F8F8F8] rounded-[20px] scrollbar-hide max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-semibold text-black">
            Request Loan
          </DialogTitle>
        </DialogHeader>
        <RequestLoanForm
          onSuccess={handleSuccess}
          preSelectedAssetId={preSelectedAssetId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RequestLoanDialog;
