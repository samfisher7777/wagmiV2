import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useConnect,
  useDisconnect,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { MOCK_USDT_ADDRESS } from "@/configs/contact.ts";
import { USDT_MOCK_ABI } from "@/configs/usdt_mock_abi.ts";
import { parseUnits } from "viem";

const ConnectWallet = () => {
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {isConnected ? (
        <Button onClick={() => disconnect()}>Disconnect</Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Connect Wallet</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Choose your wallet</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {connectors.map((connector) => (
              <DropdownMenuItem
                key={connector.uid}
                onClick={() => connect({ connector })}
              >
                {connector.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

const useUserBalanceUSDT = () => {
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

const WalletBalance = () => {
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
const useMintUSDT = () => {
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

const MintToken = () => {
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
      <Button disabled={isLoading} onClick={mintHandler}>
        mint?
      </Button>
    </div>
  );
};
export const MintCarousel = () => {
  const { isConnected } = useAccount();
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollNext, setCanScrollNext] = useState<boolean>(false);
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCanScrollNext(api.canScrollNext());
    setCanScrollPrev(api.canScrollPrev());

    api.on("select", (emblaApi) => {
      setCanScrollNext(emblaApi.canScrollNext());
      setCanScrollPrev(emblaApi.canScrollPrev());
    });
  }, [api]);

  const scrollToBalanceHednler = useCallback(() => {
    if (!api) {
      return;
    }

    api.scrollTo(1);
  }, [api]);

  return (
    <div className=" flex flex-col items-center justify-center h-full">
      <Carousel setApi={setApi}>
        <CarouselContent className=" w-[400px]">
          <CarouselItem>
            <ConnectWallet />
          </CarouselItem>
          <CarouselItem>
            <WalletBalance />
          </CarouselItem>
          <CarouselItem>
            <MintToken />
          </CarouselItem>
          <CarouselItem>
            <div className="gap-2 flex flex-col items-center justify-center h-full">
              <h3>That's it, look at your balance, it may updated</h3>
              <Button onClick={scrollToBalanceHednler}>Go to balance</Button>
            </div>
          </CarouselItem>
        </CarouselContent>
        {isConnected && canScrollPrev && <CarouselPrevious />}
        {isConnected && canScrollNext && <CarouselNext />}
      </Carousel>
    </div>
  );
};
