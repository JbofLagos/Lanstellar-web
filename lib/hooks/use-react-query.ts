import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, Asset, User, LoanRequest } from "../api-service";
import { toast } from "sonner";

// Query Keys - centralized for consistency
export const queryKeys = {
  assets: ["assets"] as const,
  asset: (id: string) => ["assets", id] as const,
  user: ["user"] as const,
  loans: ["loans"] as const,
} as const;

// Asset Queries
export function useAssets() {
  return useQuery({
    queryKey: queryKeys.assets,
    queryFn: async () => {
      const response = await apiService.getAssets();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch assets");
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: queryKeys.asset(id),
    queryFn: async () => {
      const response = await apiService.getAssetById(id);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch asset");
    },
    enabled: !!id, // Only run if id exists
  });
}

// User Queries
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch user");
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Loan Queries
export function useLoans() {
  return useQuery({
    queryKey: queryKeys.loans,
    queryFn: async () => {
      const response = await apiService.getLoans();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch loans");
    },
  });
}

// Asset Mutations
export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => apiService.createAsset(formData),
    onSuccess: (data) => {
      console.log(data);
      // Invalidate and refetch assets
      queryClient.invalidateQueries({ queryKey: queryKeys.assets });
      toast.success("Asset created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create asset");
    },
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Asset> }) =>
      apiService.updateAsset(id, data),
    onSuccess: (data, variables) => {
      // Update the specific asset in cache
      queryClient.setQueryData(queryKeys.asset(variables.id), data);
      // Invalidate assets list
      queryClient.invalidateQueries({ queryKey: queryKeys.assets });
      toast.success("Asset updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update asset");
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteAsset(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.asset(id) });
      // Invalidate assets list
      queryClient.invalidateQueries({ queryKey: queryKeys.assets });
      toast.success("Asset deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete asset");
    },
  });
}

// User Mutations
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => apiService.updateUser(data),
    onSuccess: (data) => {
      // Update user in cache
      queryClient.setQueryData(queryKeys.user, data);
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}

// Loan Mutations
export function useRequestLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loanData: LoanRequest) => apiService.requestLoan(loanData),
    onSuccess: () => {
      // Invalidate loans
      queryClient.invalidateQueries({ queryKey: queryKeys.loans });
      toast.success("Loan request submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit loan request");
    },
  });
}

// Waitlist Mutation
export function useJoinWaitlist() {
  return useMutation({
    mutationFn: (data: {
      fullName: string;
      email: string;
      country: string;
      telegramUsername: string;
    }) => apiService.joinWaitlist(data),
    onSuccess: () => {
      toast.success("You're on the waitlist! We'll be in touch.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to join waitlist");
    },
  });
}

// Authentication Mutations
export function useLogin() {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiService.login(credentials),
    onSuccess: (data) => {
      // Store token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      toast.success("Login successful!");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (userData: {
      fullName: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => apiService.register(userData),
    onSuccess: (data) => {
      // Store token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      toast.success("Account created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed");
    },
  });
}

// Utility hooks
export function useInvalidateAssets() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.assets });
  };
}

export function usePrefetchAsset() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.asset(id),
      queryFn: async () => {
        const response = await apiService.getAssetById(id);
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || "Failed to fetch asset");
      },
    });
  };
}
