/**
 * Hook for fetching user deposit IDs from the contract
 *
 * @example
 * const { depositIds, isLoading, refetch } = useUserDepositIds();
 *
 * // Get all deposit IDs for the connected user
 * depositIds.forEach((depositId) => {
 *   console.log("Deposit ID:", depositId.toString());
 * });
 *
 * @example
 * // Get deposit ID for a specific user address
 * const { depositIds } = useUserDepositIds({ userAddress: "0x..." });
 */

import { useState, useEffect, useCallback } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constant/contractABI";
import type { Address } from "viem";

interface UseUserDepositIdsOptions {
  userAddress?: Address;
  maxDeposits?: number; // Maximum number of deposits to fetch (default: 100)
  enabled?: boolean; // Whether to enable the query
}

export const useUserDepositIds = (options?: UseUserDepositIdsOptions) => {
  const { address: appKitAddress } = useAppKitAccount();
  const { address: wagmiAddress } = useAccount();
  const publicClient = usePublicClient();
  
  // Use provided address or fall back to connected wallet address
  const userAddress = (options?.userAddress || appKitAddress || wagmiAddress) as Address | undefined;
  const maxDeposits = options?.maxDeposits ?? 100;
  const enabled = options?.enabled !== false && !!userAddress;

  const [depositIds, setDepositIds] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all deposit IDs using public client for batch reads
  const fetchAllDepositIds = useCallback(async () => {
    if (!enabled || !userAddress || !publicClient) {
      setDepositIds([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const ids: bigint[] = [];

    try {
      console.log("📥 Fetching user deposit IDs...", {
        userAddress,
        maxDeposits,
      });

      // Query deposit IDs incrementally until we get zero or reach max
      for (let index = 0; index < maxDeposits; index++) {
        try {
          const depositId = await publicClient.readContract({
            address: CONTRACT_ADDRESS as Address,
            abi: CONTRACT_ABI,
            functionName: "userDepositIds",
            args: [userAddress, BigInt(index)],
          });

          // If deposit ID is zero, we've reached the end
          if (depositId === 0n) {
            console.log(`✅ Reached end of deposits at index ${index}`);
            break;
          }

          // Add deposit ID if not already present
          if (!ids.includes(depositId as bigint)) {
            ids.push(depositId as bigint);
            console.log(`✅ Found deposit ID ${depositId?.toString()} at index ${index}`);
          }
        } catch (err: unknown) {
          // If query fails, we've likely reached the end
          // Some contracts might revert instead of returning zero
          console.log(`⚠️ Query failed at index ${index}, assuming end of deposits`, err);
          break;
        }
      }

      // Sort deposit IDs
      ids.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

      setDepositIds(ids);
      console.log(`✅ Fetched ${ids.length} deposit IDs`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch deposit IDs");
      setError(error);
      console.error("❌ Error fetching deposit IDs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, enabled, maxDeposits, publicClient]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchAllDepositIds();
  }, [fetchAllDepositIds]);

  // Refetch function
  const refetch = useCallback(() => {
    fetchAllDepositIds();
  }, [fetchAllDepositIds]);

  return {
    depositIds,
    isLoading,
    error,
    refetch,
    userAddress,
    count: depositIds.length,
  };
};
