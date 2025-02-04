import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [connectionError, setConnectionError] = useState("");

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { address, isConnected: accountConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (accountConnected && address) {
      setWalletAddress(address);
      setIsConnected(true);
    } else {
      setWalletAddress("");
      setIsConnected(false);
    }
  }, [accountConnected, address]);

  // Debugging
  // WalletContext.jsx
  useEffect(() => {
    console.log("Account connected:", accountConnected);
    console.log("Wallet address:", address);
  }, [accountConnected, address]);

  useEffect(() => {
    if (error) {
      setConnectionError(error.message);
    }
  }, [error]);

  const connectWallet = async (connector) => {
    try {
      await connect(connector);
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setConnectionError("Failed to connect wallet.");
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setWalletAddress("");
    setIsConnected(false);
    setConnectionError("");
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        connectors,
        connectWallet,
        disconnectWallet,
        isLoading,
        connectionError,
        pendingConnector,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

WalletProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { WalletContext };
