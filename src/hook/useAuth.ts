import { useCurrentUser } from "./useCurrentUser";

export const useAuth = () => {
  const token = localStorage.getItem("token");
  const { user, isLoadingUser } = useCurrentUser();

  const isAuthenticated = !!token;

  return {
    isAuthenticated,
    user,
    isLoadingUser,
    token,
  };
};
