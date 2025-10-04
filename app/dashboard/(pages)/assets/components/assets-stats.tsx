"use client";
import React from "react";
import { useAssets } from "@/lib/hooks/use-react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AssetsStats = () => {
  // Fetch data from your hook
  const { data: rawData, isLoading, error } = useAssets();

  // Ensure `assets` is always an array
  const assets = Array.isArray(rawData)
    ? rawData
    : rawData?.assets || rawData?.data || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Failed to load asset statistics</p>
      </div>
    );
  }

  // Debug (optional)
  console.log("Assets Data:", assets);

  // Guard clause — if still not array, show fallback
  if (!Array.isArray(assets)) {
    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-600">
          Assets data is not in array format. Please check API response.
        </p>
      </div>
    );
  }

  // Compute total worth
  const totalWorth = assets.reduce((sum, asset) => {
    const worth =
      typeof asset.assetWorth === "number"
        ? asset.assetWorth
        : parseFloat(asset.assetWorth?.toString() || "0");
    return sum + worth;
  }, 0);

  // Verification stats
  const verifiedAssets = assets.filter(
    (asset) => asset.verified === "true"
  ).length;
  const pendingAssets = assets.length - verifiedAssets;

  // Category distribution
  const categories = assets.reduce((acc, asset) => {
    acc[asset.assetCategory] = (acc[asset.assetCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categories).reduce(
    (a, b) => (a[1] > b[1] ? a : b),
    ["", 0]
  );

  // UI Display
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Assets */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalWorth.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500">
            {assets.length} asset{assets.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* Verification */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {verifiedAssets}
          </div>
          <p className="text-xs text-gray-500">
            {pendingAssets} pending verification
          </p>
        </CardContent>
      </Card>

      {/* Top Category */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Top Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {topCategory[0] || "N/A"}
          </div>
          <p className="text-xs text-gray-500">
            {topCategory[1]} asset{topCategory[1] !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetsStats;
