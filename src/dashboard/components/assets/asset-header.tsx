import AddAssetsDialog from "./add-assets-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssetHeaderProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const AssetHeader = ({ sortBy, onSortChange }: AssetHeaderProps) => {
  return (
    <div>
      <div className=" flex justify-between items-center border-b-[1px] border-[#F4F3F7] p-4 mb-4">
        <div className="bg-[#F7F7F8] whitespace-nowrap text-[13.78px] text-[#8C94A6] w-fit h-[37px] rounded-[10px] flex items-center gap-1.5 px-3 border-[1px] border-[#F4F3F7]">
          <img
            src="/icons/filter.svg"
            alt="Filter icon"
            width={16}
            height={16}
          />
          <div className="">Sorted by</div>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className=" border-none shadow-none p-0 text-[13.78px]">
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date added (Newest)</SelectItem>
              <SelectItem value="date-asc">Date added (Oldest)</SelectItem>
              <SelectItem value="worth-desc">Worth (Highest)</SelectItem>
              <SelectItem value="worth-asc">Worth (Lowest)</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="category-asc">Category (A-Z)</SelectItem>
              <SelectItem value="category-desc">Category (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="">
          <AddAssetsDialog />
        </div>
      </div>
    </div>
  );
};

export default AssetHeader;
