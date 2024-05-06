import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useLocalStorageTx } from "@/hooks/useMintUSDT.ts";
import { useCallback } from "react";

export const ConnectWallet = () => {
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const { setTxPending } = useLocalStorageTx();

  const disconnectHandler = useCallback(() => {
    disconnect();
    setTxPending({});
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {isConnected ? (
        <Button onClick={disconnectHandler}>Disconnect</Button>
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
