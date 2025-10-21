import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader,
  Trash2,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DocsPreview from "./docsPreview";
import { type Asset } from "@/lib/api-service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteAsset } from "@/lib/api-service";

type TimelineEntry = {
  date: string;
  title: string;
  content: string;
};

interface AssetDetailsModalProps {
  asset: Asset;
}

const AssetDetailsModal = ({ asset }: AssetDetailsModalProps) => {
  const queryClient = useQueryClient();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get all images from the asset
  const images =
    Array.isArray(asset.media) && asset.media.length > 0
      ? asset.media.map((m) => m.cloudinaryUrl)
      : [
          `https://dummyimage.com/600x400/5a1e9f/ffffff&text=${encodeURIComponent(
            asset.assetTitle
          )}`,
        ];

  const timelineData: TimelineEntry[] = [
    {
      date: asset.createdAt
        ? new Date(asset.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Recently",
      title: `${asset.assetTitle} added to system`,
      content: "Asset Created: Company Admin",
    },
    {
      date: asset.createdAt
        ? new Date(asset.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Recently",
      title: `Asset Valued: $${
        typeof asset.assetWorth === "number"
          ? asset.assetWorth.toLocaleString()
          : parseFloat(String(asset.assetWorth) || "0").toLocaleString()
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

  const handleDeleteAsset = async () => {
    if (!asset._id) return;

    if (
      !confirm(
        "Are you sure you want to delete this asset? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteAsset(asset._id);
      if (response.success) {
        toast.success("Asset deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["assets"] });
        // Close the dialog by clicking outside or implement close callback
        window.location.reload(); // Temporary solution
      } else {
        toast.error(response.message || "Failed to delete asset");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting the asset");
    } finally {
      setIsDeleting(false);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full overflow-y-auto scrollbar-hide">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Images and Main Info */}
        <div className="space-y-4">
          {/* Image Gallery */}
          <Card className="border border-[#E4E3EC] shadow-sm overflow-hidden rounded-[16px]">
            <CardContent className="p-0">
              {/* Main Image Display */}
              <div className="relative bg-gradient-to-br from-[#F8F9FF] to-[#FFF8F0] group">
                <img
                  src={images[selectedImageIndex]}
                  alt={`${asset.assetTitle} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-[400px] object-cover"
                />

                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <Button
                      onClick={previousImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[12px] px-3 py-1 rounded-full">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="p-4 bg-white border-t border-[#E4E3EC]">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          index === selectedImageIndex
                            ? "border-[#563BB5] ring-2 ring-[#563BB5]/30"
                            : "border-transparent hover:border-[#E4E3EC]"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-20 h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Asset Info Card */}
          <Card className="border border-[#E4E3EC] shadow-sm rounded-[16px]">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header with Category and Status */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Badge className="bg-[#F4F3F7] text-[#8C94A6] capitalize text-[12px] font-medium hover:bg-[#F4F3F7] px-3 py-1">
                    {asset.assetCategory.replace("-", " ")}
                  </Badge>
                  <Badge
                    className={`text-[11px] gap-1 font-medium ${
                      asset.verified === "true"
                        ? "bg-[#D3FED3] text-green-700 hover:bg-[#D3FED3]"
                        : "bg-[#FCDB86] text-orange-700 hover:bg-[#FCDB86]"
                    }`}
                  >
                    {asset.verified === "true" ? "✅ Verified" : "⏳ In Review"}
                  </Badge>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-[24px] font-bold text-[#1A1A21] capitalize">
                    {asset.assetTitle}
                  </h2>
                </div>

                <Separator className="bg-[#E4E3EC]" />

                {/* Details Grid */}
                <div className="grid gap-4">
                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#F4F3F7] rounded-lg">
                      <MapPin className="w-4 h-4 text-[#8C94A6]" />
                    </div>
                    <div>
                      <p className="text-[12px] text-[#8C94A6] font-medium">
                        Location
                      </p>
                      <p className="text-[14px] text-[#1A1A21] font-semibold">
                        {asset.assetLocation}
                      </p>
                    </div>
                  </div>

                  {/* Worth */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-[#439EFF]/10 to-[#5B1E9F]/10 rounded-lg">
                      <DollarSign className="w-4 h-4 text-[#563BB5]" />
                    </div>
                    <div>
                      <p className="text-[12px] text-[#8C94A6] font-medium">
                        Asset Worth
                      </p>
                      <p className="text-[24px] text-[#292D32] font-bold">
                        $
                        {typeof asset.assetWorth === "number"
                          ? asset.assetWorth.toLocaleString()
                          : parseFloat(
                              String(asset.assetWorth) || "0"
                            ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  {asset.createdAt && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#F4F3F7] rounded-lg">
                        <Calendar className="w-4 h-4 text-[#8C94A6]" />
                      </div>
                      <div>
                        <p className="text-[12px] text-[#8C94A6] font-medium">
                          Added On
                        </p>
                        <p className="text-[14px] text-[#1A1A21] font-semibold">
                          {new Date(asset.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {asset.assetDescription && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#F4F3F7] rounded-lg">
                        <FileText className="w-4 h-4 text-[#8C94A6]" />
                      </div>
                      <div>
                        <p className="text-[12px] text-[#8C94A6] font-medium">
                          Description
                        </p>
                        <p className="text-[13px] text-[#49576D] leading-relaxed mt-1">
                          {asset.assetDescription}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Documents */}
                {asset.docs && (
                  <div className="mt-4">
                    <DocsPreview docs={asset.docs} />
                  </div>
                )}

                <Separator className="bg-[#E4E3EC]" />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 cursor-pointer bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] hover:from-[#439EFF]/90 hover:to-[#5B1E9F]/90 text-white px-6 py-3 rounded-[10px] flex items-center justify-center gap-2 font-medium">
                    <DollarSign className="w-4 h-4" />
                    Request Loan
                  </Button>
                  <Button
                    onClick={handleDeleteAsset}
                    disabled={isDeleting}
                    className="cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-6 py-3 rounded-[10px] flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline */}
        <Card className="border border-[#E4E3EC] shadow-sm rounded-[16px] h-full">
          <CardContent className="p-6">
            <h3 className="text-[18px] font-semibold text-[#1A1A21] mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#439EFF] to-[#5B1E9F] rounded-full"></div>
              Activity Timeline
            </h3>
            <div className="relative">
              <Separator
                orientation="vertical"
                className="bg-[#E4E3EC] absolute left-2 h-full w-[2px]"
              />
              {timelineData.map((entry, index) => (
                <div key={index} className="relative mb-6 pl-8 last:mb-0">
                  <div className="bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] absolute left-0 top-0 size-5 rounded-full border-4 border-white" />
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-[14px] text-[#1A1A21]">
                      {entry.title}
                    </h4>
                    <span className="text-[12px] font-medium text-[#8C94A6] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.date}
                    </span>
                    <p className="text-[13px] text-[#49576D] bg-[#F8F9FF] px-3 py-2 rounded-lg">
                      {entry.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { AssetDetailsModal };
