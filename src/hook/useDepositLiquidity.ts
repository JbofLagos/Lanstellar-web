/**
 * Hook for depositing liquidity to the contract
 *
 * @example
 * const { depositLiquidity, isDepositing, isConfirmed } = useDepositLiquidity();
 *
 * await depositLiquidity({
 *   tokenAddress: "0x...",
 *   amount: parseUnits("100", 18), // 100 tokens
 *   lockDuration: 3, // 3 months (will be converted to seconds)
 *   interestBP: 1200n, // 12% in basis points
 * });
 */

import { useEffect, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContract,
} from "wagmi";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { toast } from "sonner";
import type { Address } from "viem";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  ERC20_ABI,
} from "@/constant/contractABI";

interface DepositLiquidityParams {
  tokenAddress: Address;
  amount: bigint;
  lockDuration: number; // Duration in months (will be converted to seconds)
  interestBP: bigint;
  value?: bigint; // For native token deposits
}

export const useDepositLiquidity = () => {
  const { isConnected: appKitConnected, address } = useAppKitAccount();
  const { isConnected: wagmiConnected, connector } = useAccount();
  const { open } = useAppKit();

  // Track approval and deposit states
  const [isApproving, setIsApproving] = useState(false);
  const [currentTokenAddress, setCurrentTokenAddress] =
    useState<Address | null>(null);

  // Use wagmi's connection status as the source of truth for contract interactions
  const isConnected = wagmiConnected && appKitConnected;

  // For approval transactions
  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApprovePending,
    error: approveError,
    reset: resetApprove,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  // For deposit transactions
  const {
    writeContract,
    data: hash,
    isPending: isDepositing,
    error: depositError,
    reset: resetDeposit,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Check current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: currentTokenAddress || undefined,
    abi: ERC20_ABI,
    functionName: "allowance",
    args:
      address && currentTokenAddress
        ? [address as Address, CONTRACT_ADDRESS as Address]
        : undefined,
    query: {
      enabled: !!address && !!currentTokenAddress,
    },
  });

  // Check token balance
  const { data: tokenBalance } = useReadContract({
    address: currentTokenAddress || undefined,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address as Address] : undefined,
    query: {
      enabled: !!address && !!currentTokenAddress,
    },
  });

  // Show toast notifications for approval status
  useEffect(() => {
    if (isApproveConfirmed && approveHash) {
      console.log("✅ Token approved successfully!", { hash: approveHash });
      toast.success("Token approved! Now depositing...");
      setIsApproving(false);
      refetchAllowance();
    }
  }, [isApproveConfirmed, approveHash, refetchAllowance]);

  useEffect(() => {
    if (approveError) {
      const errorMessage =
        approveError instanceof Error
          ? approveError.message
          : "Approval failed";
      console.error("❌ Approval error:", {
        error: approveError,
        message: errorMessage,
      });
      toast.error(`Approval failed: ${errorMessage}`);
      setIsApproving(false);
    }
  }, [approveError]);

  // Show toast notifications for deposit status
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log("✅ Liquidity deposited successfully!", { hash });
      toast.success("Liquidity deposited successfully!");
    }
  }, [isConfirmed, hash]);

  useEffect(() => {
    if (receiptError) {
      console.error("❌ Deposit transaction receipt error:", {
        error: receiptError,
        message: receiptError.message,
        stack: receiptError.stack,
      });
      toast.error("Deposit transaction failed");
    }
  }, [receiptError]);

  useEffect(() => {
    if (depositError) {
      const errorMessage =
        depositError instanceof Error ? depositError.message : "Deposit failed";
      console.error("❌ Deposit write error:", {
        error: depositError,
        message: errorMessage,
        name: depositError instanceof Error ? depositError.name : "Unknown",
        stack: depositError instanceof Error ? depositError.stack : undefined,
      });
      toast.error(errorMessage);
    }
  }, [depositError]);

  // Approve token spending
  const approveToken = async (
    tokenAddress: Address,
    amount: bigint
  ): Promise<void> => {
    console.log("🔓 Approving token...", {
      tokenAddress,
      amount: amount.toString(),
      spender: CONTRACT_ADDRESS,
    });

    setIsApproving(true);
    try {
      await writeApprove({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESS as Address, amount],
      });
      console.log("📤 Approval transaction submitted...");
    } catch (error) {
      setIsApproving(false);
      throw error;
    }
  };

  const depositLiquidity = async ({
    tokenAddress,
    amount,
    lockDuration,
    interestBP,
    value,
  }: DepositLiquidityParams): Promise<void> => {
    // Set current token for allowance check
    setCurrentTokenAddress(tokenAddress);

    // Convert lockDuration from months to seconds
    // Assuming 30 days per month: months * 30 days * 24 hours * 60 minutes * 60 seconds
    const lockDurationSeconds = BigInt(
      Math.floor(lockDuration * 30 * 24 * 60 * 60)
    );

    console.log("🚀 Starting deposit liquidity...", {
      tokenAddress,
      amount: amount.toString(),
      lockDurationMonths: lockDuration,
      lockDurationSeconds: lockDurationSeconds.toString(),
      interestBP: interestBP.toString(),
      value: value?.toString(),
      userAddress: address,
      appKitConnected,
      wagmiConnected,
      connector: connector?.name,
      currentAllowance: allowance?.toString(),
      tokenBalance: tokenBalance?.toString(),
    });

    // Check wagmi connector status first (source of truth for contract calls)
    if (!wagmiConnected || !connector) {
      console.warn("⚠️ Deposit failed: Wagmi connector not connected", {
        wagmiConnected,
        connector: connector?.name,
      });
      toast.error("Please connect your wallet");
      open();
      return;
    }

    if (!isConnected) {
      console.warn("⚠️ Deposit failed: Wallet not connected", {
        appKitConnected,
        wagmiConnected,
      });
      toast.error("Please connect your wallet");
      open();
      return;
    }

    if (!address) {
      console.warn("⚠️ Deposit failed: Wallet address not found");
      toast.error("Wallet address not found");
      return;
    }

    // Check token balance
    if (tokenBalance !== undefined && tokenBalance < amount) {
      console.warn("⚠️ Insufficient token balance", {
        balance: tokenBalance.toString(),
        required: amount.toString(),
      });
      toast.error("Insufficient token balance");
      return;
    }

    // Check and request approval if needed
    const currentAllowance = allowance as bigint | undefined;
    if (currentAllowance !== undefined && currentAllowance < amount) {
      console.log("🔐 Insufficient allowance, requesting approval...", {
        currentAllowance: currentAllowance.toString(),
        required: amount.toString(),
      });
      toast.info("Approving token spending...");

      try {
        // Approve max amount to avoid future approvals
        const maxApproval = BigInt(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
        await approveToken(tokenAddress, maxApproval);
        toast.info(
          "Please confirm the approval in your wallet, then try depositing again."
        );
        return; // User needs to call deposit again after approval confirms
      } catch (error) {
        console.error("❌ Approval failed:", error);
        return;
      }
    }

    try {
      console.log(
        "📝 Sending deposit transaction to contract:",
        CONTRACT_ADDRESS
      );
      await writeContract({
        address: CONTRACT_ADDRESS as Address,
        abi: CONTRACT_ABI,
        functionName: "depositLiquidity",
        args: [
          tokenAddress,
          amount,
          lockDurationSeconds, // uint64 lockDuration in seconds
          interestBP, // uint64 interestBP
        ],
        value,
      });
      console.log(
        "📤 Deposit transaction submitted, waiting for confirmation..."
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Deposit failed";

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
            "1. Token not supported by contract",
            "2. Insufficient token balance",
            "3. Insufficient allowance",
            "4. Invalid lock duration",
            "5. Invalid interest basis points",
          ],
        });
        toast.error(
          "Transaction reverted. Check if token is supported and parameters are valid."
        );
        return;
      }

      console.error("❌ Error depositing liquidity:", {
        error,
        message: errorMessage,
        params: {
          tokenAddress,
          amount: amount.toString(),
          lockDurationMonths: lockDuration,
          lockDurationSeconds: lockDurationSeconds.toString(),
          interestBP: interestBP.toString(),
        },
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    // Deposit functions
    depositLiquidity,
    approveToken,

    // Deposit states
    isDepositing,
    isConfirming,
    isConfirmed,
    hash,
    depositError,
    resetDeposit,

    // Approval states
    isApproving: isApproving || isApprovePending || isApproveConfirming,
    isApproveConfirmed,
    approveHash,
    approveError,
    resetApprove,

    // Token states
    allowance: allowance as bigint | undefined,
    tokenBalance: tokenBalance as bigint | undefined,
    refetchAllowance,

    // Overall loading state
    isLoading:
      isDepositing ||
      isConfirming ||
      isApproving ||
      isApprovePending ||
      isApproveConfirming,

    // Connection states
    isConnected,
    address,
    wagmiConnected,
    appKitConnected,
    openWalletModal: open,
  };
};
