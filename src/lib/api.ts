import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `https://backend-al2j.onrender.com/api`,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
