/**
 * Hook for interacting with smart contracts using wagmi
 *
 * @example
 * // Write to contract
 * const { writeContract, isWriting, isConfirmed } = useBlockchain({
 *   contractAddress: "0x...",
 *   abi: contractABI,
 * });
 *
 * await writeContract("addLiquidity", [amount, duration]);
 *
 * @example
 * // Read from contract
 * const { data } = useReadContractData(
 *   "0x...",
 *   contractABI,
 *   "getLiquidity",
 *   [userAddress]
 * );
 */

import { useEffect } from "react";
import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "sonner";
import type { Address } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constant/contractABI";

interface UseBlockchainProps {
  contractAddress: Address;
}

export const useBlockchain = ({ contractAddress = CONTRACT_ADDRESS as Address }: UseBlockchainProps) => {
  const { isConnected, address } = useAppKitAccount();

  const {
    writeContract,
    data: hash,
    isPending: isWriting,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Show toast notifications for transaction status
  useEffect(() => {
    if (isConfirmed && hash) {
      toast.success("Transaction confirmed!");
    }
  }, [isConfirmed, hash]);

  useEffect(() => {
    if (receiptError) {
      toast.error("Transaction failed");
    }
  }, [receiptError]);

  useEffect(() => {
    if (writeError) {
      const errorMessage =
        writeError instanceof Error ? writeError.message : "Transaction failed";
      toast.error(errorMessage);
    }
  }, [writeError]);

  // Write contract function
  const writeContractFunction = async (
    functionName: string,
    args?: unknown[],
    value?: bigint
  ): Promise<void> => {
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!address) {
      toast.error("Wallet address not found");
      return;
    }

    try {
      await writeContract({
        address: contractAddress,
        abi: CONTRACT_ABI,
        functionName,
        args: args || [],
        value,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Transaction failed";
      console.error("Error writing to contract:", error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Helper to read contract data (use this in components with useReadContract)
  const getReadContractConfig = (functionName: string, args?: unknown[]) => ({
    address: contractAddress,
    abi: CONTRACT_ABI,
    functionName,
    args: args || [],
    query: {
      enabled: isConnected,
    },
  });

  return {
    // Contract info
    contractAddress,
    abi: CONTRACT_ABI,
    isConnected,
    address,

    // Write functions
    writeContract: writeContractFunction,
    isWriting,
    isConfirming,
    isConfirmed,
    hash,
    writeError,
    resetWrite,

    // Read helper
    getReadContractConfig,

    // Status
    isLoading: isWriting || isConfirming,
  };
};

// Hook for reading contract data (use this in components)
export const useReadContractData = <T = unknown>(
  contractAddress: Address,
  functionName: string,
  args?: unknown[],
  enabled: boolean = true
) => {
  const { isConnected } = useAppKitAccount();

  return useReadContract({
    address: contractAddress,
    abi: CONTRACT_ABI,
    functionName,
    args: args || [],
    query: {
      enabled: enabled && isConnected,
    },
  }) as {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
};
