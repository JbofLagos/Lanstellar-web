"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Asset {
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

type TimelineEntry = {
  date: string;
  title: string;
  content: string;
};

interface AssetDetailsModalProps {
  asset: Asset;
}

const AssetDetailsModal = ({ asset }: AssetDetailsModalProps) => {
  // Generate timeline data based on asset creation and status
  const timelineData: TimelineEntry[] = [
    {
      date: asset.createdAt
        ? new Date(asset.createdAt).toLocaleString()
        : "Recently",
      title: `${asset.assetTitle} added to system`,
      content: "Asset Created: Company Admin",
    },
    {
      date: asset.createdAt
        ? new Date(asset.createdAt).toLocaleString()
        : "Recently",
      title: `Asset Valued: $${
        typeof asset.assetWorth === "number"
          ? asset.assetWorth.toLocaleString()
          : asset.assetWorth
      } — ${asset.verified === "true" ? "Docs Verified" : "Docs Pending"}`,
      content:
        asset.verified === "true"
          ? "AI Verification Completed: Agent"
          : "Verification Pending: Agent",
    },
    ...(asset.verified === "true"
      ? [
          {
            date: "Recently",
            title: "Asset ready for loan requests",
            content: "Asset Available: System",
          },
        ]
      : []),
  ];
  return (
    <div className=" w-full overflow-y-auto scrollbar-hide">
      <h2 className="text-[20px] font-semibold">Asset ID: {asset._id}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-none shadow-none w-full">
          <CardContent className="p-0 flex justify-between flex-col">
            <Image
              src={asset.image}
              alt={asset.assetTitle}
              width={600}
              height={400}
              className="rounded-xl object-cover"
            />
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex flex-row items-center justify-between gap-2">
                <span className="text-[#8C94A6] font-medium text-[12.06px] capitalize">
                  {asset.assetCategory}
                </span>
                <span
                  className={`text-[10.34px] gap-1 font-medium flex flex-row items-center justify-center text-[#1A1A21] h-[20px] w-[76px] rounded-[4px] ${
                    asset.verified === "true" ? "bg-[#D3FED3]" : "bg-[#FCDB86]"
                  } bg-opacity-10`}
                >
                  {asset.verified === "true" ? "Verified ✅" : "In Review ⏳"}
                </span>
              </div>
              <p className="text-[16px] font-medium text-[#1A1A21]">
                {asset.assetTitle}
              </p>
              <p className="text-[13.78px] text-[#1A1A21] font-medium">
                {asset.assetLocation}
              </p>
              {asset.assetDescription && (
                <p className="text-[12px] text-[#8C94A6] font-medium">
                  {asset.assetDescription}
                </p>
              )}
              <p className="mt-2 text-[20px] text-[#292D32] font-bold">
                $
                {typeof asset.assetWorth === "number"
                  ? asset.assetWorth.toLocaleString()
                  : asset.assetWorth}
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
            <Button className="mt-26 cursor-pointer bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] text-white px-4 py-2 rounded-[10px] flex items-center gap-2 w-full">
              Request Loan
            </Button>
          </CardContent>
        </Card>

        <div className="relative">
          <h3 className="text-[15px] font-semibold">Activity Timeline</h3>
          <Separator
            orientation="vertical"
            className="bg-[#D3D3D3] absolute left-2 top-4 h-full"
          />
          {timelineData.map((entry, index) => (
            <div key={index} className="relative mb-4 pl-6">
              <div className="bg-white border border-[#D3D3D3] absolute left-0 top-3.5 size-4 rounded-full" />
              <div className="flex flex-col gap-1">
                <h4 className="font-medium text-[13px] text-[#1A1A21]">
                  {entry.title}
                </h4>
                <span className="text-[12px] font-medium text-[#8C94A6]">
                  {entry.date}
                </span>
              </div>
              <p className="text-sm text-[#8C94A6] mt-1">{entry.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { AssetDetailsModal };
