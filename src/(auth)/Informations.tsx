import { useState, useEffect } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { useUpdateProfile } from "@/hook/useUpdateProfile";

interface BorrowerFormData {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  countryCode: string;
  contact: string;
  profilePicture?: File | null;
}

interface LenderFormData {
  username: string;
  email: string;
  countryCode: string;
  contact: string;
  profilePicture?: File | null;
}

export default function Informations() {
  const { user, isLoadingUser } = useCurrentUser();
  // Don't redirect for step 1 (intermediate save), redirect for final submission
  const stepOneUpdate = useUpdateProfile(false);
  const finalUpdate = useUpdateProfile(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const isBorrower = user?.userType === "borrower";

  // Use appropriate loading state based on current step
  const loading =
    currentStep === 1 ? stepOneUpdate.loading : finalUpdate.loading;

  // Borrower form
  const borrowerForm = useForm<BorrowerFormData>({
    defaultValues: {
      companyName: "",
      companyEmail: "",
      companyAddress: "",
      countryCode: "",
      contact: "",
      profilePicture: null,
    },
  });

  // Lender form
  const lenderForm = useForm<LenderFormData>({
    defaultValues: {
      username: "",
      email: "",
      countryCode: "",
      contact: "",
      profilePicture: null,
    },
  });

  // Populate form with user data when available
  useEffect(() => {
    if (user) {
      if (isBorrower) {
        borrowerForm.reset({
          companyName: "",
          companyEmail: "",
          companyAddress: "",
          countryCode: "",
          contact: "",
        });
      } else {
        lenderForm.reset({
          username: "",
          email: "",
          countryCode: "",
          contact: "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isBorrower]);

  const handleContinue = async () => {
    if (isBorrower && currentStep === 1) {
      // Submit step 1 data before proceeding to step 2
      const isValid = await borrowerForm.trigger([
        "companyName",
        "companyEmail",
        "companyAddress",
        "countryCode",
        "contact",
      ]);

      if (isValid) {
        const formData = borrowerForm.getValues();
        const response = await stepOneUpdate.updateProfile({
          companyName: formData.companyName,
          companyEmail: formData.companyEmail,
          companyAddress: formData.companyAddress,
          countryCode: formData.countryCode,
          contact: formData.contact,
          profilePicture: formData.profilePicture || null,
        });

        // Only proceed to step 2 if submission was successful
        if (response !== undefined) {
          setCurrentStep(2);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const onSubmitBorrowerDocuments = async (data: BorrowerFormData) => {
    // This is for final submission with documents - will redirect to dashboard
    await finalUpdate.updateProfile({
      companyName: data.companyName,
      companyEmail: data.companyEmail,
      companyAddress: data.companyAddress,
      countryCode: data.countryCode,
      contact: data.contact,
      profilePicture: data.profilePicture || null,
    });
  };

  const onSubmitLender = async (data: LenderFormData) => {
    // Lender submission - will redirect to dashboard
    await finalUpdate.updateProfile({
      username: data.username,
      email: data.email,
      countryCode: data.countryCode,
      contact: data.contact,
      profilePicture: data.profilePicture || null,
    });
  };

  const handleLogoChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const handleProfilePictureChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePreview(null);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className=" bg-white font-inter w-full h-full justify-center relative items-center flex flex-col py-10 ">
      <div className="w-full max-w-md">
        <div className="self-start ml-[20px] z-50 mt-[10px] top-0 left-0 absolute">
          <img src={"/logo3.svg"} height={48} width={174} alt="logo" />
        </div>

        {/* Progress Steps - Only show for borrowers */}
        {isBorrower && (
          <div className="flex items-center gap-2 w-10/12 mx-auto m-6">
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
        )}

        <div className="space-y-2 flex justify-center flex-col px-[25px] py-4 bg-white border-4 border-[#F4F3F7]  rounded-[20px] h-auto w-[502px] max-w-full">
          {/* BORROWER FORM - Step 1 */}
          {isBorrower && currentStep === 1 && (
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
                <div className="flex flex-row items-center gap-4">
                  <div className="relative">
                    <div className="bg-[#F4F3F7] h-[80px] w-[80px] rounded-full flex items-center justify-center overflow-hidden border-2 border-[#E4E3EC]">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-[#8C94A6] text-center text-xs">
                          No Logo
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <Controller
                      name="profilePicture"
                      control={borrowerForm.control}
                      render={({ field: { onChange, ref, name } }) => (
                        <>
                          <label htmlFor="logoUpload">
                            <Button
                              type="button"
                              onClick={() =>
                                document.getElementById("logoUpload")?.click()
                              }
                              className="bg-white border border-[#F1F1F1] text-[12px] hover:bg-white/90 cursor-pointer h-[40px] rounded-[10px] text-[#8C94A6] px-4 flex items-center gap-2"
                            >
                              <img
                                src="/icons/export.png"
                                alt="Upload"
                                width={16}
                                height={16}
                              />
                              Upload Logo
                            </Button>
                          </label>
                          <Input
                            ref={ref}
                            name={name}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="logoUpload"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              onChange(file);
                              handleLogoChange(file);
                            }}
                          />
                        </>
                      )}
                    />
                    {logoPreview && (
                      <Button
                        type="button"
                        onClick={() => {
                          borrowerForm.setValue("profilePicture", null);
                          setLogoPreview(null);
                        }}
                        className="bg-white border border-[#F1F1F1] text-[12px] hover:bg-red-50 hover:text-red-600 hover:border-red-300 cursor-pointer h-[40px] rounded-[10px] text-[#8C94A6] px-4"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="fullName"
                    className="text-[13px] font-medium text-[1A1A1A] "
                  >
                    Company name
                  </Label>
                  <Input
                    id="companyName"
                    {...borrowerForm.register("companyName", {
                      required: "Company name is required",
                    })}
                    placeholder="What's your company name?"
                    className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#1a1a1a] text-[13px] rounded-[10px] h-[37px] w-full"
                  />
                  {borrowerForm.formState.errors.companyName && (
                    <p className="text-red-500 text-xs mt-1">
                      {borrowerForm.formState.errors.companyName.message}
                    </p>
                  )}
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
                    {...borrowerForm.register("companyEmail", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    placeholder="What's your company email"
                    className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#1a1a1a] text-[13px] rounded-[10px] h-[37px] w-full"
                  />
                  {borrowerForm.formState.errors.companyEmail && (
                    <p className="text-red-500 text-xs mt-1">
                      {borrowerForm.formState.errors.companyEmail.message}
                    </p>
                  )}
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
                    {...borrowerForm.register("companyAddress", {
                      required: "Address is required",
                    })}
                    placeholder="What's your company address?"
                    className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#1a1a1a] text-[13px] rounded-[10px] h-[37px] w-full"
                  />
                  {borrowerForm.formState.errors.companyAddress && (
                    <p className="text-red-500 text-xs mt-1">
                      {borrowerForm.formState.errors.companyAddress.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="countryCode"
                    className="text-[13px] font-medium text-[1A1A1A] "
                  >
                    Country
                  </Label>
                  <Controller
                    name="countryCode"
                    control={borrowerForm.control}
                    rules={{ required: "Country is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value as string}
                      >
                        <SelectTrigger className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#1a1a1a] text-[13px] rounded-[10px] h-[37px] w-full">
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
                    )}
                  />
                  {borrowerForm.formState.errors.countryCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {borrowerForm.formState.errors.countryCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="contact"
                    className="text-[13px] font-medium text-[1A1A1A] "
                  >
                    Company contact
                  </Label>
                  <Input
                    id="contact"
                    {...borrowerForm.register("contact", {
                      required: "Contact is required",
                    })}
                    placeholder="What's your company phone number?"
                    className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#1a1a1a] text-[13px] rounded-[10px] h-[37px] w-full"
                  />
                  {borrowerForm.formState.errors.contact && (
                    <p className="text-red-500 text-xs mt-1">
                      {borrowerForm.formState.errors.contact.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleContinue}
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#439EFF] cursor-pointer to-[#5B1E9F] hover:from-[#439EFF]/90 hover:to-[#5B1E9F]/90 text-white disabled:opacity-50"
              >
                {loading ? "Saving..." : "Continue"}
              </Button>
            </div>
          )}

          {/* BORROWER STEP 2 - Documents */}
          {isBorrower && currentStep === 2 && (
            <form
              onSubmit={borrowerForm.handleSubmit(onSubmitBorrowerDocuments)}
              className="space-y-6"
            >
              <div>
                <h2 className="text-[20px] font-semibold text-black mb-2">
                  Upload required documents
                </h2>
                <p className="text-[13px] text-[#8C94A6]">
                  Please all documents are scanned and clear
                </p>
              </div>

              {/* <div className="space-y-1.5">
                <Controller
                  name="registrationCert"
                  control={borrowerForm.control}
                  render={({ field }) => (
                <FileUploadField
                  label="Company registration certificate"
                      file={field.value || null}
                      onFileChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  name="companyCac"
                  control={borrowerForm.control}
                  render={({ field }) => (
                <FileUploadField
                  label="Company CAC"
                      file={field.value || null}
                      onFileChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  name="financialReport"
                  control={borrowerForm.control}
                  render={({ field }) => (
                <FileUploadField
                  label="Financial report"
                      file={field.value || null}
                      onFileChange={field.onChange}
                    />
                  )}
                />
              </div> */}

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="w-1/3 bg-white border border-[#E4E3EC] text-[#8C94A6] hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-gradient-to-br cursor-pointer from-[#439EFF] to-[#5B1E9F] hover:from-[#439EFF]/90 hover:to-[#5B1E9F]/90 text-white disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          )}

          {/* LENDER FORM */}
          {!isBorrower && (
            <form
              onSubmit={lenderForm.handleSubmit(onSubmitLender)}
              className="space-y-3"
            >
              <div>
                <h2 className="text-[18px] font-semibold text-black mb-1">
                  Personal information
                </h2>
                <p className="text-[13px] text-[#8C94A6]">
                  Fill out your personal information
                </p>
              </div>

              <div className="space-y-4">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] h-[100px] w-[100px] rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-white text-2xl font-semibold">
                          {user?.username?.[0]?.toUpperCase() ||
                            user?.email?.[0]?.toUpperCase() ||
                            "U"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Controller
                      name="profilePicture"
                      control={lenderForm.control}
                      render={({ field: { onChange, ref, name } }) => (
                        <>
                          <label htmlFor="profilePictureUpload">
                            <Button
                              type="button"
                              onClick={() =>
                                document
                                  .getElementById("profilePictureUpload")
                                  ?.click()
                              }
                              className="bg-white border border-[#F1F1F1] text-[12px] hover:bg-white/90 cursor-pointer h-[40px] rounded-[10px] text-[#8C94A6] px-4 flex items-center gap-2"
                            >
                              <img
                                src="/icons/export.png"
                                alt="Upload"
                                width={16}
                                height={16}
                              />
                              Upload Photo
                            </Button>
                          </label>
                          <Input
                            ref={ref}
                            name={name}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="profilePictureUpload"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              onChange(file);
                              handleProfilePictureChange(file);
                            }}
                          />
                        </>
                      )}
                    />
                    {profilePreview && (
                      <Button
                        type="button"
                        onClick={() => {
                          lenderForm.setValue("profilePicture", null);
                          setProfilePreview(null);
                        }}
                        className="bg-white border border-[#F1F1F1] text-[12px] hover:bg-red-50 hover:text-red-600 hover:border-red-300 cursor-pointer h-[40px] rounded-[10px] text-[#8C94A6] px-4"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="lender-username"
                    className="text-[13px] font-medium text-[1A1A1A] "
                  >
                    Username
                  </Label>
                  <Input
                    id="lender-username"
                    {...lenderForm.register("username", {
                      required: "Username is required",
                    })}
                    placeholder="Enter your username"
                    className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#1a1a1a] text-[13px] rounded-[10px] h-[37px] w-full"
                  />
                  {lenderForm.formState.errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {lenderForm.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="lender-email"
                    className="text-[13px] font-medium text-[1A1A1A] "
                  >
                    Email
                  </Label>
                  <Input
                    id="lender-email"
                    type="email"
                    {...lenderForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    placeholder="Enter your email"
                    className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#1a1a1a] text-[13px] rounded-[10px] h-[37px] w-full"
                  />
                  {lenderForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {lenderForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="lender-country"
                    className="text-[13px] font-medium text-[1A1A1A] "
                  >
                    Country
                  </Label>
                  <Controller
                    name="countryCode"
                    control={lenderForm.control}
                    rules={{ required: "Country is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value as string}
                      >
                        <SelectTrigger className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#1a1a1a] text-[13px] rounded-[10px] h-[37px] w-full">
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
                    )}
                  />
                  {lenderForm.formState.errors.countryCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {lenderForm.formState.errors.countryCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="lender-contact"
                    className="text-[13px] font-medium text-[1A1A1A] "
                  >
                    Contact
                  </Label>
                  <Input
                    id="lender-contact"
                    {...lenderForm.register("contact", {
                      required: "Contact is required",
                    })}
                    placeholder="Enter your phone number"
                    className="mt-1 bg-[#F5F5F5] border border-[#F5F5F5] text-[#1a1a1a] text-[13px] rounded-[10px] h-[37px] w-full"
                  />
                  {lenderForm.formState.errors.contact && (
                    <p className="text-red-500 text-xs mt-1">
                      {lenderForm.formState.errors.contact.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#439EFF] cursor-pointer to-[#5B1E9F] hover:from-[#439EFF]/90 hover:to-[#5B1E9F]/90 text-white"
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
