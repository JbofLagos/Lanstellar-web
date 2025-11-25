import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api-service";
import { useEffect } from "react";
import { logout, getToken } from "@/lib/auth";
import axios from "axios";

export function useCurrentUser() {
  const token = getToken(); // Checks both localStorage and cookies
  const {
    isPending: isLoadingUser,
    data,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(),
    retry: 2,
    enabled: !!token, // Only fetch if token exists
  });

  // Handle token expiration or invalid token errors
  useEffect(() => {
    if (error) {
      const axiosError = error as unknown;
      if (axios.isAxiosError(axiosError)) {
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message?.toLowerCase() || "";

        const isAuthError =
          status === 401 ||
          status === 403 ||
          message.includes("token") ||
          message.includes("expired") ||
          message.includes("invalid") ||
          message.includes("unauthorized");

        if (isAuthError) {
          // Token is invalid or expired, logout and redirect
          logout();
        }
      }
    }
  }, [error]);

  return {
    // If there's no token, we're not loading (query is disabled)
    isLoadingUser: token ? isLoadingUser : false,
    user: data?.data,
    error,
    isAuthenticated: !!token,
  };
}
