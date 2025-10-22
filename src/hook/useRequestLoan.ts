import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  requestLoan,
  type LoanRequest,
  type ApiResponse,
} from "@/lib/api-service";
import { toast } from "sonner";

export function useRequestLoan() {
  const queryClient = useQueryClient();

  const {
    mutate: submitLoanRequest,
    isPending: isSubmittingLoan,
    isSuccess: isLoanSubmitted,
    error,
    reset,
  } = useMutation({
    mutationKey: ["requestLoan"],
    mutationFn: async (loanData: LoanRequest) => {
      console.log("Submitting loan request with data:", loanData);
      return await requestLoan(loanData);
    },
    onSuccess: (data: ApiResponse) => {
      if (data.success) {
        toast.success(data.message || "Loan request submitted successfully!");
        // Invalidate the loans query to refetch the updated list
        queryClient.invalidateQueries({ queryKey: ["loans"] });
      }
    },
    onError: (error) => {
      console.error("Loan request error:", error);
      toast.error(`${error.message || "Failed to submit loan request"}`);
    },
  });

  return {
    submitLoanRequest,
    isSubmittingLoan,
    isLoanSubmitted,
    error,
    reset,
  };
}
