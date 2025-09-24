// lib/auth.ts
import api from "./api";

export async function getCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data; // { user: {...} }
}

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    console.log("🔑 Token saved:", token); // ✅ log token here
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    console.log("📦 Retrieved token:", token); // ✅ log token here
    return token;
  }
  return null;
}

export function logout() {
  if (typeof window !== "undefined") {
    console.log("🚪 Logging out, removing token");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
}
