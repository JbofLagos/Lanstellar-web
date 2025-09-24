"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LanstellarForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyAddress: "",
    country: "",
    companyContact: "",
    registrationCert: null as File | null,
    companyCac: null as File | null,
    financialReport: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleContinue = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className=" bg-white font-inter justify-center relative items-center flex flex-col ">
      <div className="w-full max-w-md">
        <div className="self-start ml-[20px] z-50 mt-[10px] top-0 left-0 absolute">
          <Image src={"/logo3.svg"} height={48} width={174} alt="logo" />
        </div>

        <div className="flex items-center gap-2 w-10/12 mx-auto mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                currentStep >= 1
                  ? "bg-[#DACBEB] text-[#5809B0]"
                  : "bg-[#F4F3F7] text-[#8C94A6]"
              }`}
            >
              1
            </div>
            <span
              className={`text-sm ${
                currentStep >= 1 ? "text-[#5809B0]" : "text-[#8C94A6]"
              }`}
            >
              Company info
            </span>
          </div>
          <div className="flex-1 h-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                currentStep >= 2
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <span
              className={`text-sm ${
                currentStep >= 2 ? "text-purple-600" : "text-gray-500"
              }`}
            >
              Upload documents
            </span>
          </div>
        </div>

        <div className="space-y-2 flex justify-center flex-col px-[40px] py-4 bg-white border-4 border-[#F4F3F7]  rounded-[20px] h-auto w-[502px] max-w-full">
          {currentStep === 1 && (
            <div className="space-y-3">
              <div>
                <h2 className="text-[18px] font-semibold text-black mb-1">
                  Company information
                </h2>
                <p className="text-[13px] text-[#8C94A6]">
                  Fill out the necessary information about your company
                </p>
              </div>

              <div className="space-y-4">
                <div className=" flex flex-row items-center justify-between gap-4">
                  <div className="bg-[#F4F3F7] h-[80px] w-[80px] rounded-full"></div>
                  <div className=" flex gap-5 align-start">
                    <Button className="mt-2 bg-white border border-[#F1F1F1] w-[118px] h-[40px] rounded-[10px] text-[#8C94A6] px-4 flex items-center justify-center">
                      <Image
                        src="/icons/export.png"
                        alt="Upload"
                        width={16}
                        height={16}
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="logoUpload"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileUpload("logo", file);
                        }}
                      />
                      Upload Logo
                    </Button>
                    <Button className="mt-2 bg-white border border-[#F1F1F1] w-[65px] h-[40px] rounded-[10px] text-[#8C94A6]">
                      Remove
                    </Button>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="companyName"
                    className="text-[13px] font-medium text-[1A1A1A] "
                  >
                    Company name
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="What's your company name?"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                    className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#CBCBCB] text-[13px] rounded-[10px] h-[37px] w-full"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="companyEmail"
                    className="text-[13px] font-medium text-[1A1A1A] "
                  >
                    Company email
                  </Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    placeholder="What’s your company email"
                    value={formData.companyEmail}
                    onChange={(e) =>
                      handleInputChange("companyEmail", e.target.value)
                    }
                    className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#CBCBCB] text-[13px] rounded-[10px] h-[37px] w-full"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="companyAddress"
                    className="text-[13px] font-medium text-[1A1A1A] "
                  >
                    Company address
                  </Label>
                  <Input
                    id="companyAddress"
                    placeholder="What's your company address?"
                    value={formData.companyAddress}
                    onChange={(e) =>
                      handleInputChange("companyAddress", e.target.value)
                    }
                    className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#CBCBCB] text-[13px] rounded-[10px] h-[37px] w-full"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="country"
                    className="text-[13px] font-medium text-[1A1A1A] "
                  >
                    Country
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("country", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#CBCBCB] text-[13px] rounded-[10px] h-[37px] w-full">
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="ng">Nigeria</SelectItem>
                      <SelectItem value="gh">Ghana</SelectItem>
                      <SelectItem value="ke">Kenya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="companyContact"
                    className="text-[13px] font-medium text-[1A1A1A] "
                  >
                    Company contact
                  </Label>
                  <Input
                    id="companyContact"
                    placeholder="What's your company phone number?"
                    value={formData.companyContact}
                    onChange={(e) =>
                      handleInputChange("companyContact", e.target.value)
                    }
                    className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#CBCBCB] text-[13px] rounded-[10px] h-[37px] w-full"
                  />
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] hover:from-[#439EFF]/90 hover:to-[#5B1E9F]/90 text-white"
              >
                Continue
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[20px] font-semibold text-black mb-2">
                  Upload required documents
                </h2>
                <p className="text-[13px] text-[#8C94A6]">
                  Please all documents are scanned and clear
                </p>
              </div>

              <div className="space-y-1.5">
                <FileUploadField
                  label="Company registration certificate"
                  file={formData.registrationCert}
                  onFileChange={(file) =>
                    handleFileUpload("registrationCert", file)
                  }
                />

                <FileUploadField
                  label="Company CAC"
                  file={formData.companyCac}
                  onFileChange={(file) => handleFileUpload("companyCac", file)}
                />

                <FileUploadField
                  label="Financial report"
                  file={formData.financialReport}
                  onFileChange={(file) =>
                    handleFileUpload("financialReport", file)
                  }
                />
              </div>
              <Link href="/dashboard">
                <Button className="w-full bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] hover:from-[#439EFF]/90 hover:to-[#5B1E9F]/90  text-white">
                  Continue
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FileUploadField({
  label,
  file,
  onFileChange,
}: {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onFileChange(selectedFile);
  };

  return (
    <div>
      <Label className="text-sm font-medium text-[#1A1A21] mb-2 block">
        {label}
      </Label>

      <Card className="border border-dashed border-gray-200 bg-white h-[120px] flex flex-col justify-center items-center">
        <CardContent className="p-4 flex flex-col justify-center items-center w-full">
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
            id={`file-${label.replace(/\s+/g, "-").toLowerCase()}`}
          />

          <label
            htmlFor={`file-${label.replace(/\s+/g, "-").toLowerCase()}`}
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
      <div className=" mt-2.5">
        <p className="text-[12px] font-medium text-[#8C94A6]">
          *We only support PNGs and JPEG under 10MB
        </p>
      </div>
    </div>
  );
}
