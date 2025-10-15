import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import { Loader, Trash2 } from "lucide-react";
import DocsPreview from "./docsPreview";
import { deleteAsset } from "@/lib/api-service";

interface Asset {
  _id: string;
  assetTitle: string;
  assetCategory: string;
  assetLocation: string;
  docs: string;
  verified: string;
  assetWorth: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  media: any;
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
  // fix: ensure we handle asset.media gracefully
  const imageUrl =
    Array.isArray(asset.media) && asset.media[0]?.cloudinaryUrl
      ? asset.media[0].cloudinaryUrl
      : typeof asset.media === "string" && asset.media
      ? asset.media
      : `https://dummyimage.com/600x400/5a1e9f/439eff&text=${encodeURIComponent(
          asset.assetTitle
        )}`;

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

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAsset = async () => {
    if (!asset._id) return;
    setIsDeleting(true);
    try {
      const response = await deleteAsset(asset._id);
      if (response.success) {
        console.log("Delete asset with ID:", asset._id);
        // Optionally: notify parent to refetch assets or close modal
      } else {
        console.error("Failed to delete asset:", response.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full overflow-y-auto scrollbar-hide">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <Card className="border-none shadow-none w-full">
          <CardContent className="p-0 flex justify-between flex-col">
            <img
              src={imageUrl}
              alt={asset.assetTitle}
              width={100}
              height={100}
              className="w-full rounded-[10px] h-[204px] object-cover"
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
              <DocsPreview docs={asset.docs} />
            </div>
            <div className="flex flex-row gap-4 w-full mt-4">
              <Button className="cursor-pointer bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] text-white px-4 py-2 rounded-[10px] flex items-center gap-2 w-[80%]">
                Request Loan
              </Button>
              <Button
                onClick={handleDeleteAsset}
                disabled={isDeleting}
                className="cursor-pointer w-fit bg-[#FF3B30]/30 hover:bg-[#FF3B30]/50 text-[#FF3B30] px-4 py-2 rounded-[10px] flex items-center gap-2 mx-auto justify-center"
              >
                {isDeleting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none w-full h-full">
          <h3 className="text-[15px] font-semibold ">Activity Timeline</h3>
          <div className="relative">
            <Separator
              orientation="vertical"
              className="bg-[#D3D3D3] absolute left-2 h-full"
            />
            {timelineData.map((entry, index) => (
              <div key={index} className="relative mb-4 pl-6">
                <div className="bg-white border border-[#D3D3D3] absolute left-0 top-3.5 size-4 rounded-full" />
                <div className="flex flex-col gap-1">
                  <h4 className="font-medium text-[13px] text-[#1A1A21] capitalize">
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
        </Card>
      </div>
    </div>
  );
};

export { AssetDetailsModal };
