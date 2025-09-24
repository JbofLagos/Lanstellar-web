"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useState } from "react";
import api from "@/lib/api";
import { saveToken } from "@/lib/auth";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading] = useState(false);
  const [error] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      saveToken(res.data.data.token); // save token
      window.location.href = "/dashboard"; // redirect to dashboard
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="h-screen bg-[url('/heropatern.svg')] font-inter justify-center relative items-center flex flex-col bg-white  bg-center bg-cover">
      <div className=" self-start ml-[20px] z-50 mt-[10px] top-0 left-0 absolute">
        <Image src={"/logo3.svg"} height={48} width={174} alt="logo" />
      </div>
      <div className=" flex justify-center items-center">
        <div className=" space-y-5 flex justify-center  flex-col p-[30px] bg-[#FCFCFC] border border-[#E4E3EC] border-dashed rounded-[20px] h-[469px] w-[543px] ">
          <div>
            <h2 className=" font-inter font-semibold text-[20px] ">
              Welcome back <span className=" text-[#FEB00D]">;)</span>
            </h2>
            <p className=" text-[#8C94A6] text-[13.78px] font-medium ">
              Enter your email below to login to your account
            </p>
          </div>
          <form className="flex flex-col gap-4 mt-4" onSubmit={handleLogin}>
            <div className=" flex flex-col gap-1 ">
              <Label className="text-[#1A1A21] text-[13.78px] font-medium">
                Email
              </Label>
              <Input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#F5F5F5] border border-[#F1F1F1] focus:outline-none rounded-[10px] text-[#1A1A1A] placeholder:text-[#CBCBCB] shadow-none p-3 h-12 outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#1A1A21] text-[13.78px] font-medium">
                Password
              </label>
              <div className="flex relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#F5F5F5] border border-[#F1F1F1] text-sm rounded-[10px] text-[#1A1A21] placeholder:text-[#CBCBCB] shadow-none p-3 h-12 w-full outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2  border border-[#F4F3F7] bg-[#FFFFFF] rounded-[10px] text-[#CBCBCB] shadow-none text-sm px-2 transition-colors"
                >
                  {showPassword ? "hide" : "show"}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] text-white py-2 rounded-md text-[16px] font-medium hover:opacity-90 transition-opacity mt-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
            <hr className=" border-t border-t-[#CBCBCB]/70" />
            <p className="text-center text-[#8C94A6] text-[13.78px] font-medium">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-[#439EFF]">
                Sign Up{" "}
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
