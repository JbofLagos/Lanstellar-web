import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addLiquidity,
  getLiquidity,
  type LiquidityRequest,
  type Liquidity,
  type ApiResponse,
} from "@/lib/api-service";
import { toast } from "sonner";

/**
 * Hook for adding liquidity via API
 *
 * @example
 * const { submitLiquidity, isSubmitting, isSuccess } = useLiquidity();
 *
 * await submitLiquidity({
 *   amount: 10000,
 *   interest: 5.5,
 *   duration: 1,
 *   hash: "0x1234567890abcdef...",
 * });
 */
export function useLiquidity() {
  const queryClient = useQueryClient();

  const {
    mutate: submitLiquidity,
    mutateAsync: submitLiquidityAsync,
    isPending: isSubmitting,
    isSuccess,
    error,
    reset,
    data,
  } = useMutation({
    mutationKey: ["addLiquidity"],
    mutationFn: async (liquidityData: LiquidityRequest) => {
      console.log("🚀 Submitting liquidity to API:", liquidityData);
      return await addLiquidity(liquidityData);
    },
    onSuccess: (response: ApiResponse) => {
      if (response.success) {
        console.log("✅ Liquidity added successfully:", response);
        toast.success(response.message || "Liquidity added successfully!");
        // Invalidate liquidity queries to refetch updated data
        queryClient.invalidateQueries({ queryKey: ["liquidity"] });
      } else {
        console.error("❌ Liquidity API returned error:", response);
        toast.error(response.message || "Failed to add liquidity");
      }
    },
    onError: (error) => {
      console.error("❌ Liquidity submission error:", error);
      toast.error(`${error.message || "Failed to add liquidity"}`);
    },
  });

  return {
    submitLiquidity,
    submitLiquidityAsync,
    isSubmitting,
    isSuccess,
    error,
    reset,
    data,
  };
}

/**
 * Hook for fetching user's liquidity data
 *
 * @example
 * const { liquidity, isLoading, refetch } = useGetLiquidity();
 *
 * // liquidity is an array of Liquidity objects
 * liquidity.forEach((item) => {
 *   console.log(item.amount, item.interest, item.duration, item.hash);
 * });
 */
export function useGetLiquidity() {
  const {
    isPending: isLoading,
    data,
    error,
    refetch,
  } = useQuery({
    queryKey: ["liquidity"],
    queryFn: async () => {
      console.log("📥 Fetching user liquidity...");
      const response = await getLiquidity();
      return response;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Extract liquidity array from response
  // Adjust based on your API response structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseData = data as any;
  const liquidity = responseData?.data || responseData?.liquidity || [];

  return {
    isLoading,
    data: liquidity.liquidity as Liquidity[],
    error,
    refetch,
  } as const;
}
