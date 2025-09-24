"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useState } from "react";
import api from "@/lib/api"; // axios instance
import { useRouter } from "next/navigation";
import axios from "axios";

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as typeof prev));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        fullName: form.name,
        email: form.email,
        password: form.password,
        userType: form.userType,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Registration failed:", err);
      if (axios.isAxiosError(err)) {
        const message = (err.response?.data as { message?: string } | undefined)
          ?.message;
        setError(message ?? "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[url('/heropatern.svg')] font-inter justify-center relative items-center flex flex-col bg-white bg-center bg-cover">
      <div className="self-start ml-[20px] z-50 mt-[10px] top-0 left-0 absolute">
        <Image src={"/logo3.svg"} height={48} width={174} alt="logo" />
      </div>
      <div className="flex justify-center items-center">
        <div className="space-y-5 flex justify-center flex-col p-[30px] bg-[#FCFCFC] border border-[#E4E3EC] border-dashed rounded-[20px] min-h-[520px] w-[543px]">
          <div>
            <h2 className="font-inter font-semibold text-[20px]">
              Create an Account 🚀
            </h2>
            <p className="text-[#8C94A6] text-[13.78px] font-medium">
              Fill in your details to get started
            </p>
          </div>
          <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <Label className="text-[#1A1A21] text-[13.78px] font-medium">
                Full Name
              </Label>
              <Input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="bg-[#F5F5F5] border border-[#F1F1F1] rounded-[10px] text-[#1A1A1A] placeholder:text-[#CBCBCB] shadow-none p-3 h-12 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-[#1A1A21] text-[13.78px] font-medium">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="bg-[#F5F5F5] border border-[#F1F1F1] rounded-[10px] text-[#1A1A1A] placeholder:text-[#CBCBCB] shadow-none p-3 h-12 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-[#1A1A21] text-[13.78px] font-medium">
                User Type
              </Label>
              <select
                name="userType"
                value={form.userType}
                onChange={handleChange}
                required
                className="bg-[#F5F5F5] border border-[#F1F1F1] rounded-[10px] text-[#1A1A1A] shadow-none p-3 h-12 outline-none"
              >
                <option value="">Select a type</option>
                <option value="borrower">Borrower</option>
                <option value="lender">Lender</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-[#1A1A21] text-[13.78px] font-medium">
                Password
              </Label>
              <div className="flex relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="bg-[#F5F5F5] border border-[#F1F1F1] text-sm rounded-[10px] text-[#1A1A21] placeholder:text-[#CBCBCB] p-3 h-12 w-full outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 border border-[#F4F3F7] bg-[#FFFFFF] rounded-[10px] text-[#CBCBCB] text-sm px-2"
                >
                  {showPassword ? "hide" : "show"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-[#1A1A21] text-[13.78px] font-medium">
                Confirm Password
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                className="bg-[#F5F5F5] border border-[#F1F1F1] rounded-[10px] text-[#1A1A1A] placeholder:text-[#CBCBCB] p-3 h-12 outline-none"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] text-white py-2 rounded-md text-[16px] font-medium hover:opacity-90 transition-opacity mt-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
            <hr className="border-t border-t-[#CBCBCB]/70" />
            <p className="text-center text-[#8C94A6] text-[13.78px] font-medium">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-[#5B1E9F] cursor-pointer"
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
