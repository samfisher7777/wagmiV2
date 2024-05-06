import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DataTable } from "@/components/DataTable.tsx";
import { ITxHistoryData } from "@/configs/types.ts";
import { useHistoryUsdt } from "@/hooks/useHistoryUsdt.ts";
import { useMemo, useState } from "react";
import { getColumns } from "@/configs/columnConfig.tsx";

export const FinishSection = ({
  scrollToBalanceHandler,
}: {
  scrollToBalanceHandler: () => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data } = useHistoryUsdt({ enabled: isOpen });

  const txHistoryData = useMemo(
    () =>
      data
        ? data.result.map<ITxHistoryData>(
            ({ value, hash, timeStamp, tokenSymbol }) => ({
              value,
              hash,
              timeStamp,
              tokenSymbol,
              status: "Executed",
            }),
          )
        : [],
    [data],
  );

  const columnConfig = useMemo(() => getColumns(), []);

  return (
    <div className="gap-2 flex flex-col items-center justify-center h-full">
      <h3>That's it, look at your balance, it may updated</h3>
      <Sheet onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button>View Transaction History</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Transaction History</SheetTitle>
            <SheetDescription>
              <div className="h-[300px] overflow-auto">
                <DataTable data={txHistoryData} columns={columnConfig} />
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Button onClick={scrollToBalanceHandler}>Go to balance</Button>
    </div>
  );
};
