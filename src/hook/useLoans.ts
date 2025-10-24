import { useQuery } from "@tanstack/react-query";
import { getLoans } from "@/lib/api-service";

export interface Loan {
  _id: string;
  loanPurpose: string;
  borrower: string;
  assetId: string;
  amount: number;
  duration: number;
  paymentPlan: number;
  interestRate: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useLoans() {
  const {
    isPending: isLoadingLoans,
    data,
    error,
    refetch,
  } = useQuery({
    queryKey: ["loans"],
    queryFn: async () => {
      const response = await getLoans();
      console.log(response);
      return response;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    isLoadingLoans,
    loans: (data?.data as Loan[]) || [],
    error,
    refetch,
  };
}

// Request Loan
