import api from "./api";
import { toast } from "sonner";
import axios from "axios";

// Types for API responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  assets?: Asset[];
}

export interface Loan {
  _id: string;
  loanPurpose: string;
  borrower: string;
  assetId: string;
  amount: number;
  duration: number;
  paymentPlan: number;
  interestRate: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface Asset {
  _id: string;
  assetTitle: string;
  assetCategory: string;
  assetLocation: string;
  verified: boolean;
  assetWorth: string | number;
  docs: string;
  media: { cloudinaryUrl: string }[];
  status: string;
  statusColor: string;
  assetDescription?: string;
  createdAt?: string;
  assetDocs: string[];
  loanStatus: boolean;
}

export interface User {
  _id: string;
  email: string;
  fullName?: string;
  companyName?: string;
  companyEmail?: string;
  companyAddress?: string;
  countryCode?: string;
  username?: string;
  walletAddress?: string;
  userType?: string;
  address?: string;
  country?: string;
  contact?: string;
  profilePicture?: string;
}

export interface LoanRequest {
  loanPurpose: string;
  borrower: string;
  assetId: string;
  amount: number;
  duration: number;
  paymentPlan: number;
  interestRate: number;
}

class ApiService {
  constructor() {}

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

      // Backend already returns { success, message, data } structure
      const apiResponse = response.data;

      if (showSuccessToast && successMessage) {
        toast.success(successMessage);
      }

      return apiResponse;
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
  getAssets = async () => {
    return this.request<Asset[]>("GET", "/assets");
  };

  createAsset = async (formData: FormData) => {
    return this.request("POST", "/assets/create-asset", formData, {
      showSuccessToast: true,
      successMessage: "Asset created successfully!",
    });
  };

  getAssetById = async (id: string) => {
    return this.request<Asset>("GET", `/assets/${id}`);
  };

  updateAsset = async (id: string, data: Partial<Asset>) => {
    return this.request("PUT", `/assets/${id}`, data, {
      showSuccessToast: true,
      successMessage: "Asset updated successfully!",
    });
  };

  deleteAsset = async (id: string) => {
    return this.request("DELETE", `/assets/${id}`, undefined, {
      showSuccessToast: true,
      successMessage: "Asset deleted successfully!",
    });
  };

  // User-related API calls
  getCurrentUser = async () => {
    return this.request<User>("GET", "/auth/me");
  };

  updateUser = async (data: Partial<User> | FormData) => {
    return this.request("PUT", "/auth/update-user", data, {
      showSuccessToast: true,
      successMessage: "Profile updated successfully!",
    });
  };

  // Authentication API calls
  login = async (credentials: { email: string; password: string }) => {
    return this.request<{ user: User; token: string }>(
      "POST",
      "/auth/login",
      credentials,
      { showErrorToast: true }
    );
  };

  register = async (userData: {
    email: string;
    password: string;
    confirmPassword: string;
    userType?: string;
  }) => {
    return this.request<{ user: User; token: string }>(
      "POST",
      "/auth/register",
      userData,
      {
        showSuccessToast: true,
        successMessage: "Account created successfully!",
      }
    );
  };

  // Loan-related API calls
  requestLoan = async (loanData: LoanRequest) => {
    return this.request("POST", "/loan/", loanData, {
      showSuccessToast: true,
      successMessage: "Loan request submitted successfully!",
    });
  };

  deleteLoan = async (id: string) => {
    return this.request("DELETE", `/loan/${id}`, undefined, {
      showSuccessToast: true,
      successMessage: "Loan deleted successfully!",
    });
  };

  getLoans = async () => {
    return this.request("GET", "/loan/user");
  };
  
  getAllLoans = async () => {
    return this.request("GET", "/loan");
  };

  // Waitlist API call
  joinWaitlist = async (data: {
    fullName: string;
    email: string;
    country: string;
    telegramUsername: string;
  }) => {
    return this.request("POST", "/waitlist", data, {
      showSuccessToast: true,
      showErrorToast: false,
      successMessage: "You're on the waitlist! We'll be in touch.",
    });
  };

  // Document upload API call
  uploadDocuments = async (formData: FormData) => {
    return this.request("POST", "/ai/submissions", formData, {
      showSuccessToast: true,
      successMessage: "Documents uploaded successfully!",
    });
  };
}

export const apiService = new ApiService();
export const {
  getAssets,
  createAsset,
  getAssetById,
  getAllLoans,
  updateAsset,
  deleteAsset,
  getCurrentUser,
  updateUser,
  login,
  register,
  requestLoan,
  getLoans,
  deleteLoan,
  joinWaitlist,
  uploadDocuments,
} = apiService;
