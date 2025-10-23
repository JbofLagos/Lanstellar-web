import { useState, useEffect } from "react";
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
import { Plus, X, File, Upload } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { useCreateAsset } from "@/hook/useCreateAsset";

interface AssetFormData {
  assetTitle: string;
  assetCategory: string;
  assetWorth: string;
  assetLocation: string;
  assetDescription: string;
}

interface FileWithPreview {
  file: File;
  preview: string;
}

const MAX_IMAGES = 5;
const MAX_DOCUMENTS = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const AddAssetsDialog = () => {
  const [media, setMedia] = useState<FileWithPreview[]>([]);
  const [assetDocs, setAssetDocs] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const { createNewAsset, loading } = useCreateAsset();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AssetFormData>({
    defaultValues: {
      assetTitle: "",
      assetCategory: "",
      assetWorth: "",
      assetLocation: "",
      assetDescription: "",
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (media.length + files.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    const validFiles: FileWithPreview[] = [];

    for (const file of files) {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        toast.error(`${file.name}: Only PNG and JPEG images are supported`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: File size must be under 10MB`);
        continue;
      }
      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setMedia((prev) => [...prev, ...validFiles]);
    event.target.value = "";
  };

  const handleDocumentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (assetDocs.length + files.length > MAX_DOCUMENTS) {
      toast.error(`You can only upload up to ${MAX_DOCUMENTS} documents`);
      return;
    }

    const validFiles: File[] = [];

    for (const file of files) {
      if (
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
        toast.error(`${file.name}: Only PDF and DOC/DOCX are supported`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: File size must be under 10MB`);
        continue;
      }
      validFiles.push(file);
    }

    setAssetDocs((prev) => [...prev, ...validFiles]);
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setMedia((prev) => {
      const newMedia = [...prev];
      URL.revokeObjectURL(newMedia[index].preview);
      newMedia.splice(index, 1);
      return newMedia;
    });
  };

  const removeDocument = (index: number) => {
    setAssetDocs((prev) => {
      const newDocs = [...prev];
      newDocs.splice(index, 1);
      return newDocs;
    });
  };

  const resetForm = () => {
    reset();
    media.forEach((m) => URL.revokeObjectURL(m.preview));
    setMedia([]);
    setAssetDocs([]);
  };

  const onSubmit = async (data: AssetFormData) => {
    console.log("Form data submitted:", data);

    if (media.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!data.assetCategory || data.assetCategory.trim() === "") {
      toast.error("Please select an asset category");
      return;
    }

    await createNewAsset({
      ...data,
      media: media.map((m) => m.file),
      assetDocs: assetDocs,
    });

    resetForm();
    setOpen(false);
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      media.forEach((m) => URL.revokeObjectURL(m.preview));
    };
  }, [media]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] text-white px-4 py-2 rounded-[10px] flex items-center gap-2">
          <Plus />
          Add Asset
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full h-[90vh] !max-w-[600px] border-[4px] border-[#F8F8F8] rounded-[20px] overflow-y-auto scrollbar-hide">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-[20px] font-semibold text-black">
              Add New Asset
            </DialogTitle>
            <DialogDescription className="text-[14px] text-[#8C94A6]">
              Fill in the details below to add a new asset to your portfolio
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            {/* Asset Title */}
            <div className="grid gap-2">
              <Label
                htmlFor="assetTitle"
                className="text-[14px] font-medium text-[#1A1A21]"
              >
                Asset Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="assetTitle"
                {...register("assetTitle", {
                  required: "Asset title is required",
                })}
                placeholder="Enter asset title"
                className={`w-full h-[42px] rounded-[10px] border bg-[#F5F5F5] px-4 py-2 text-[14px] text-[#333] ${
                  errors.assetTitle ? "border-red-500" : "border-[#F1F1F1]"
                }`}
              />
              {errors.assetTitle && (
                <p className="text-red-500 text-xs">
                  {errors.assetTitle.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="grid gap-2">
                <Label className="text-[14px] font-medium text-[#1A1A21]">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="assetCategory"
                  control={control}
                  rules={{
                    required: "Category is required",
                    validate: (value) => {
                      const validCategories = [
                        "residential",
                        "real-estate",
                        "commodities",
                        "art-collectibles",
                        "commercial",
                      ];
                      return (
                        validCategories.includes(value) ||
                        "Please select a valid category"
                      );
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        console.log("Category selected:", value);
                        field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger
                        className={`w-full h-[42px] rounded-[10px] border bg-[#F5F5F5] px-4 text-[14px] text-[#333] shadow-none ${
                          errors.assetCategory
                            ? "border-red-500"
                            : "border-[#F1F1F1]"
                        }`}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          <SelectItem value="residential">
                            Residential
                          </SelectItem>
                          <SelectItem value="real-estate">
                            Real Estate
                          </SelectItem>
                          <SelectItem value="commodities">
                            Commodities
                          </SelectItem>
                          <SelectItem value="art-collectibles">
                            Art & Collectibles
                          </SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.assetCategory && (
                  <p className="text-red-500 text-xs">
                    {errors.assetCategory.message}
                  </p>
                )}
              </div>

              {/* Worth */}
              <div className="grid gap-2">
                <Label
                  htmlFor="assetWorth"
                  className="text-[14px] font-medium text-[#1A1A21]"
                >
                  Asset Worth ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="assetWorth"
                  type="number"
                  {...register("assetWorth", {
                    required: "Asset worth is required",
                    min: { value: 0, message: "Worth must be positive" },
                  })}
                  placeholder="10,000"
                  className={`w-full h-[42px] rounded-[10px] border bg-[#F5F5F5] px-4 py-2 text-[14px] text-[#333] ${
                    errors.assetWorth ? "border-red-500" : "border-[#F1F1F1]"
                  }`}
                />
                {errors.assetWorth && (
                  <p className="text-red-500 text-xs">
                    {errors.assetWorth.message}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="grid gap-2">
              <Label
                htmlFor="assetLocation"
                className="text-[14px] font-medium text-[#1A1A21]"
              >
                Asset Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="assetLocation"
                {...register("assetLocation", {
                  required: "Location is required",
                })}
                placeholder="Enter asset location"
                className={`w-full h-[42px] rounded-[10px] border bg-[#F5F5F5] px-4 py-2 text-[14px] text-[#333] ${
                  errors.assetLocation ? "border-red-500" : "border-[#F1F1F1]"
                }`}
              />
              {errors.assetLocation && (
                <p className="text-red-500 text-xs">
                  {errors.assetLocation.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label
                htmlFor="assetDescription"
                className="text-[14px] font-medium text-[#1A1A21]"
              >
                Asset Description
              </Label>
              <Textarea
                id="assetDescription"
                {...register("assetDescription")}
                placeholder="Provide a detailed description of the asset..."
                className="w-full min-h-[80px] resize-none rounded-[10px] border border-[#F1F1F1] bg-[#F5F5F5] px-4 py-3 text-[14px] text-[#333]"
              />
            </div>

            {/* Images Upload - Up to 5 */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-[14px] font-medium text-[#1A1A21]">
                  Asset Images <span className="text-red-500">*</span>
                  <span className="text-[12px] text-[#8C94A6] font-normal ml-2">
                    ({media.length}/{MAX_IMAGES})
                  </span>
                </Label>
              </div>

              {/* Upload Area */}
              {media.length < MAX_IMAGES && (
                <Card className="border-2 border-dashed border-[#E4E3EC] bg-gradient-to-b from-[#F8F9FF] to-white shadow-none hover:border-[#563BB5] transition-colors">
                  <CardContent className="p-6">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageSelect}
                      multiple
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer w-full flex flex-col items-center justify-center text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="p-3 rounded-full bg-[#563BB5]/10">
                          <Upload className="w-6 h-6 text-[#563BB5]" />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-gray-700">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-[12px] text-[#8C94A6] mt-1">
                            PNG or JPEG (max {MAX_IMAGES} images, 10MB each)
                          </p>
                        </div>
                      </div>
                    </label>
                  </CardContent>
                </Card>
              )}

              {/* Preview Grid */}
              {media.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {media.map((item, index) => (
                    <Card
                      key={index}
                      className="border border-[#E4E3EC] overflow-hidden group relative"
                    >
                      <img
                        src={item.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="px-2 py-1 bg-black/50 absolute bottom-0 left-0 right-0">
                        <p className="text-[10px] text-white truncate">
                          {item.file.name}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Documents Upload - Up to 3 */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-[14px] font-medium text-[#1A1A21]">
                  Asset Documents
                  <span className="text-[12px] text-[#8C94A6] font-normal ml-2">
                    ({assetDocs.length}/{MAX_DOCUMENTS})
                  </span>
                </Label>
              </div>

              {/* Upload Area */}
              {assetDocs.length < MAX_DOCUMENTS && (
                <Card className="border-2 border-dashed border-[#E4E3EC] bg-gradient-to-b from-[#FFF8F0] to-white shadow-none hover:border-[#F59E0B] transition-colors">
                  <CardContent className="p-4">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocumentSelect}
                      multiple
                      className="hidden"
                      id="document-upload"
                    />
                    <label
                      htmlFor="document-upload"
                      className="cursor-pointer w-full flex items-center gap-4"
                    >
                      <div className="p-2 rounded-lg bg-[#F59E0B]/10">
                        <File className="w-5 h-5 text-[#F59E0B]" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-medium text-gray-700">
                          Upload documents
                        </p>
                        <p className="text-[11px] text-[#8C94A6]">
                          PDF, DOC, DOCX (max {MAX_DOCUMENTS} files, 10MB each)
                        </p>
                      </div>
                      <Upload className="w-5 h-5 text-[#8C94A6]" />
                    </label>
                  </CardContent>
                </Card>
              )}

              {/* Documents List */}
              {assetDocs.length > 0 && (
                <div className="space-y-2">
                  {assetDocs.map((doc, index) => (
                    <Card
                      key={index}
                      className="border border-[#E4E3EC] shadow-none"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 rounded-md bg-[#563BB5]/10 flex-shrink-0">
                              <File className="w-4 h-4 text-[#563BB5]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-gray-900 truncate">
                                {doc.name}
                              </p>
                              <p className="text-[11px] text-[#8C94A6]">
                                {(doc.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              disabled={loading}
              className="px-6 border-[#E4E3EC] text-[#49576D] hover:bg-[#F4F3F7]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] hover:from-[#439EFF]/90 hover:to-[#5B1E9F]/90 cursor-pointer text-white px-6 py-2 rounded-[10px] flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Asset
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssetsDialog;
