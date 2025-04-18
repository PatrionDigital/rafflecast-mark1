// src/utils/Web3Provider.jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import PropTypes from "prop-types";
import { WagmiProvider, http, createConfig } from "wagmi";
import { base } from "wagmi/chains";

// Create the Wagmi config
const configOptions = getDefaultConfig({
  // Your dApps chains
  chains: [base],
  transports: {
    // RPC URL for each chain
    [base.id]: http("https://mainnet.base.org"),
  },

  // Required API Keys
  walletConnectProjectId: "f527dbe96a45f7e9b5d3f52b476b2d55",

  // Required App Info
  appName: "SecondOrder.fun",

  // Optional App Info
  appDescription: "Raffles for Farcaster",
  appUrl: "https://secondorder.fun",
  appIcon: "https://secondorder.fun/images/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
});

const config = createConfig(configOptions);

// Make wagmi config available globally for the frame provider
if (typeof window !== "undefined") {
  window.wagmiConfig = config;
}

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
