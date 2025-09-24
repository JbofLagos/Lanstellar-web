"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";

interface AssetForm {
  assetTitle: string;
  assetCategory: string;
  assetWorth: string;
  assetLocation: string;
  assetDescription: string;
}

const AddAssetsDialog = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AssetForm>({
    assetTitle: "",
    assetCategory: "",
    assetWorth: "",
    assetLocation: "",
    assetDescription: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      if (
        !["image/png", "image/jpeg", "image/jpg"].includes(selectedFile.type)
      ) {
        toast.error("We only support PNGs and JPEGs");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const resetForm = () => {
    setFormData({
      assetTitle: "",
      assetCategory: "",
      assetWorth: "",
      assetLocation: "",
      assetDescription: "",
    });
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!formData.assetTitle.trim()) {
      toast.error("Asset title is required");
      return;
    }
    if (!formData.assetCategory) {
      toast.error("Asset category is required");
      return;
    }
    if (!formData.assetWorth.trim()) {
      toast.error("Asset worth is required");
      return;
    }
    if (!formData.assetLocation.trim()) {
      toast.error("Asset location is required");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for multipart/form-data request
      const form = new FormData();

      // Append all form fields
      form.append("assetTitle", formData.assetTitle.trim());
      form.append("assetCategory", formData.assetCategory);
      form.append("assetWorth", formData.assetWorth.trim());
      form.append("assetLocation", formData.assetLocation.trim());
      form.append("assetDescription", formData.assetDescription.trim());

      // Append file if selected
      if (file) {
        form.append("docs", file);
      }

      const response = await api.post("/assets/create-asset", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if response is successful
      if (response.data?.success) {
        toast.success(response.data?.message || "Asset created successfully!");
        resetForm();
        setOpen(false); // Close dialog
      } else {
        throw new Error(response.data?.message || "Failed to create asset");
      }
    } catch (err: unknown) {
      console.error("Failed to create asset:", err);

      if (axios.isAxiosError(err)) {
        const message = (err.response?.data as { message?: string } | undefined)
          ?.message;
        toast.error(message ?? "Failed to add asset. Please try again.");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to add asset. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Button that opens the dialog */}
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] text-white px-4 py-2 rounded-[10px] flex items-center gap-2">
          <Plus />
          Add Asset
        </Button>
      </DialogTrigger>

      {/* The form lives inside the dialog content */}
      <DialogContent className="w-fit border-[4px] border-[#F8F8F8] rounded-[20px] h-[90vh] overflow-y-auto scrollbar-hide">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[20px] font-semibold text-black">
              Add new asset
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-2">
            {/* Asset Title */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="assetTitle"
                className="text-[13.78px] font-medium text-[#1A1A21]"
              >
                Asset Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="assetTitle"
                name="assetTitle"
                value={formData.assetTitle}
                onChange={handleChange}
                placeholder="Enter Asset title"
                className="w-[454px] h-[37px] rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#333]"
                required
              />
            </div>

            {/* Category */}
            <div className="grid gap-1.5">
              <Label className="text-[13.78px] font-medium text-[#1A1A21]">
                Asset Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.assetCategory}
                onValueChange={(val) =>
                  setFormData({ ...formData, assetCategory: val })
                }
                required
              >
                <SelectTrigger className="w-full h-[37px] rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#333] shadow-none">
                  <SelectValue placeholder="Enter Asset Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="commodities">Commodities</SelectItem>
                    <SelectItem value="art-collectibles">
                      Art Collectibles
                    </SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Worth */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="assetWorth"
                className="text-[13.78px] font-medium text-[#1A1A21]"
              >
                Asset Worth <span className="text-red-500">*</span>
              </Label>
              <Input
                id="assetWorth"
                name="assetWorth"
                type="number"
                value={formData.assetWorth}
                onChange={handleChange}
                placeholder="Enter asset Worth ($)"
                className="w-[454px] h-[37px] rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#333]"
                required
              />
              <span className="text-[#8C94A6] text-[11px] font-medium">
                *Make sure the worth written is correct
              </span>
            </div>

            {/* Location */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="assetLocation"
                className="text-[13.78px] font-medium text-[#1A1A21]"
              >
                Asset Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="assetLocation"
                name="assetLocation"
                value={formData.assetLocation}
                onChange={handleChange}
                placeholder="Enter asset Location"
                className="w-[454px] h-[37px] rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#333]"
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="assetDescription"
                className="text-[13.78px] font-medium text-[#1A1A21]"
              >
                Asset Description
              </Label>
              <Textarea
                id="assetDescription"
                name="assetDescription"
                value={formData.assetDescription}
                onChange={handleChange}
                placeholder="Enter asset description"
                className="w-[454px] h-[65px] resize-none rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#333]"
              />
            </div>

            {/* File Upload */}
            <div className="grid">
              <Label className="text-sm font-medium text-[#1A1A21] mb-2 block">
                Assets Documents
              </Label>
              <Card className="border border-dashed border-[#F1F1F1] bg-white h-[86px] shadow-none flex flex-col justify-center items-center">
                <CardContent className="p-4 flex flex-col justify-center items-center w-full">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer w-full flex flex-col items-center justify-center text-center"
                  >
                    {file ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-gray-700 truncate max-w-[160px]">
                          {file.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Image
                          src="/icons/document.svg"
                          alt="Upload"
                          width={28}
                          height={28}
                        />
                        <p className="text-[13px] text-gray-600 leading-snug">
                          Drag your files here or{" "}
                          <span className="text-[#563BB5] font-medium">
                            choose to browse
                          </span>
                        </p>
                      </div>
                    )}
                  </label>
                </CardContent>
              </Card>
              <p className="text-[12px] font-medium text-[#8C94A6]">
                *We only support PNGs and JPEG under 10MB
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] cursor-pointer text-white px-4 py-2 rounded-[10px] flex items-center gap-2"
            >
              {loading ? "Adding..." : "Add Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssetsDialog;
