import { useEffect, useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getCurrentUser } from "@/lib/auth";
import api from "@/lib/api";
import { toast } from "sonner";

interface UserForm {
  fullName: string;
  email: string;
  country: string;
  address: string;
  contact: string;
  profilePicture: string;
}

export function Profile() {
  const [formData, setFormData] = useState<UserForm>({
    fullName: "",
    email: "",
    country: "",
    address: "",
    contact: "",
    profilePicture: "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof UserForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        toast.error("We only support PNGs and JPEGs");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }

      setFile(file); // ✅ save actual file
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatarUrl(null);
    setFile(null);
    setFormData((prev) => ({ ...prev, profilePicture: "" }));
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        setFormData(data.data.user);
        setAvatarUrl(data.data.user?.profilePicture || null);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("country", formData.country);
      form.append("address", formData.address);
      form.append("contact", formData.contact);

      if (file) {
        form.append("profilePicture", file);
      }

      const res = await api.put("/auth/update-user", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!");
      setFormData(res.data.user);
      if (res.data.user.profilePicture) {
        setAvatarUrl(res.data.user.profilePicture);
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-none border-none pt-0 w-11/12 mx-auto">
      <CardHeader className="border-b-[1px] border-b-[#F4F3F7] pb-3.5">
        <CardTitle className="text-[20px] font-semibold">Profile</CardTitle>
        <CardDescription className="text-[#8C94A6] text-[13.78px]">
          Manage your company details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-row items-center">
          <Avatar className="h-[80px] w-[80px]">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback className="bg-[#F4F3F7]">
              {formData.fullName?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-2 ml-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-[40px] w-[113px] border-[#F1F1F1] bg-white border-[1px] shadow-none text-[#8C94A6] text-[12px] rounded-[10px]"
                >
                  <span>
                    <img
                      src="/icons/export.png"
                      alt=""
                      width={20}
                      height={20}
                      style={{ display: "inline", marginRight: "5px" }}
                    />
                    Upload logo
                  </span>
                </Button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </Label>

              {(avatarUrl || formData.profilePicture) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeAvatar}
                  className="h-[40px] w-[113px] border-[#F1F1F1] bg-white border-[1px] text-[#8C94A6] text-[12px] rounded-[10px]"
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-[12px] text-[#8C94A6]">
              We only support PNGs and JPEGs under 10MB
            </p>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className=" space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
            />
          </div>
          <div className=" space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className=" space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => handleInputChange("country", value)}
            >
              <SelectTrigger className=" w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className=" space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>
        </div>

        <div className=" space-y-2">
          <Label htmlFor="contact">Contact</Label>
          <Input
            id="contact"
            value={formData.contact}
            onChange={(e) => handleInputChange("contact", e.target.value)}
            className="w-1/2"
          />
        </div>
        <div className=" flex justify-end">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
