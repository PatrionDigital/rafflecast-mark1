import { AuthKitProvider } from "@farcaster/auth-kit";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { RaffleProvider } from "@/context/RaffleContext.jsx";
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

// In Frame/Mini App context, render with minimal wrapper
if (isInFrameContext()) {
  console.log("Detected Mini App context - using simplified rendering");

  // Mini App mode - skip wrapper components that might cause CSP issues
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
} else {
  // Full application mode with all providers
  root.render(
    <StrictMode>
      <AuthKitProvider config={authConfig}>
        <Web3Provider>
          <RaffleProvider>
            <RouterProvider router={router} />
          </RaffleProvider>
        </Web3Provider>
      </AuthKitProvider>
    </StrictMode>
  );
}
