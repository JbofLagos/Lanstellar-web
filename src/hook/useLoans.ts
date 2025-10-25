/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { getLoans, getAllLoans } from "@/lib/api-service";

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
      return response;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    isLoadingLoans,
    loans: (data?.data as any)?.loans || [],
    error,
    refetch,
  };
}

// Get all loans
export function useGetAllLoans() {
  const {
    isPending: isLoadingAllLoans,
    data,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allLoans"],
    queryFn: async () => {
      const response = await getAllLoans();
      return response;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    isLoadingAllLoans,
    allLoans: (data?.data as any)?.loans || [],
    error,
    refetch,
  };
}
