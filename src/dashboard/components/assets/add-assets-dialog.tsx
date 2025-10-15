import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Plus, X, ImageIcon, File } from "lucide-react";
import { toast } from "sonner";
import { createAsset } from "@/lib/api-service";

interface AssetForm {
  assetTitle: string;
  assetCategory: string;
  assetWorth: string;
  assetLocation: string;
  assetDescription: string;
}

const AddAssetsDialog = () => {
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [assetDocs, setAssetDocs] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      if (!["image/png", "image/jpeg"].includes(selectedFile.type)) {
        toast.error("We only support PNG and JPEG");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }
      setMedia(selectedFile);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDocumentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      if (
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(selectedFile.type)
      ) {
        toast.error("We only support PDFs and DOC/DOCX");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }
      setAssetDocs(selectedFile);
    }
  };

  const removeFile = () => {
    setMedia(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const removeDocument = () => {
    setAssetDocs(null);
    const docInput = document.getElementById(
      "document-upload"
    ) as HTMLInputElement;
    if (docInput) {
      docInput.value = "";
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
    setMedia(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setAssetDocs(null);
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    const docInput = document.getElementById(
      "document-upload"
    ) as HTMLInputElement;
    if (docInput) {
      docInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    setIsPending(true);
    const form = new FormData();

    // Append all form fields
    form.append("assetTitle", formData.assetTitle.trim());
    form.append("assetCategory", formData.assetCategory);
    form.append("assetWorth", formData.assetWorth.trim());
    form.append("assetLocation", formData.assetLocation.trim());
    form.append("assetDescription", formData.assetDescription.trim());
    if (media) {
      form.append("media", media);
    }
    if (assetDocs) {
      form.append("assetDocs", assetDocs);
    }

    const response = await createAsset(form);
    if (response.success) {
      resetForm();
      toast.success("Assets created Sucessfully");
      setOpen(false);
    }
    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] text-white px-4 py-2 rounded-[10px] flex items-center gap-2">
          <Plus />
          Add Asset
        </Button>
      </DialogTrigger>

      <DialogContent className="w-fit border-[4px] border-[#F8F8F8] rounded-[20px] h-[90vh] overflow-y-auto scrollbar-hide">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[20px] font-semibold text-black">
              Add new asset
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>

          <div className="grid gap-2">
            {/* Asset Title */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="assetTitle"
                className="text-[13.78px] font-medium text-[#1A1A21]"
              >
                Asset Title
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
                Asset Category
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
                Asset Worth
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
                Asset Location
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
                Assets Image
              </Label>
              {media && previewUrl ? (
                <Card className="border border-[#F1F1F1] bg-white shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative p-2 rounded-md overflow-hidden bg-[#563BB5]/20">
                          <ImageIcon className="w-5 h-5 text-[#563BB5]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {media.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(media.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-dashed border-[#F1F1F1] bg-white h-[86px] shadow-none flex flex-col justify-center items-center">
                  <CardContent className="p-4 flex flex-col justify-center items-center w-full">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer w-full flex flex-col items-center justify-center text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ImageIcon className="w-7 h-7 text-gray-400" />
                        <p className="text-[13px] text-gray-600 leading-snug">
                          Drag your files here or{" "}
                          <span className="text-[#563BB5] font-medium">
                            choose to browse
                          </span>
                        </p>
                      </div>
                    </label>
                  </CardContent>
                </Card>
              )}

              <p className="text-[12px] font-medium text-[#8C94A6] mt-1">
                *We only support PNGs and JPEG under 10MB
              </p>
            </div>
            <div className="grid">
              <Label className="text-sm font-medium text-[#1A1A21] mb-2 block">
                Assets Documents
              </Label>
              {assetDocs ? (
                <Card className="border border-[#F1F1F1] bg-white shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative p-2 rounded-md overflow-hidden bg-[#563BB5]/20">
                          <File className="w-5 h-5 text-[#563BB5]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {assetDocs.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(assetDocs.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeDocument}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-dashed border-[#F1F1F1] bg-white h-[86px] shadow-none flex flex-col justify-center items-center">
                  <CardContent className="p-4 flex flex-col justify-center items-center w-full">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocumentSelect}
                      className="hidden"
                      id="document-upload"
                    />
                    <label
                      htmlFor="document-upload"
                      className="cursor-pointer w-full flex flex-col items-center justify-center text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <File className="w-7 h-7 text-gray-400" />
                        <p className="text-[13px] text-gray-600 leading-snug">
                          Drag your Document here or{" "}
                          <span className="text-[#563BB5] font-medium">
                            choose to browse
                          </span>
                        </p>
                      </div>
                    </label>
                  </CardContent>
                </Card>
              )}
              <p className="text-[12px] font-medium text-[#8C94A6] mt-1">
                *We only support Pdfs and .doc and .docx under 10MB
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] cursor-pointer text-white px-4 py-2 rounded-[10px] flex items-center gap-2"
            >
              {isPending ? "Adding..." : "Add Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssetsDialog;
