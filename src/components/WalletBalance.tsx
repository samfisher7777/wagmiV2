import { useUserBalanceUSDT } from "@/hooks/useUserBalanceUSDT.ts";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input.tsx";

export const WalletBalance = () => {
  const { data } = useUserBalanceUSDT();
  const [amount, setAmount] = useState<string | undefined>("0");

  useEffect(() => {
    if (data) {
      setAmount(data.formatted);
    }
  }, [data]);

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAmount(e.target.value);
      toast("It's a shame you can't edit your balance so easily", {
        description: "HA-HA it's not that simple",
        action: {
          label: "Return init balance",
          onClick: () => setAmount(data?.formatted),
        },
      });
    },
    [data?.formatted],
  );

  return (
    <div className="flex flex-col justify-center items-center h-[100px]">
      <h3>Your wallet balance</h3>

      <Input
        value={amount}
        type="number"
        className="w-[300px]"
        onChange={onChangeHandler}
      />
    </div>
  );
};
