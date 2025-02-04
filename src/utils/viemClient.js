// src/utils/viemClient.js
import { createWalletClient, http } from "viem";
import { base, optimism } from "viem/chains";

const getWalletClient = (chainId) => {
  const chain = chainId === 10 ? optimism : base; // Default to Base if chainId is not specified
  return createWalletClient({
    chain,
    transport: http(), // Use default provider or pass a custom RPC URL
  });
};

export default getWalletClient;
