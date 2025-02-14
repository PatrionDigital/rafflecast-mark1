import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import Web3Provider from "./utils/Web3Provider.jsx";
import { RaffleProvider } from "./context/RaffleContext.jsx";

import "@farcaster/auth-kit/styles.css";
import "./index.css";

import App from "./App.jsx";

const authConfig = {
  rpcUrl: "https://mainnet.optimism.io",
  domain: "localhost:5137",
  siweUri: "localhost:5137/login",
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthKitProvider config={authConfig}>
      <Web3Provider>
        <RaffleProvider>
          <App />
        </RaffleProvider>
      </Web3Provider>
    </AuthKitProvider>
  </StrictMode>
);
