import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAsset, type ApiResponse } from "@/lib/api-service";
import { toast } from "sonner";

interface CreateAssetData {
  assetTitle: string;
  assetCategory: string;
  assetWorth: string;
  assetLocation: string;
  assetDescription: string;
  media: File[];
  assetDocs: File[];
}

export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createNewAsset, isPending } = useMutation({
    mutationKey: ["createAsset"],
    mutationFn: async (data: CreateAssetData) => {
      console.log("Creating asset with data:", data);

      const formData = new FormData();

      // Append text fields
      formData.append("assetTitle", data.assetTitle.trim());
      formData.append("assetCategory", data.assetCategory.trim());
      formData.append("assetWorth", data.assetWorth.trim());
      formData.append("assetLocation", data.assetLocation.trim());
      formData.append("assetDescription", data.assetDescription.trim());

      // Append multiple images
      data.media.forEach((file) => {
        formData.append("media", file);
      });

      // Append multiple documents
      data.assetDocs.forEach((file) => {
        formData.append("assetDocs", file);
      });

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      return await createAsset(formData);
    },
    onSuccess(data: ApiResponse) {
      if (data.success) {
        toast.success(data.message || "Asset created successfully!");
        // Invalidate assets query to refetch the list
        queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
    },
    onError(error) {
      console.log(error);
      toast.error(`${error.message}`);
    },
  });

  return { createNewAsset, loading: isPending };
};
