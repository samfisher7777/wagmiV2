import { createColumnHelper } from "@tanstack/react-table";
import { ITxHistoryData } from "@/configs/types.ts";
import dayjs from "dayjs";
import { txExplorer } from "@/lib/utils.ts";
import { formatUnits } from "viem";
import { USDT_DECIMALS } from "@/configs/constants.ts";
import { ExternalLinkIcon } from "@/assets/ExternalLinkIcon";

export const getColumns = () => {
  const clumnHelper = createColumnHelper<ITxHistoryData>();

  return [
    clumnHelper.accessor("status", {
      header: () => "Status",
    }),
    clumnHelper.accessor((data) => data, {
      id: "date",
      header: () => "Date",
      cell: (info) => {
        const { timeStamp } = info.getValue();
        return dayjs(+timeStamp * 1000).format("DD/MM/YY - HH:mm");
      },
    }),
    clumnHelper.accessor("hash", {
      header: () => "Hash",
      cell: (info) => {
        const hash = info.getValue();

        return (
          <div className="flex gap-3">
            <a
              href={txExplorer(hash)}
              target="_blank"
              className="cursor-pointer hover:opacity-50"
            >
              <ExternalLinkIcon />
            </a>
            {hash}
          </div>
        );
      },
    }),
    clumnHelper.accessor((data) => data, {
      id: "value",
      header: () => "Value",
      cell: (info) => {
        const { value, tokenSymbol } = info.getValue();
        const formated = formatUnits(BigInt(value), USDT_DECIMALS);
        return `${formated} ${tokenSymbol}`;
      },
    }),
  ];
};
