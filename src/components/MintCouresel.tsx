import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";

const Paywall = ({ children }: { children: ReactNode }) => {
  const isAuth = true;

  return <>{isAuth ? children : "Connect your wallet"}</>;
};

const ConnectWallet = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Button> Connect Wallet </Button>
    </div>
  );
};

const WalletBalance = () => {
  const init = 1230;
  const [amount, setAmount] = useState(init);
  return (
    <div className="flex flex-col justify-center items-center h-[100px]">
      <h3>Yore wallet balance</h3>

      <Input
        value={amount}
        type="number"
        className="w-[300px]"
        onChange={(e) => {
          setAmount(+e.target.value);
          toast("It's a shame you can't edit your balance so easily", {
            description: "HA-HA it's not that simple",
            action: {
              label: "Return init balance",
              onClick: () => setAmount(init),
            },
          });
        }}
      />
    </div>
  );
};

const MintToken = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[100px] gap-1">
      <Input className="w-[300px]" type="number" />
      <Button>mint?</Button>
    </div>
  );
};
export const MintCarousel = () => (
  <div className=" flex flex-col items-center justify-center h-full">
    <Carousel>
      <CarouselContent className=" w-[400px]">
        <CarouselItem>
          <ConnectWallet />
        </CarouselItem>
        <CarouselItem>
          <Paywall>
            <WalletBalance />
          </Paywall>
        </CarouselItem>
        <CarouselItem>
          <Paywall>
            <MintToken />
          </Paywall>
        </CarouselItem>
        <CarouselItem>
          <Paywall>
            <div className="gap-2 flex flex-col items-center justify-center h-full">
              <h3>That's it, look at your balance, it may updated</h3>
              <Button>Go to balance</Button>
            </div>
          </Paywall>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);
