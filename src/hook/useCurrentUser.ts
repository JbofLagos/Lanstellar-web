import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api-service";

export function useCurrentUser() {
  const token = localStorage.getItem("token");
  const {
    isPending: isLoadingUser,
    data,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(),
    retry: 2,
  });

  return {
    isLoadingUser,
    user: data?.data,
    error,
    isAuthenticated: !!token,
  };
}
