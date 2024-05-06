import { useAccount } from "wagmi";
import { useCallback, useEffect, useState } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ConnectWallet } from "@/components/ConnectWallet.tsx";
import { WalletBalance } from "@/components/WalletBalance.tsx";
import { MintToken } from "@/components/MintToken.tsx";
import { useQuery } from "@tanstack/react-query";
import { apiKey, etherscanUrl, MOCK_USDT_ADDRESS } from "@/configs/contact.ts";

const getHistoryUsdtTxFromUserAddress = async (address?: string) => {
  const res = await fetch(
    `${etherscanUrl}?module=account&action=tokentx&contractaddress=${MOCK_USDT_ADDRESS}&address=${address}&page=1&offset=100&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`,
  );
  return await res.json();
};

const useHistoryUSDT = () => {
  const { address } = useAccount();
  const { data } = useQuery({
    queryKey: ["useHistoryUSDT", address],
    enabled: !!address,
    queryFn: () => getHistoryUsdtTxFromUserAddress(address),
  });

  const hasTx = data && data.result.length > 0;

  return {
    hasTx,
  };
};

const FinishSection = ({
  scrollToBalanceHandler,
}: {
  scrollToBalanceHandler: () => void;
}) => {
  return (
    <div className="gap-2 flex flex-col items-center justify-center h-full">
      <h3>That's it, look at your balance, it may updated</h3>
      <Button onClick={scrollToBalanceHandler}>Go to balance</Button>
    </div>
  );
};

export const MintCarousel = () => {
  useHistoryUSDT();

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

  const scrollToBalanceHandler = useCallback(() => {
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
            <FinishSection scrollToBalanceHandler={scrollToBalanceHandler} />
          </CarouselItem>
        </CarouselContent>
        {isConnected && canScrollPrev && <CarouselPrevious />}
        {isConnected && canScrollNext && <CarouselNext />}
      </Carousel>
    </div>
  );
};
