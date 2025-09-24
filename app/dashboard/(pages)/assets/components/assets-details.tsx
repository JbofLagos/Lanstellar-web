"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type TimelineEntry = {
  date: string;
  title: string;
  content: string;
};

const timelineData: TimelineEntry[] = [
  {
    date: "June 16, 2025 – 09:40",
    title: "One Hyde Park added to system",
    content: "Asset Created: Company Admin",
  },
  {
    date: "June 16, 2025 – 10:42",
    title: "Asset Valued: $6.7M — Docs Verified",
    content: "AI Verification Completed: Agent",
  },
  {
    date: "June 17, 2025 – 13:15",
    title: "Offer: $1M at 9% APY over 12 months",
    content: "Pending Response: Lender",
  },
  {
    date: "June 17, 2025 – 13:35",
    title: "Accepted $1M offer with 9% APY",
    content: "Offer Accepted: Company Admin",
  },
  {
    date: "June 17, 2025 – 14:20",
    title: "Asset locked as collateral",
    content: "Asset Locked: System",
  },
];

const AssetDetailsModal = () => {
  return (
    <div className=" w-full overflow-y-auto scrollbar-hide">
      <h2 className="text-[20px] font-semibold  ">ASD-10011</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-none shadow-none w-full">
          <CardContent className="p-0 flex justify-between flex-col">
            <Image
              src="/house.jpg"
              alt="Asset"
              width={600}
              height={400}
              className="rounded-xl"
            />
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex flex-row items-center justify-between gap-2">
                <span className="text-[#8C94A6] font-medium text-[12.06px]">
                  Real Estate
                </span>
                <span className="text-[10.34px] gap-1 font-medium bg-[#D3FED3] flex flex-row items-center justify-center text-[#1A1A21] h-[20px] w-[76px] rounded-[4px]">
                  Verified ✅
                </span>
              </div>
              <p className="text-[16px] font-medium text-[#1A1A21]">
                One Hyde Park Residences
              </p>
              <p className="text-[13.78px] text-[#1A1A21] font-medium">
                100 Knightsbridge, London SW1X 7LJ, United Kingdom
              </p>
              <p className="mt-2 text-[20px] text-[#292D32] font-bold">
                $500,000
              </p>
              <p className=" flex items-center gap-1 text-[13px] text-[#292D32] bg-[#F7F7F8] rounded-[4px] p-[4px] font-medium">
                <Image
                  src="/icons/document.svg"
                  alt="Document"
                  width={16}
                  height={16}
                  className="text-[#292D32]"
                />
                Preview asset documents
              </p>
            </div>
            <Button className="mt-26  cursor-pointer bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] text-white px-4 py-2 rounded-[10px] flex items-center gap-2 w-full">
              Request Loan
            </Button>
          </CardContent>
        </Card>

        <div className="relative">
          <h3 className="text-[15px] font-semibold  ">Activity Timeline</h3>
          <Separator
            orientation="vertical"
            className="bg-[#D3D3D3] absolute left-2 top-4 h-full"
          />
          {timelineData.map((entry, index) => (
            <div key={index} className="relative mb-4 pl-6">
              <div className="bg-white border border-[#D3D3D3] absolute left-0 top-3.5 size-4 rounded-full" />
              <div className=" flex ">
                <h4 className="font-medium text-[13px] text-[#1A1A21]">
                  {entry.title}
                </h4>
                <span className="text-[12px] font-medium text-[#8C94A6]">
                  {entry.date}
                </span>
              </div>
              <p className="text-sm text-[#8C94A6]">{entry.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { AssetDetailsModal };
