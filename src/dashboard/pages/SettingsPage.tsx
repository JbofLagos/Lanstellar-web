import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Profile } from "../components/settings/profile";
import Notification from "../components/settings/notification";
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className=" ">
      <Tabs value={activeTab} onValueChange={setActiveTab} className=" w-full">
        <div className=" w-full border-b-[1px] border-b-[#F4F3F7] h-[57px] flex flex-col justify-center px-6  py-8 mb-4">
          <TabsList className="bg-white text-[13.78px] font-medium leading-[20.67px] w-1/2 ">
            <TabsTrigger
              value="profile"
              className="text-[#8C94A6] cursor-pointer data-[state=active]:bg-[#F7F7F8] data-[state=active]:shadow-none data-[state=active]:text-[#1A1A21] shadow-none rounded-[4px] h-[25px] w-fit p-[6px]  transition-all"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="text-[#8C94A6] cursor-pointer data-[state=active]:bg-[#F7F7F8] data-[state=active]:shadow-none data-[state=active]:text-[#1A1A21] shadow-none rounded-[4px] h-[25px] w-fit p-[6px] transition-all"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="text-[#8C94A6] cursor-pointer data-[state=active]:bg-[#F7F7F8] data-[state=active]:shadow-none data-[state=active]:text-[#1A1A21] shadow-none rounded-[4px] h-[25px] w-fit p-[6px] transition-all"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="help"
              className="text-[#8C94A6] cursor-pointer data-[state=active]:bg-[#F7F7F8] data-[state=active]:shadow-none data-[state=active]:text-[#1A1A21] shadow-none rounded-[4px] h-[25px] w-fit p-[6px] transition-all"
            >
              Help and Support
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="px-6">
          <TabsContent value="profile">
            <Profile />
          </TabsContent>

          <TabsContent value="notifications">
            <Notification />
          </TabsContent>

          <TabsContent value="security" className="mt-4 p-4 border rounded">
            <h3 className="font-semibold mb-2">Security Settings</h3>
            <p>Update your security and privacy settings.</p>
          </TabsContent>

          <TabsContent value="help" className="mt-4 p-4 border rounded">
            <h3 className="font-semibold mb-2">Help and Support</h3>
            <p>Get help and contact support.</p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
