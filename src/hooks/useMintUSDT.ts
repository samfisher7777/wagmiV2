import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useCallback } from "react";
import { parseUnits } from "viem";
import { MOCK_USDT_ADDRESS } from "@/configs/contact.ts";
import { USDT_MOCK_ABI } from "@/configs/usdt_mock_abi.ts";

export const useMintUSDT = () => {
  const {
    writeContract,
    status: walletStatus,
    data: hash,
  } = useWriteContract();

  const mintUsdt = useCallback((amount: number) => {
    const bigIntAmount = parseUnits(amount.toString(), 6);
    writeContract({
      address: MOCK_USDT_ADDRESS,
      abi: USDT_MOCK_ABI,
      functionName: "mint",
      args: [bigIntAmount],
    });
  }, []);

  const { status: txStatus } = useWaitForTransactionReceipt({ hash });

  const isLoading = walletStatus === "pending";
  const isSuccess = txStatus === "success";

  return { mintUsdt, isLoading, isSuccess };
};
