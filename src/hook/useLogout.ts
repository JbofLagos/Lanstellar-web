import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear React Query cache
    queryClient.clear();

    // Show success message
    toast.success("Logged out successfully");

    // Redirect to login page
    navigate("/login");
  };

  return { logout };
};
