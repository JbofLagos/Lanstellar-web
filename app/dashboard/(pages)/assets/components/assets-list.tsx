"use client";
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { AssetDetailsModal } from "./assets-details";
import api from "@/lib/api";

const assets = [
  {
    id: 1,
    category: "Real Estate",
    status: "In Review ⏳",
    statusColor: "#FCDB86",
    image: "/house.jpg",
    title: "One Hyde Park Residences",
    address: "100 Knightsbridge, London SW1X 7LJ, United Kingdom",
    price: "$500,000",
  },
  {
    id: 2,
    category: "Art",
    status: "Verified ✅",
    statusColor: "#D3FED3",
    image: "/house.jpg",
    title: "Mona Lisa Replica",
    address: "Louvre Museum, Paris, France",
    price: "$200,000",
  },
  {
    id: 3,
    category: "Collectibles",
    status: "In Review ⏳",
    statusColor: "#FCDB86",
    image: "/house.jpg",
    title: "Vintage Ferrari 250 GTO",
    address: "Maranello, Italy",
    price: "$50,000,000",
  },
];

const fetchAssets = async () => {
  try {
    const res = await api.get("/assets/");
    console.log("Assets:", res.data);
  } catch (error) {
    console.error("Error fetching assets:", error);
  }
};

const AssetsList = () => {
  useEffect(() => {
    fetchAssets();
  }, []);
  return (
    <div className="p-[26px] flex flex-wrap gap-6">
      {assets.map((asset) => (
        <Dialog key={asset.id}>
          <DialogTrigger asChild>
            <Card className="h-[357px] w-[313px] cursor-pointer rounded-[20px] bg-[#F9F9F9] p-[10px] shadow-none border-none">
              <div className="flex flex-col gap-2">
                <Image
                  src={asset.image}
                  alt={asset.title}
                  width={100}
                  height={100}
                  className="w-full rounded-[10px] h-[204px] object-cover"
                />
                <div className="flex flex-row items-center justify-between gap-2">
                  <span className="text-[#8C94A6] font-medium text-[12.06px]">
                    {asset.category}
                  </span>
                  <span
                    className="text-[10.34px] gap-1 font-medium flex flex-row items-center justify-center text-[#1A1A21] h-[20px] w-[76px] rounded-[4px]"
                    style={{ backgroundColor: asset.statusColor }}
                  >
                    {asset.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[13.78px] font-semibold">
                    {asset.title}
                  </h2>
                  <p className="text-[13.78px] text-[#1A1A21] font-medium">
                    {asset.address}
                  </p>
                  <p className="text-[20px] text-[#292D32] font-bold">
                    {asset.price}
                  </p>
                </div>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-[120vw]  w-full h-[90vh] scrollbar-hide overflow-y-auto">
            <AssetDetailsModal />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default AssetsList;
