import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const Notification = () => {
  return (
    <div>
      <Card className="shadow-none border-none pt-0 w-11/12 mx-auto">
        <CardHeader className="border-b-[1px] border-b-[#F4F3F7] pb-3.5">
          <CardTitle className="text-[20px] font-semibold">
            Notification
          </CardTitle>
          <CardDescription className="text-[#8C94A6] text-[13.78px]">
            Customize your notification settings
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-[13.78px] w-1/2">
          <div className=" space-y-2">
            <h2 className=" text-[#212121] ">Notify me when</h2>
            <div className=" flex justify-between items-center">
              <span className=" text-[#8C94A6]">A loan is due</span>
              <Switch className=" data-[state=checked]:bg-[#5C09B3] " />
            </div>
            <div className=" flex justify-between items-center">
              <span className=" text-[#8C94A6]">Asset requires review</span>
              <Switch className="data-[state=checked]:bg-[#5C09B3] " />
            </div>
            <div className=" flex justify-between items-center">
              <span className=" text-[#8C94A6]">My loan is funded</span>
              <Switch className=" data-[state=checked]:bg-[#5C09B3]" />
            </div>
          </div>
          <div className=" space-y-2">
            <h2 className=" text-[#212121] ">Notification Type</h2>
            <div className=" flex justify-between items-center">
              <span className=" text-[#8C94A6]">Email</span>
              <Switch className="data-[state=checked]:bg-[#5C09B3] " />
            </div>
            <div className=" flex justify-between items-center">
              <span className=" text-[#8C94A6]">SMS</span>
              <Switch className="data-[state=checked]:bg-[#5C09B3] " />
            </div>
            <div className=" flex justify-between items-center">
              <span className=" text-[#8C94A6]">In-app</span>
              <Switch className="data-[state=checked]:bg-[#5C09B3]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notification;
