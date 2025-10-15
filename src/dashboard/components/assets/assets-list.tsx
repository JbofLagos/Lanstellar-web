import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { AssetDetailsModal } from "./assets-details";
import { DialogTitle } from "@radix-ui/react-dialog";
import { getAssets } from "@/lib/api-service";
import AddAssetsDialog from "./add-assets-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface Asset {
  _id: string;
  media: { cloudinaryUrl: string }[];
  assetTitle: string;
  assetCategory: string;
  verified: string;
  assetLocation: string;
  assetWorth: string;
  createdAt: string;
  status: string;
  statusColor: string;
  docs: string;
}

interface AssetsListProps {
  sortBy: string;
}

const AssetsList = ({ sortBy }: AssetsListProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAssets();
        let assetsArr: Asset[] = [];
        if (Array.isArray(response)) {
          assetsArr = response;
        } else if (
          response &&
          typeof response === "object" &&
          Array.isArray(response.data)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          assetsArr = response.data.map((item: any) => ({
            ...item,
            assetWorth: String(item.assetWorth),
          }));
        }
        setAssets(assetsArr);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const sortedAssets = useMemo(() => {
    if (!Array.isArray(assets)) return [];
    const sorted = [...assets];
    switch (sortBy) {
      case "date-desc":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "date-asc":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "worth-desc":
        return sorted.sort(
          (a, b) =>
            (parseFloat(b.assetWorth) || 0) - (parseFloat(a.assetWorth) || 0)
        );
      case "worth-asc":
        return sorted.sort(
          (a, b) =>
            (parseFloat(a.assetWorth) || 0) - (parseFloat(b.assetWorth) || 0)
        );
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
  }, [assets, sortBy]);

  if (isLoading) {
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
      <div className="p-[26px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Failed to load assets:{" "}
            {typeof error === "string"
              ? error
              : (error as Error)?.message || "Unknown error"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#439EFF] text-white rounded-lg hover:bg-[#3B82F6]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(assets)) {
    return (
      <div className="p-[26px] text-center text-yellow-600">
        Invalid asset data format. Please check API response.
      </div>
    );
  }

  if (sortedAssets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-screen">
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
    <div className="p-[26px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-6">
      {sortedAssets.map((asset) => (
        <Dialog key={asset._id}>
          <DialogTrigger asChild>
            <Card className="h-[357px] mx-auto w-[313px] cursor-pointer rounded-[20px] bg-[#F9F9F9] p-[10px] shadow-none border-none">
              <div className="flex flex-col gap-2">
                <img
                  src={
                    asset.media[0]?.cloudinaryUrl ||
                    `https://dummyimage.com/600x400/5a1e9f/439eff&text=${asset.assetTitle}`
                  }
                  alt={asset.assetTitle}
                  width={100}
                  height={100}
                  className="w-full rounded-[10px] h-[204px] object-cover"
                />

                <div className="flex flex-row items-center justify-between gap-2">
                  <span className="text-[#8C94A6] capitalize font-medium text-[12.06px]">
                    {asset.assetCategory}
                  </span>
                  <span
                    className={`text-[10.34px] gap-1 font-medium flex flex-row items-center justify-center text-[#1A1A21] h-[20px] w-[76px] rounded-[4px] ${
                      asset.verified === "true"
                        ? "bg-[#D3FED3]"
                        : "bg-[#FCDB86]"
                    } bg-opacity-10`}
                  >
                    {asset.verified === "true" ? "Verified ✅" : "In Review ⏳"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[13.78px] capitalize font-semibold">
                    {asset.assetTitle}
                  </h2>
                  <p className="text-[13.78px] text-[#1A1A21] font-medium">
                    {asset.assetLocation}
                  </p>
                  <p className="text-[20px] text-[#292D32] font-bold">
                    ${parseFloat(asset.assetWorth).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </DialogTrigger>

          <DialogContent className="!max-w-[90vw] w-[75vw] h-[90vh] scrollbar-hide overflow-y-auto">
            <DialogTitle className=" p-0"></DialogTitle>
            <AssetDetailsModal asset={asset} />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default AssetsList;
