import { useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";
import AddLiquidityModal from "./AddLiquidityModal";

const ConnectWalletButton = () => {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        {!isConnected ? (
          <Button
            onClick={() => open()}
            className="bg-[#504CF6] hover:bg-[#504CF6]/90 text-white px-6 py-4 rounded-lg font-medium"
          >
            Connect Wallet
          </Button>
        ) : (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#504CF6] hover:bg-[#504CF6]/90 text-white px-6 py-4 rounded-lg font-medium"
          >
            Add Liquidity
          </Button>
        )}
      </div>
      <AddLiquidityModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default ConnectWalletButton;
