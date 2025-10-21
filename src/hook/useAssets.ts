import { useQuery } from "@tanstack/react-query";
import { getAssets, type Asset } from "@/lib/api-service";

export function useAssets() {
  const {
    isPending: isLoadingAssets,
    data,
    error,
    refetch,
  } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const response = await getAssets();
      return response;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    isLoadingAssets,
    assets: (data?.assets as Asset[]) || [],
    error,
    refetch,
  };
}
