import { useState, useEffect, useCallback } from "react";
import { apiService, ApiResponse } from "../api-service";

// Generic hook for API calls with loading and error states
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: unknown[] = [],
  options: {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { immediate = true, onSuccess, onError } = options;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();

      if (response.success && response.data) {
        setData(response.data);
        onSuccess?.(response.data);
      } else {
        const errorMessage = response.message || "An error occurred";
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
}

// Specific hooks for common operations
export function useAssets() {
  return useApi(() => apiService.getAssets(), [], { immediate: true });
}

export function useCurrentUser() {
  return useApi(() => apiService.getCurrentUser(), [], { immediate: true });
}

export function useLoans() {
  return useApi(() => apiService.getLoans(), [], { immediate: true });
}

// Hook for mutations (POST, PUT, DELETE operations)
export function useMutation<T, P = unknown>(
  mutationFn: (params: P) => Promise<ApiResponse<T>>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const { onSuccess, onError } = options;

  const mutate = useCallback(
    async (params: P) => {
      setLoading(true);
      setError(null);

      try {
        const response = await mutationFn(params);

        if (response.success && response.data) {
          setData(response.data);
          onSuccess?.(response.data);
          return response.data;
        } else {
          const errorMessage = response.message || "An error occurred";
          setError(errorMessage);
          onError?.(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  return {
    mutate,
    loading,
    error,
    data,
  };
}

// Specific mutation hooks
export function useCreateAsset() {
  return useMutation((formData: FormData) => apiService.createAsset(formData), {
    onSuccess: () => {
      // Optionally refresh assets list
      window.location.reload();
    },
  });
}

export function useRequestLoan() {
  return useMutation((loanData: any) => apiService.requestLoan(loanData), {
    onSuccess: () => {
      // Optionally refresh loans list
      window.location.reload();
    },
  });
}

export function useJoinWaitlist() {
  return useMutation<
    unknown,
    {
      fullName: string;
      email: string;
      country: string;
      telegramUsername: string;
    }
  >((data) => apiService.joinWaitlist(data));
}

// Hook for paginated data
export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number) => Promise<ApiResponse<T[]>>,
  initialPage: number = 1,
  limit: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(
    async (pageNum: number, append: boolean = false) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(pageNum, limit);

        if (response.success && response.data) {
          const newData = response.data;

          if (append) {
            setData((prev) => [...prev, ...newData]);
          } else {
            setData(newData);
          }

          setHasMore(newData.length === limit);
        } else {
          setError(response.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [apiCall, limit]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPage(nextPage, true);
    }
  }, [loading, hasMore, page, fetchPage]);

  const refresh = useCallback(() => {
    setPage(1);
    setData([]);
    fetchPage(1, false);
  }, [fetchPage]);

  useEffect(() => {
    fetchPage(page, false);
  }, [fetchPage, page]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    page,
  };
}
