import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
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
import { useDeleteAsset } from "@/hook/useAssets";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import RequestLoanDialog from "../loans/request-loan-dialog";

interface AssetDetailsModalProps {
  asset: Asset;
}

const AssetDetailsModal = ({ asset }: AssetDetailsModalProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRequestLoanDialog, setShowRequestLoanDialog] = useState(false);
  const { deleteAssetMutation, loading: isDeleting } = useDeleteAsset();

  // Helper function to check if asset is verified (handles both boolean and string)
  const isVerified =
    asset.verified === true || String(asset.verified) === "true";

  // Check if loan has already been requested
  const hasLoanRequested = asset.loanStatus === true;

  // Get all images from the asset
  const images =
    Array.isArray(asset.media) && asset.media.length > 0
      ? asset.media.map((m) => m.cloudinaryUrl)
      : [
          `https://dummyimage.com/600x400/5a1e9f/ffffff&text=${encodeURIComponent(
            asset.assetTitle
          )}`,
        ];

  const handleDeleteAsset = async () => {
    if (!asset._id) return;
    await deleteAssetMutation(asset._id);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full overflow-y-auto scrollbar-hide">
      <div className="w-full flex flex-col md:flex-row gap-6">
        {/* Left Column - Images */}
        <div className="w-full">
          {/* Image Gallery */}
          <Card className="border border-[#E4E3EC] overflow-hidden rounded-[12px] py-0">
            <CardContent className="p-0">
              {/* Main Image Display */}
              <div className="relative group">
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
        </div>

        {/* Right Column - Asset Details */}
        <div className="w-full space-y-4">
          {/* Asset Info Card */}
          <Card className="border border-[#E4E3EC] rounded-[12px]">
            <CardContent>
              <div className="space-y-4">
                {/* Header with Category and Status */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Badge className="bg-[#F4F3F7] text-[#8C94A6] capitalize text-[12px] font-medium hover:bg-[#F4F3F7] px-3 py-1">
                    {asset.assetCategory.replace("-", " ")}
                  </Badge>
                  <Badge
                    className={`text-[11px] gap-1 font-medium ${
                      isVerified
                        ? "bg-[#D3FED3] text-green-700 hover:bg-[#D3FED3]"
                        : "bg-[#FCDB86] text-orange-700 hover:bg-[#FCDB86]"
                    }`}
                  >
                    {isVerified ? "✅ Verified" : "⏳ In Review"}
                  </Badge>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-[20px] font-bold text-[#1A1A21] capitalize">
                    {asset.assetTitle}
                  </h2>
                </div>

                <Separator className="bg-[#E4E3EC]" />

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <p className="text-[20px] text-[#292D32] font-bold">
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
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => setShowRequestLoanDialog(true)}
                    disabled={!isVerified || hasLoanRequested}
                    className={`w-full px-6 py-3 rounded-[10px] flex items-center justify-center gap-2 font-medium ${
                      hasLoanRequested
                        ? "cursor-not-allowed bg-green-50 text-green-600 border border-green-200"
                        : isVerified
                        ? "cursor-pointer bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] hover:from-[#439EFF]/90 hover:to-[#5B1E9F]/90 text-white"
                        : "cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    {hasLoanRequested
                      ? "Loan Requested"
                      : isVerified
                      ? "Request Loan"
                      : "Asset Not Verified"}
                  </Button>
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={isDeleting || hasLoanRequested}
                    className="w-full cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-6 py-3 rounded-[10px] flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    {hasLoanRequested
                      ? "Cannot Delete - Loan Active"
                      : "Delete Asset"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteAsset}
        title="Delete Asset"
        description="Are you sure you want to delete this asset? This action cannot be undone and all associated data will be permanently removed."
        itemName={asset.assetTitle}
        isDeleting={isDeleting}
      />

      {/* Request Loan Dialog */}
      <RequestLoanDialog
        open={showRequestLoanDialog}
        onOpenChange={setShowRequestLoanDialog}
        preSelectedAssetId={asset._id}
        onSuccess={() => {
          setShowRequestLoanDialog(false);
        }}
      />
    </div>
  );
};

export { AssetDetailsModal };
