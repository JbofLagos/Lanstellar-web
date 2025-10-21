import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, type ApiResponse, type User } from "@/lib/api-service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UpdateProfileData {
  fullName?: string;
  email?: string;
  address?: string;
  companyName?: string;
  companyEmail?: string;
  companyAddress?: string;
  countryCode?: string;
  contact?: string;
  username?: string;
  profilePicture?: File | null;
}

export const useUpdateProfile = (redirectOnSuccess = true) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: updateProfile, isPending } = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: async (body: UpdateProfileData) => {
      // Convert to FormData if there's a file
      const hasFile = body.profilePicture instanceof File;

      if (hasFile) {
        const formData = new FormData();

        // Append all fields to FormData
        Object.entries(body).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (value instanceof File) {
              formData.append(key, value);
            } else {
              formData.append(key, String(value));
            }
          }
        });

        return (await updateUser(formData)) as ApiResponse<User>;
      } else {
        // Send as regular JSON if no file
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { profilePicture, ...jsonData } = body;
        return (await updateUser(jsonData)) as ApiResponse<User>;
      }
    },
    onSuccess(data: ApiResponse<User>) {
      toast.success(data.message || "Profile updated successfully!");

      if (data.success && data.data) {
        // Update the user in cache
        queryClient.setQueryData(["user"], data);

        // Only navigate if redirectOnSuccess is true
        if (redirectOnSuccess) {
          navigate("/dashboard");
        }
      }
    },
    onError(error) {
      console.log(error);
      toast.error(`${error.message}`);
    },
  });

  return { updateProfile, loading: isPending };
};
