import { useCurrentUser } from "./useCurrentUser";
import { getToken } from "@/lib/auth";

export const useAuth = () => {
  const token = getToken(); // Checks both localStorage and cookies
  const { user, isLoadingUser, error } = useCurrentUser();

  const isAuthenticated = !!token;

  return {
    isAuthenticated,
    user,
    isLoadingUser,
    token,
    error, // Expose error for handling in protected routes
  };
};
