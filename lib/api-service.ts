import api from "./api";
import { toast } from "sonner";
import axios from "axios";

// Types for API responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  assets?: T[];
  user?: T;
}

export interface Asset {
  _id: string;
  assetTitle: string;
  assetCategory: string;
  assetLocation: string;
  verified: string;
  assetWorth: string | number;
  image: string;
  status: string;
  statusColor: string;
  assetDescription?: string;
  createdAt?: string;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  walletAddress?: string;
}

export interface LoanRequest {
  assetId: string;
  amount: string;
  duration: string;
  purpose: string;
  plan: string;
  interestRate: number;
}

// Generic API service class
class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://backend-al2j.onrender.com/api";
  }

  // Generic request handler with error handling
  private async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: unknown,
    options?: {
      showErrorToast?: boolean;
      showSuccessToast?: boolean;
      successMessage?: string;
    }
  ): Promise<ApiResponse<T>> {
    const {
      showErrorToast = true,
      showSuccessToast = false,
      successMessage,
    } = options || {};

    try {
      let response;

      switch (method) {
        case "GET":
          response = await api.get(endpoint);
          break;
        case "POST":
          response = await api.post(endpoint, data);
          break;
        case "PUT":
          response = await api.put(endpoint, data);
          break;
        case "DELETE":
          response = await api.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      if (showSuccessToast && successMessage) {
        toast.success(successMessage);
      }

      return {
        success: true,
        data: response.data,
        message: response.data?.message,
      };
    } catch (error) {
      console.error(`API ${method} ${endpoint} failed:`, error);

      let errorMessage = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        errorMessage = message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (showErrorToast) {
        toast.error(errorMessage);
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  // Asset-related API calls
  async getAssets(): Promise<ApiResponse<Asset[]>> {
    return this.request<Asset[]>("GET", "/assets/", undefined, {
      showErrorToast: true,
    });
  }

  async createAsset(formData: FormData): Promise<ApiResponse<Asset>> {
    return this.request<Asset>("POST", "/assets/create-asset", formData, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "Asset created successfully!",
    });
  }

  async getAssetById(id: string): Promise<ApiResponse<Asset>> {
    return this.request<Asset>("GET", `/assets/${id}`, undefined, {
      showErrorToast: true,
    });
  }

  async updateAsset(
    id: string,
    data: Partial<Asset>
  ): Promise<ApiResponse<Asset>> {
    return this.request<Asset>("PUT", `/assets/${id}`, data, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "Asset updated successfully!",
    });
  }

  async deleteAsset(id: string): Promise<ApiResponse<unknown>> {
    return this.request<unknown>("DELETE", `/assets/${id}`, undefined, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "Asset deleted successfully!",
    });
  }

  // User-related API calls
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>("GET", "/auth/me", undefined, {
      showErrorToast: true,
    });
  }

  async updateUser(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>("PUT", "/auth/me", data, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "Profile updated successfully!",
    });
  }

  // Authentication API calls
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request<{ user: User; token: string }>(
      "POST",
      "/auth/login",
      credentials,
      {
        showErrorToast: true,
      }
    );
  }

  async register(userData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request<{ user: User; token: string }>(
      "POST",
      "/auth/register",
      userData,
      {
        showErrorToast: true,
        showSuccessToast: true,
        successMessage: "Account created successfully!",
      }
    );
  }

  // Loan-related API calls
  async requestLoan(loanData: LoanRequest): Promise<ApiResponse<unknown>> {
    return this.request<unknown>("POST", "/loan/", loanData, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "Loan request submitted successfully!",
    });
  }

  async getLoans(): Promise<ApiResponse<unknown[]>> {
    return this.request<unknown[]>("GET", "/loans/", undefined, {
      showErrorToast: true,
    });
  }

  // Waitlist API call
  async joinWaitlist(data: {
    fullName: string;
    email: string;
    country: string;
    telegramUsername: string;
  }): Promise<ApiResponse<unknown>> {
    return this.request<unknown>("POST", "/waitlist", data, {
      showErrorToast: false, // Don't show error toast for waitlist
      showSuccessToast: true,
      successMessage: "You're on the waitlist! We'll be in touch.",
    });
  }

  // Utility method for handling different response structures
  extractData<T>(response: ApiResponse<T>, fallback: T[] = []): T[] {
    if (!response.success || !response.data) {
      return fallback;
    }

    // Handle different response structures
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Type guard for objects with assets property
    if (
      response.data &&
      typeof response.data === "object" &&
      "assets" in response.data
    ) {
      const dataWithAssets = response.data as { assets: T[] };
      if (Array.isArray(dataWithAssets.assets)) {
        return dataWithAssets.assets;
      }
    }

    // Type guard for objects with data property
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      const dataWithData = response.data as { data: T[] };
      if (Array.isArray(dataWithData.data)) {
        return dataWithData.data;
      }
    }

    // If it's a single item, wrap in array
    if (response.data && typeof response.data === "object") {
      return [response.data];
    }

    return fallback;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual methods for convenience
export const {
  getAssets,
  createAsset,
  getAssetById,
  getCurrentUser,
  updateUser,
  login,
  register,
  requestLoan,
  getLoans,
  joinWaitlist,
  extractData,
} = apiService;
