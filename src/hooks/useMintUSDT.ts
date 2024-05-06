import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useCallback } from "react";
import { parseUnits } from "viem";
import {
  LOCALSTORAGE_NEW_TX_KEY,
  MOCK_USDT_ADDRESS,
} from "@/configs/constants.ts";
import { USDT_MOCK_ABI } from "@/configs/usdt_mock_abi.ts";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ITxHistoryData } from "@/configs/types.ts";

export const useLocalStorageTx = () => {
  const [txPending, setTxPending] = useLocalStorage<
    Record<string, ITxHistoryData>
  >(`${LOCALSTORAGE_NEW_TX_KEY}`, {});

  return { txPending, setTxPending };
};

export const useMintUSDT = () => {
  const { setTxPending } = useLocalStorageTx();

  const {
    writeContract,
    status: walletStatus,
    data: hash,
  } = useWriteContract({
    mutation: {
      onSuccess: (txHash, { args }) => {
        setTxPending((prev) =>
          prev
            ? {
                ...prev,
                [txHash]: {
                  hash: txHash,
                  status: "Pending",
                  value: args?.[0]?.toString() ?? "0",
                  timeStamp: "",
                  tokenSymbol: "USDT",
                },
              }
            : prev,
        );
      },
    },
  });

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
