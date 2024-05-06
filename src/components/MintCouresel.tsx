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
import { ConnectWallet } from "@/components/ConnectWallet.tsx";
import { WalletBalance } from "@/components/WalletBalance.tsx";
import { MintToken } from "@/components/MintToken.tsx";
import { FinishSection } from "@/components/FinishSection.tsx";

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
