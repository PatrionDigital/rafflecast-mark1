// wagmiConfig.js
import PropTypes from "prop-types";
import { WagmiProvider, http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

// Create the Wagmi config

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [base],
    transports: {
      // RPC URL for each chain
      [base.id]: http("https://mainnet.base.org"),
    },

    // Required API Keys
    walletConnectProjectId: "f527dbe96a45f7e9b5d3f52b476b2d55",

    // Required App Info
    appName: "Rafflecast",

    // Optional App Info
    appDescription: "Raffles for Farcaster",
    appUrl: "https://rafflecast.xyz",
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

Web3Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Web3Provider;
