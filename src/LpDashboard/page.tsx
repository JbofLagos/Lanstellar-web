import { useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";
import AddLiquidityModal from "@/components/AddLiquidityModal";
import Analytics from "./components/analytics";
import { Wallet } from "lucide-react";

const LpDashboardPage = () => {
  const { open } = useAppKit();
  const { isConnected, address: accountAddress } = useAppKitAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="font-inter space-y-[27px] p-6">
        <div className="flex flex-row justify-between items-center mb-6">
          <span className="text-[15.5px] text-black gap-2 flex items-center font-medium">
            {/* <img
              src="/icons/balance.svg"
              alt="balance"
              className="text-[#8C94A6] w-[20.67px] h-[20.67px]"
            /> */}
            Liquidity Provider
          </span>
          {!isConnected ? (
            <Button
              onClick={() => open()}
              className="bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] hover:bg-[#439EFF]/90 cursor-pointer text-white px-5 py-2 rounded-lg font-medium text-[16px]"
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] hover:bg-[#439EFF]/90 cursor-pointer text-white px-5 py-2 rounded-lg font-medium text-[16px]"
              >
                Add Liquidity
              </Button>
              <Button
                onClick={() => {
                  // @ts-expect-error - account parameter exists but not in types
                  open({ account: accountAddress });
                }}
                className="bg-white hover:bg-gray-100 cursor-pointer text-[#504CF6] border border-[#E4E3EC] p-2 rounded-lg"
                size="icon"
              >
                <Wallet className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Analytics */}
        <div>
          <Analytics />
        </div>
      </div>
      <AddLiquidityModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default LpDashboardPage;
