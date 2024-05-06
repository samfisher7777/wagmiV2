import { useAccount, useBalance, useBlockNumber } from "wagmi";
import { MOCK_USDT_ADDRESS } from "@/configs/constants.ts";
import { useEffect } from "react";

export const useUserBalanceUSDT = () => {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data, queryKey, refetch, ...rest } = useBalance({
    address,
    token: MOCK_USDT_ADDRESS,
  });

  useEffect(() => {
    if (Number(blockNumber) % 4 === 0) {
      refetch();
    }
  }, [blockNumber]);

  return { data, refetch, ...rest };
};
