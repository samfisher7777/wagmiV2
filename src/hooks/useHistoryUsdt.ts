import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import {
  apiKey,
  etherscanUrl,
  MOCK_USDT_ADDRESS,
} from "@/configs/constants.ts";
import axios from "axios";
import { ITxHistoryResponse } from "@/configs/types.ts";

const getHistoryUsdtTxFromUserAddress = async (address?: string) => {
  const { data } = await axios.get<ITxHistoryResponse>(
    `${etherscanUrl}?module=account&action=tokentx&contractaddress=${MOCK_USDT_ADDRESS}&address=${address}&page=1&offset=100&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`,
  );

  return data;
};

export const useHistoryUsdt = ({ enabled }: { enabled: boolean }) => {
  const { address } = useAccount();

  const { data, ...rest } = useQuery({
    queryKey: ["useHistoryUSDT", address],
    enabled: !!address && enabled,
    queryFn: () => getHistoryUsdtTxFromUserAddress(address),
    refetchInterval: 10000,
  });

  return { data, ...rest };
};
