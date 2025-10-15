import { useState } from "react";
import AssetHeader from "../components/assets/asset-header";
import AssetsList from "../components/assets/assets-list";

const AssetsPage = () => {
  const [sortBy, setSortBy] = useState("date-desc");

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="">
      <AssetHeader sortBy={sortBy} onSortChange={handleSortChange} />

      <div className="">
        <AssetsList sortBy={sortBy} />
      </div>
    </div>
  );
};

export default AssetsPage;
