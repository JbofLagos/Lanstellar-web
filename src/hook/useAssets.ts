import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAssets,
  deleteAsset,
  type Asset,
  type ApiResponse,
} from "@/lib/api-service";
import { toast } from "sonner";

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

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteAssetMutation, isPending } = useMutation({
    mutationKey: ["deleteAsset"],
    mutationFn: async (assetId: string) => {
      console.log("Deleting asset with ID:", assetId);
      return await deleteAsset(assetId);
    },
    onSuccess(data: ApiResponse) {
      if (data.success) {
        toast.success(data.message || "Asset deleted successfully!");
        // Invalidate assets query to refetch the list
        queryClient.invalidateQueries({ queryKey: ["assets"] });
      } else {
        toast.error(data.message || "Failed to delete asset");
      }
    },
    onError(error) {
      console.log("Delete error:", error);
      toast.error(`${error.message}`);
    },
  });

  return { deleteAssetMutation, loading: isPending };
}
