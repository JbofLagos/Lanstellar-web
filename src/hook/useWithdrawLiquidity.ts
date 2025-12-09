/**
 * Hook for withdrawing liquidity from the contract
 *
 * @example
 * const { withdrawLiquidity, isWithdrawing, isConfirmed } = useWithdrawLiquidity();
 *
 * await withdrawLiquidity({
 *   depositId: 1n, // Deposit ID to withdraw
 * });
 */

import { useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { toast } from "sonner";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constant/contractABI";
import type { Address } from "viem";

interface WithdrawLiquidityParams {
  depositId: bigint;
}

export const useWithdrawLiquidity = () => {
  const { isConnected: appKitConnected, address } = useAppKitAccount();
  const { isConnected: wagmiConnected, connector } = useAccount();
  const { open } = useAppKit();

  // Use wagmi's connection status as the source of truth for contract interactions
  const isConnected = wagmiConnected && appKitConnected;

  // For withdraw transactions
  const {
    writeContract,
    data: hash,
    isPending: isWithdrawing,
    error: withdrawError,
    reset: resetWithdraw,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Show toast notifications for withdraw status
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log("✅ Liquidity withdrawn successfully!", { hash });
      toast.success("Liquidity withdrawn successfully!");
    }
  }, [isConfirmed, hash]);

  useEffect(() => {
    if (receiptError) {
      console.error("❌ Withdraw transaction receipt error:", {
        error: receiptError,
        message: receiptError.message,
        stack: receiptError.stack,
      });
      toast.error("Withdraw transaction failed");
    }
  }, [receiptError]);

  useEffect(() => {
    if (withdrawError) {
      const errorMessage =
        withdrawError instanceof Error
          ? withdrawError.message
          : "Withdraw failed";
      console.error("❌ Withdraw write error:", {
        error: withdrawError,
        message: errorMessage,
        name: withdrawError instanceof Error ? withdrawError.name : "Unknown",
        stack: withdrawError instanceof Error ? withdrawError.stack : undefined,
      });
      toast.error(errorMessage);
    }
  }, [withdrawError]);

  const withdrawLiquidity = async ({
    depositId,
  }: WithdrawLiquidityParams): Promise<void> => {
    console.log("🚀 Starting withdraw liquidity...", {
      depositId: depositId.toString(),
      userAddress: address,
      appKitConnected,
      wagmiConnected,
      connector: connector?.name,
    });

    // Check wagmi connector status first (source of truth for contract calls)
    if (!wagmiConnected || !connector) {
      console.warn("⚠️ Withdraw failed: Wagmi connector not connected", {
        wagmiConnected,
        connector: connector?.name,
      });
      toast.error("Please connect your wallet");
      open();
      return;
    }

    if (!isConnected) {
      console.warn("⚠️ Withdraw failed: Wallet not connected", {
        appKitConnected,
        wagmiConnected,
      });
      toast.error("Please connect your wallet");
      open();
      return;
    }

    if (!address) {
      console.warn("⚠️ Withdraw failed: Wallet address not found");
      toast.error("Wallet address not found");
      return;
    }

    try {
      console.log(
        "📝 Sending withdraw transaction to contract:",
        CONTRACT_ADDRESS
      );
      await writeContract({
        address: CONTRACT_ADDRESS as Address,
        abi: CONTRACT_ABI,
        functionName: "withdrawLiquidiy", // Note: typo in contract function name
        args: [depositId],
      });
      console.log(
        "📤 Withdraw transaction submitted, waiting for confirmation..."
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Withdraw failed";

      // Handle specific connector not connected error
      if (
        error instanceof Error &&
        error.name === "ConnectorNotConnectedError"
      ) {
        console.error("❌ Connector not connected - opening wallet modal");
        toast.error("Wallet disconnected. Please reconnect.");
        open();
        return;
      }

      // Handle execution reverted error
      if (errorMessage.includes("execution reverted")) {
        console.error("❌ Contract execution reverted. Possible reasons:", {
          reasons: [
            "1. Deposit ID doesn't exist",
            "2. Deposit already withdrawn",
            "3. Lock duration not expired",
            "4. Caller is not the deposit owner",
            "5. Insufficient contract balance",
          ],
        });
        toast.error(
          "Transaction reverted. Check if deposit exists and lock period has expired."
        );
        return;
      }

      console.error("❌ Error withdrawing liquidity:", {
        error,
        message: errorMessage,
        params: {
          depositId: depositId.toString(),
        },
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    // Withdraw functions
    withdrawLiquidity,

    // Withdraw states
    isWithdrawing,
    isConfirming,
    isConfirmed,
    hash,
    withdrawError,
    resetWithdraw,

    // Overall loading state
    isLoading: isWithdrawing || isConfirming,

    // Connection states
    isConnected,
    address,
    wagmiConnected,
    appKitConnected,
    openWalletModal: open,
  };
};

