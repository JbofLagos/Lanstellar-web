import axios from "axios";
import { clearToken } from "./auth";

export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL || "http://localhost:5858/api",
});

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Check localStorage first, then cookie
    const token = localStorage.getItem("token") || getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle token expiration and invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      // Check if error is due to authentication failure
      if (
        error.response?.status === 401 ||
        error.response?.status === 403 ||
        (error.response?.data?.message &&
          (error.response.data.message.toLowerCase().includes("token") ||
            error.response.data.message.toLowerCase().includes("expired") ||
            error.response.data.message.toLowerCase().includes("invalid") ||
            error.response.data.message.toLowerCase().includes("unauthorized")))
      ) {
        // Clear token from both localStorage and cookies
        clearToken();

        // Only redirect if we're not already on the login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
