import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clearToken } from "@/lib/auth";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = () => {
    // Clear token from both localStorage and cookies
    clearToken();
    
    // Clear React Query cache
    queryClient.clear();

    // Show success message
    toast.success("Logged out successfully");

    // Redirect to login page
    navigate("/login");
  };

  return { logout };
};
