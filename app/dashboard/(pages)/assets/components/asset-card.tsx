"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useDeleteAsset, useUpdateAsset } from "@/lib/hooks/use-react-query";
import { Asset } from "@/lib/api-service";
import { Trash2, Edit, Eye } from "lucide-react";

interface AssetCardProps {
  asset: Asset;
  onEdit?: (asset: Asset) => void;
  onView?: (asset: Asset) => void;
}

const AssetCard = ({ asset, onEdit, onView }: AssetCardProps) => {
  const deleteAsset = useDeleteAsset();
  const updateAsset = useUpdateAsset();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this asset?")) {
      deleteAsset.mutate(asset._id);
    }
  };

  const handleToggleVerification = () => {
    updateAsset.mutate({
      id: asset._id,
      data: {
        verified: asset.verified === "true" ? "false" : "true",
      },
    });
  };

  return (
    <Card className="h-[357px] w-[313px] cursor-pointer rounded-[20px] bg-[#F9F9F9] p-[10px] shadow-none border-none">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Image
            src={asset.image}
            alt={asset.assetTitle}
            width={100}
            height={100}
            className="w-full rounded-[10px] h-[204px] object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onView?.(asset)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit?.(asset)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteAsset.isPending}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between gap-2">
          <span className="text-[#8C94A6] capitalize font-medium text-[12.06px]">
            {asset.assetCategory}
          </span>
          <Badge
            variant={asset.verified === "true" ? "default" : "secondary"}
            className={`text-[10.34px] gap-1 font-medium flex flex-row items-center justify-center text-[#1A1A21] h-[20px] w-[76px] rounded-[4px] ${
              asset.verified === "true" ? "bg-[#D3FED3]" : "bg-[#FCDB86]"
            } bg-opacity-10`}
          >
            {asset.verified === "true" ? "Verified ✅" : "In Review ⏳"}
          </Badge>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-[13.78px] font-semibold">{asset.assetTitle}</h2>
          <p className="text-[13.78px] text-[#1A1A21] font-medium">
            {asset.assetLocation}
          </p>
          <p className="text-[20px] text-[#292D32] font-bold">
            $
            {typeof asset.assetWorth === "number"
              ? asset.assetWorth.toLocaleString()
              : asset.assetWorth}
          </p>
        </div>

        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleToggleVerification}
            disabled={updateAsset.isPending}
            className="flex-1 text-xs"
          >
            {updateAsset.isPending
              ? "Updating..."
              : asset.verified === "true"
              ? "Mark as Pending"
              : "Mark as Verified"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AssetCard;
