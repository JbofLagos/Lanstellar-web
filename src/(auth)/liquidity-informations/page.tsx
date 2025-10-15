"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function LiquidityInformationsPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    organization: "",
    investmentAmount: "",
  });

  const canProceed =
    form.fullName.trim() && form.email.trim() && form.investmentAmount.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed) return;
    navigate("/lp-dashboard");
  };

  return (
    <div className="min-h-screen bg-white font-inter flex flex-col items-center relative">
      <div className="self-start ml-[20px] z-50 mt-[10px] top-0 left-0 absolute">
        <img src="/logo3.svg" height={48} width={174} alt="logo" />
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 px-[40px] py-[32px] bg-[#FCFCFC] border border-[#E4E3EC] border-dashed rounded-[20px] w-[520px] max-w-full"
        >
          <div>
            <h2 className="font-semibold text-[20px]">
              Liquidity provider info
            </h2>
            <p className="text-[#8C94A6] text-[13px] font-medium">
              Tell us a bit about you to personalize your dashboard.
            </p>
          </div>

          <div>
            <Label htmlFor="fullName" className="text-[13px] font-medium">
              Full name
            </Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Your full name"
              className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[13px] rounded-[10px] h-[37px] w-full"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-[13px] font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Your email address"
              className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[13px] rounded-[10px] h-[37px] w-full"
            />
          </div>

          <div>
            <Label htmlFor="organization" className="text-[13px] font-medium">
              Organization (optional)
            </Label>
            <Input
              id="organization"
              value={form.organization}
              onChange={(e) =>
                setForm({ ...form, organization: e.target.value })
              }
              placeholder="Your organization"
              className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[13px] rounded-[10px] h-[37px] w-full"
            />
          </div>

          <div>
            <Label
              htmlFor="investmentAmount"
              className="text-[13px] font-medium"
            >
              Intended deposit amount (USD)
            </Label>
            <Input
              id="investmentAmount"
              type="number"
              value={form.investmentAmount}
              onChange={(e) =>
                setForm({ ...form, investmentAmount: e.target.value })
              }
              placeholder="e.g. 10000"
              className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[13px] rounded-[10px] h-[37px] w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={!canProceed}
            className={`w-full bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] text-white text-[13.78px] py-2 rounded-md font-medium hover:opacity-90 transition-opacity ${
              !canProceed ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Continue to dashboard
          </Button>
        </form>
      </div>
    </div>
  );
}
