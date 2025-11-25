import { useCurrentUser } from "./useCurrentUser";
import { getToken } from "@/lib/auth";

export const useAuth = () => {
  const token = getToken(); // Checks both localStorage and cookies
  const { user, isLoadingUser } = useCurrentUser();

  const isAuthenticated = !!token;

  return {
    isAuthenticated,
    user,
    isLoadingUser,
    token,
  };
};
