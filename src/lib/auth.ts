// lib/auth.ts

import api from "./api";

export async function getCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data;
}

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// Helper function to set cookie
function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// Helper function to remove cookie
function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    setCookie("token", token);
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    // Check localStorage first, then cookie
    const token = localStorage.getItem("token") || getCookie("token");
    return token;
  }
  return null;
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    removeCookie("token");
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    clearToken();
    window.location.href = "/login";
  }
}
