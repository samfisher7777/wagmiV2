import "./App.css";
import { MintCarousel } from "@/components/MintCouresel.tsx";
import { Toaster } from "@/components/ui/sonner";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createConfig, http, WagmiProvider as WagmiBaseProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected({ target: "metaMask" })],
  transports: {
    [sepolia.id]: http(),
  },
  multiInjectedProviderDiscovery: false,
});

const WagmiProvider = ({ children }: PropsWithChildren) => (
  <WagmiBaseProvider config={config}> {children}</WagmiBaseProvider>
);

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <WagmiProvider>
        <QueryClientProvider client={queryClient}>
          <MintCarousel />
          <Toaster />
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
