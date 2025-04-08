import { AuthKitProvider } from "@farcaster/auth-kit";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { RaffleProvider } from "@/context/RaffleContext.jsx";
import { MessageProvider } from "./context/MessageContext";
import { router } from "@/router";
import Web3Provider from "@/utils/Web3Provider.jsx";

import "@farcaster/auth-kit/styles.css";
import "@/index.css";

// Determine if we're in a Frame/Mini App context by checking the URL
const isInFrameContext = () => {
  if (typeof window !== "undefined") {
    return window.location.pathname.startsWith("/frame/");
  }
  return false;
};

const authConfig = {
  rpcUrl: "https://mainnet.optimism.io",
  domain: window.location.host,
  siweUri: `${window.location.origin}/login`,
};

// Create root
const container = document.getElementById("root");
const root = createRoot(container);

// Full application mode with all providers
root.render(
  <StrictMode>
    <AuthKitProvider config={authConfig}>
      <Web3Provider>
        <MessageProvider>
          <RaffleProvider>
            <RouterProvider router={router} />
          </RaffleProvider>
        </MessageProvider>
      </Web3Provider>
    </AuthKitProvider>
  </StrictMode>
);
