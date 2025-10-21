import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, type ApiResponse, type User } from "@/lib/api-service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface LoginData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: loginUser, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (body: LoginData) => {
      return await login(body);
    },
    onSuccess(data: ApiResponse<{ user: User; token: string }>) {
      toast.success(data.message || "Login successful!");
      if (data.success && data.data) {
        const { token, user } = data.data;
        localStorage.setItem("token", token);
        queryClient.setQueryData(["user"], user);
        navigate("/dashboard");
      }
    },
    onError(error) {
      console.log(error);
      toast.error(`${error.message}`);
    },
  });

  return { loginUser, loading: isPending };
};
