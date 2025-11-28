import type React from "react";
import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";
import { baseSepolia } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// 0. Setup queryClient
const queryClient = new QueryClient();

  // type AppKitNetwork =
  //   | typeof baseSepolia
  //   | typeof base
  //   | typeof mainnet
  //   | typeof arbitrum;

// 1. Get projectId from https://dashboard.reown.com
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

// 2. Create a metadata object - optional
const metadata = {
  name: "Lanstellar",
  description: "Lanstellar",
  url: "https://lanstellar.com", // origin must match your domain & subdomain
  icons: ["/logo.svg"],
};

// 3. Set the networks - baseSepolia is the default for development
const networks = [baseSepolia];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: baseSepolia, // Force Base Sepolia as default
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  const config = wagmiAdapter.wagmiConfig;
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
