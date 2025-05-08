// src/utils/Web3Provider.jsx - Final version with proper error handling
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { WagmiProvider, http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Create a context for Zora SDK
const ZoraSDKContext = createContext(null);

// Create the Wagmi config with Base chain support
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
  connectors: [injected()],
});

// Make wagmi config available globally for the frame provider
if (typeof window !== "undefined") {
  window.wagmiConfig = config;
}

const queryClient = new QueryClient();

// Hook to access the Zora SDK
export const useZoraSDK = () => useContext(ZoraSDKContext);

const Web3Provider = ({ children }) => {
  const [zoraSdk, setZoraSdk] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Initialize the Zora SDK when the component mounts
  useEffect(() => {
    const setupZoraSDK = async () => {
      try {
        setIsInitializing(true);
        
        // Load the SDK dynamically to avoid issues if it's not properly installed
        const zoraModule = await import("@zoralabs/coins-sdk").catch(e => {
          console.error("Error importing Zora SDK:", e);
          throw new Error("Failed to import Zora SDK. Please check the package installation.");
        });
        
        // Get the provider from the Wagmi config
        const provider = await config.getProvider({ chainId: base.id });
        
        if (!provider) {
          throw new Error("Failed to get provider from Wagmi config");
        }
        
        // Initialize the SDK with the provider
        // Note: We're using a try/catch here in case the SDK's API has changed
        let sdk;
        try {
          // Try the expected method first
          if (typeof zoraModule.createCoinsSDK === 'function') {
            sdk = await zoraModule.createCoinsSDK({
              provider,
              chainId: base.id,
            });
          } 
          // Fallback method if the API is different
          else if (typeof zoraModule.CoinsSDK === 'function') {
            sdk = new zoraModule.CoinsSDK({
              provider,
              chainId: base.id,
            });
          }
          else {
            throw new Error("Could not find Zora SDK constructor");
          }
        } catch (sdkError) {
          console.error("Error initializing Zora SDK:", sdkError);
          throw new Error(`Zora SDK initialization failed: ${sdkError.message}`);
        }
        
        if (!sdk) {
          throw new Error("SDK initialization returned null or undefined");
        }
        
        setZoraSdk(sdk);
        
        // Make the SDK available globally (for convenience)
        if (typeof window !== "undefined") {
          window.zoraSdk = sdk;
        }
        
        console.log("Zora SDK initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Zora SDK:", error);
        setError(error.message || "Unknown error initializing Zora SDK");
      } finally {
        setIsInitializing(false);
      }
    };
    
    setupZoraSDK();
    
    // Cleanup when the component unmounts
    return () => {
      setZoraSdk(null);
      if (typeof window !== "undefined") {
        window.zoraSdk = null;
      }
    };
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <ZoraSDKContext.Provider value={{ 
            sdk: zoraSdk, 
            isInitializing, 
            error,
            isReady: !isInitializing && zoraSdk !== null && !error
          }}>
            {children}
          </ZoraSDKContext.Provider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

Web3Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Web3Provider;