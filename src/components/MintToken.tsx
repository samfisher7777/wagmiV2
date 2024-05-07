import { useMintUSDT } from "@/hooks/useMintUSDT.ts";
import { useUserBalanceUSDT } from "@/hooks/useUserBalanceUSDT.ts";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAccount, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";

const Web3ButtonValidation = ({ children }: { children: ReactNode }) => {
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();

  if (!chain || (chain && chain.id !== sepolia.id)) {
    return (
      <Button onClick={() => switchChain({ chainId: sepolia.id })}>
        Switch network to Sepolia
      </Button>
    );
  }

  return children;
};

export const MintToken = () => {
  const { mintUsdt, isLoading, isSuccess } = useMintUSDT();
  const { refetch } = useUserBalanceUSDT();
  const [amount, setAmount] = useState<undefined | number>(1);

  const mintHandler = useCallback(() => {
    if (amount) {
      mintUsdt(amount);
    }
  }, [amount]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col items-center justify-center h-[100px] gap-1">
      <Input
        className="w-[300px]"
        type="number"
        value={amount}
        onChange={(e) => setAmount(+e.target.value)}
      />
      <Web3ButtonValidation>
        <Button disabled={isLoading} onClick={mintHandler}>
          mint?
        </Button>
      </Web3ButtonValidation>
    </div>
  );
};
