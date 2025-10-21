import { useNavigate } from "react-router-dom";
import { register, type ApiResponse, type User } from "@/lib/api-service";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  userType?: string;
}

export const useSignup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: signup, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (body: SignupData) => {
      return await register(body);
    },
    onSuccess(data: ApiResponse<{ user: User; token: string }>) {
      console.log(data);

      if (data.success && data.data) {
        const { token, user } = data.data;
        localStorage.setItem("token", token);
        queryClient.setQueryData(["user"], user);
        toast.success(data.message || "Account created successfully!");
        navigate("/setup-profile");
      }
    },
    onError(error) {
      console.log(error);
      toast.error(`${error.message}`);
    },
  });
  return { signup, loading: isPending };
};
