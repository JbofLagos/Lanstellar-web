import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AssetDetailsModal } from "./assets-details";
import AddAssetsDialog from "./add-assets-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useAssets } from "@/hook/useAssets";
import { MapPin } from "lucide-react";

interface AssetsListProps {
  sortBy: string;
}

const AssetsList = ({ sortBy }: AssetsListProps) => {
  const { assets, isLoadingAssets, error, refetch } = useAssets();
  console.log("Assets loaded:", assets);

  const sortedAssets = useMemo(() => {
    if (isLoadingAssets || !assets || !Array.isArray(assets)) return [];

    const sorted = [...assets];

    switch (sortBy) {
      case "date-desc":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        );
      case "date-asc":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt || "").getTime() -
            new Date(b.createdAt || "").getTime()
        );
      case "worth-desc":
        return sorted.sort((a, b) => {
          const worthA =
            typeof a.assetWorth === "number"
              ? a.assetWorth
              : parseFloat(String(a.assetWorth)) || 0;
          const worthB =
            typeof b.assetWorth === "number"
              ? b.assetWorth
              : parseFloat(String(b.assetWorth)) || 0;
          return worthB - worthA;
        });
      case "worth-asc":
        return sorted.sort((a, b) => {
          const worthA =
            typeof a.assetWorth === "number"
              ? a.assetWorth
              : parseFloat(String(a.assetWorth)) || 0;
          const worthB =
            typeof b.assetWorth === "number"
              ? b.assetWorth
              : parseFloat(String(b.assetWorth)) || 0;
          return worthA - worthB;
        });
      case "title-asc":
        return sorted.sort((a, b) => a.assetTitle.localeCompare(b.assetTitle));
      case "title-desc":
        return sorted.sort((a, b) => b.assetTitle.localeCompare(a.assetTitle));
      case "category-asc":
        return sorted.sort((a, b) =>
          a.assetCategory.localeCompare(b.assetCategory)
        );
      case "category-desc":
        return sorted.sort((a, b) =>
          b.assetCategory.localeCompare(a.assetCategory)
        );
      default:
        return sorted;
    }
  }, [assets, sortBy, isLoadingAssets]);

  if (isLoadingAssets) {
    return (
      <div className="p-[26px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#439EFF] mx-auto mb-4"></div>
          <p className="text-[#8C94A6]">Loading assets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-[26px] flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-red-500 mb-2">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-[14px] font-medium">Failed to load assets</p>
            <p className="text-[12px] text-[#8C94A6] mt-1">
              {typeof error === "string"
                ? error
                : (error as Error)?.message || "Unknown error"}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(assets)) {
    return (
      <div className="p-[26px] text-center text-yellow-600 min-h-[400px] flex items-center justify-center">
        <div>
          <p className="text-[14px] font-medium">Invalid data format</p>
          <p className="text-[12px] text-[#8C94A6] mt-1">
            Please check API response.
          </p>
        </div>
      </div>
    );
  }

  if (sortedAssets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-[70vh]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="w-[215px] h-[142.01px] bg-white"
            >
              <img
                src="/empty.svg"
                alt="Empty"
                width={215}
                height={142}
                className="w-[215px] h-[142.01px]"
              />
            </EmptyMedia>
            <EmptyTitle>Assets</EmptyTitle>
            <EmptyDescription className="text-[13.78px] text-[#8C94A6] font-medium">
              You haven’t added any asset! Add one and get started.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <AddAssetsDialog />
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="p-[26px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {sortedAssets.map((asset) => (
        <Dialog key={asset._id}>
          <DialogTrigger asChild>
            <Card className="group w-full mx-auto cursor-pointer rounded-[12px] bg-white border border-[#E4E3EC] hover:border-[#563BB5] p-[10px] shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col gap-2">
                <div className="relative overflow-hidden rounded-[10px]">
                  <img
                    src={
                      asset.media?.[0]?.cloudinaryUrl ||
                      `https://dummyimage.com/600x400/5a1e9f/ffffff&text=${encodeURIComponent(
                        asset.assetTitle
                      )}`
                    }
                    alt={asset.assetTitle}
                    className="w-full rounded-[6px] h-[240px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {asset.media && asset.media.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full">
                      +{asset.media.length - 1} more
                    </div>
                  )}
                </div>

                <div className="flex flex-row items-center justify-between gap-2 mt-2">
                  <span className="text-[#8C94A6] capitalize font-medium text-[12px] bg-[#F4F3F7] px-2 py-1 rounded-md">
                    {asset.assetCategory.replace("-", " ")}
                  </span>
                  <span
                    className={`text-[10px] gap-1 font-medium flex flex-row items-center justify-center text-[#1A1A21] h-[20px] px-2 rounded-[6px] ${
                      asset.verified === true ||
                      String(asset.verified) === "true"
                        ? "bg-[#D3FED3] text-green-700"
                        : "bg-[#FCDB86] text-orange-700"
                    }`}
                  >
                    {asset.verified === true ||
                    String(asset.verified) === "true"
                      ? "Verified ✅"
                      : "In Review ⏳"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[14px] capitalize font-semibold text-[#1A1A21] line-clamp-1">
                    {asset.assetTitle}
                  </h2>
                  <p className="text-[13px] text-[#8C94A6] font-medium flex items-center gap-1.5">
                    <div className="">
                      <MapPin size={20} />
                    </div>
                    {asset.assetLocation}
                  </p>
                  <p className="text-[22px] text-[#292D32] font-bold mt-1">
                    $
                    {(() => {
                      const worth =
                        typeof asset.assetWorth === "number"
                          ? asset.assetWorth
                          : parseFloat(String(asset.assetWorth)) || 0;
                      return worth.toLocaleString();
                    })()}
                  </p>
                </div>
              </div>
            </Card>
          </DialogTrigger>

          <DialogContent className="!max-w-5xl w-full p-4 scrollbar-hide border-[#E4E3EC]">
            <AssetDetailsModal asset={asset} />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default AssetsList;
