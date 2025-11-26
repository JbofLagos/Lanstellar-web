import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";

const ConnectWalletButton = () => {
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      {!isConnected ? (
        <Button
          onClick={() => open()}
          className="bg-[#504CF6] hover:bg-[#504CF6]/90 text-white px-6 py-4 rounded-lg font-medium"
        >
          Connect Wallet
        </Button>
      ) : (
        <Button className="bg-[#504CF6] hover:bg-[#504CF6]/90 text-white px-6 py-4 rounded-lg font-medium">
          Add Liquidity
        </Button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
