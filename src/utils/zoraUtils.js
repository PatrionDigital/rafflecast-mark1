// src/utils/zoraUtils.js
import {
  tradeCoin,
  simulateBuy,
  getTradeFromLogs,
  tradeCoinCall,
} from "@zoralabs/coins-sdk";
import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { base } from "viem/chains";

/**
 * Configuration for the Zora SDK
 */
const ZORA_CONFIG = {
  // Default to Base network (Ethereum chain ID 8453)
  chainId: base.id,
  // API endpoint - would use real endpoints in production
  apiEndpoint: "https://api.zora.co/coins",
  // Rate limits and throttling configuration
  maxRequestsPerMinute: 60,
};

/**
 * Initialize wallet and public clients
 * @param {string} rpcUrl - RPC URL to use for connection
 * @param {string} accountAddress - Account address to use for wallet client
 * @returns {Object} Object containing walletClient and publicClient
 */
export const initClients = (rpcUrl, accountAddress) => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(rpcUrl),
  });

  const walletClient = createWalletClient({
    account: accountAddress,
    chain: base,
    transport: http(rpcUrl),
  });

  return { publicClient, walletClient };
};

/**
 * Error handling wrapper for SDK calls
 * @param {Function} sdkCall - Async function making SDK call
 * @param {string} errorMessage - Custom error message prefix
 * @returns {Promise<any>} Result of the SDK call
 */
export const safeSDKCall = async (
  sdkCall,
  errorMessage = "SDK call failed"
) => {
  try {
    return await sdkCall();
  } catch (error) {
    console.error(`${errorMessage}:`, error);

    // Categorize errors for better user feedback
    if (
      error.message?.includes("network") ||
      error.message?.includes("connection")
    ) {
      throw new Error(`Network error: Please check your connection`);
    }

    if (error.message?.includes("rate limit")) {
      throw new Error(`Rate limited: Please try again in a moment`);
    }

    throw new Error(`${errorMessage}: ${error.message}`);
  }
};

/**
 * Buy coins using the tradeCoin function from Zora SDK
 * @param {Object} params - Buy parameters
 * @param {Address} params.coinAddress - The coin contract address
 * @param {Address} params.recipientAddress - Address to receive the purchased coins
 * @param {string|number} params.amountInETH - Amount of ETH to spend (will be parsed with parseEther)
 * @param {bigint|string|number} params.minAmountOut - Minimum amount of coins to receive (optional)
 * @param {Address} params.referrerAddress - Optional referrer address
 * @param {Object} walletClient - Viem wallet client
 * @param {Object} publicClient - Viem public client
 * @returns {Promise<Object>} Transaction result
 */
export const buyCoin = async (params, walletClient, publicClient) => {
  const {
    coinAddress,
    recipientAddress,
    amountInETH,
    minAmountOut,
    referrerAddress,
  } = params;

  if (!coinAddress || !recipientAddress || !amountInETH) {
    throw new Error("Missing required parameters for coin purchase");
  }

  // Mock implementation for development without clients
  if (!walletClient || !publicClient) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      hash: `0x${Math.random().toString(16).slice(2, 42)}`,
      trade: {
        coinAmount: parseEther((amountInETH * 1000).toString()), // Simulated coin amount
        ethAmount: parseEther(amountInETH.toString()),
        recipient: recipientAddress,
        timestamp: Math.floor(Date.now() / 1000),
      },
    };
  }

  // Actual implementation using tradeCoin
  return safeSDKCall(async () => {
    const buyParams = {
      direction: "buy",
      target: coinAddress,
      args: {
        recipient: recipientAddress,
        orderSize: parseEther(amountInETH.toString()),
        minAmountOut: minAmountOut
          ? typeof minAmountOut === "bigint"
            ? minAmountOut
            : parseEther(minAmountOut.toString())
          : 0n,
        tradeReferrer:
          referrerAddress || "0x0000000000000000000000000000000000000000",
      },
    };

    return await tradeCoin(buyParams, walletClient, publicClient);
  }, `Failed to buy coin ${coinAddress}`);
};

/**
 * Simulate a coin purchase to see expected output
 * @param {Object} params - Simulation parameters
 * @param {Address} params.coinAddress - The coin contract address
 * @param {string|number} params.amountInETH - Amount of ETH to spend (will be parsed with parseEther)
 * @param {Object} publicClient - Viem public client
 * @returns {Promise<Object>} Simulation result
 */
export const simulateCoinPurchase = async (params, publicClient) => {
  const { coinAddress, amountInETH } = params;

  if (!coinAddress || !amountInETH) {
    throw new Error("Missing required parameters for purchase simulation");
  }

  // Mock implementation for development without client
  if (!publicClient) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const coinAmount = amountInETH * 1000; // Simplistic simulation
    return {
      orderSize: parseEther(amountInETH.toString()),
      amountOut: parseEther(coinAmount.toString()),
      priceImpact: amountInETH > 1 ? 0.015 : 0.005, // Higher impact for larger purchases
    };
  }

  // Actual implementation using simulateBuy
  return safeSDKCall(async () => {
    return await simulateBuy({
      target: coinAddress,
      requestedOrderSize: parseEther(amountInETH.toString()),
      publicClient,
    });
  }, `Failed to simulate purchase for coin ${coinAddress}`);
};

/**
 * Sell coins using the tradeCoin function from Zora SDK
 * @param {Object} params - Sell parameters
 * @param {Address} params.coinAddress - The coin contract address
 * @param {Address} params.recipientAddress - Address to receive ETH
 * @param {string|number} params.coinAmount - Amount of coins to sell (will be parsed with parseEther)
 * @param {string|number} params.minETHOut - Minimum ETH to receive (optional)
 * @param {Address} params.referrerAddress - Optional referrer address
 * @param {Object} walletClient - Viem wallet client
 * @param {Object} publicClient - Viem public client
 * @returns {Promise<Object>} Transaction result
 */
export const sellCoin = async (params, walletClient, publicClient) => {
  const {
    coinAddress,
    recipientAddress,
    coinAmount,
    minETHOut,
    referrerAddress,
  } = params;

  if (!coinAddress || !recipientAddress || !coinAmount) {
    throw new Error("Missing required parameters for coin sale");
  }

  // Mock implementation for development without clients
  if (!walletClient || !publicClient) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const ethAmount = Number(coinAmount) / 1000; // Simple conversion for mocking
    return {
      hash: `0x${Math.random().toString(16).slice(2, 42)}`,
      trade: {
        coinAmount: parseEther(coinAmount.toString()),
        ethAmount: parseEther(ethAmount.toString()),
        recipient: recipientAddress,
        timestamp: Math.floor(Date.now() / 1000),
      },
    };
  }

  // Actual implementation using tradeCoin
  return safeSDKCall(async () => {
    const sellParams = {
      direction: "sell",
      target: coinAddress,
      args: {
        recipient: recipientAddress,
        orderSize: parseEther(coinAmount.toString()),
        minAmountOut: minETHOut ? parseEther(minETHOut.toString()) : 0n,
        tradeReferrer:
          referrerAddress || "0x0000000000000000000000000000000000000000",
      },
    };

    return await tradeCoin(sellParams, walletClient, publicClient);
  }, `Failed to sell coin ${coinAddress}`);
};

/**
 * Create parameters for tradeCoin call (for use with WAGMI)
 * @param {Object} tradeParams - Trade parameters exactly as specified in tradeCoin docs
 * @returns {Object} Contract call parameters for WAGMI
 */
export const createTradeCallParams = (tradeParams) => {
  // Directly use tradeCoinCall
  return tradeCoinCall(tradeParams);
};

/**
 * Extract trade details from transaction logs
 * @param {Object} receipt - Transaction receipt
 * @param {string} direction - Trade direction ('buy' or 'sell')
 * @returns {Object|null} Trade details or null if not found
 */
export const extractTradeFromLogs = (receipt, direction) => {
  if (!receipt) return null;

  // Use getTradeFromLogs to extract trade details
  return getTradeFromLogs(receipt, direction);
};

/**
 * Fetch token details by address
 * @param {Address} tokenAddress - Contract address of the token
 * @returns {Promise<Object>} Token details
 */
export const getTokenDetails = async (tokenAddress) => {
  if (!tokenAddress) throw new Error("Token address is required");

  return safeSDKCall(async () => {
    // Mock implementation for development
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate consistent mock data based on the address
    const addressSum = tokenAddress
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const mockSupply = 990000000 - (addressSum % 500000);
    const mockPrice = (0.000001 + (addressSum % 1000) / 10000000).toFixed(8);
    const mockHolders = 50 + (addressSum % 500);

    return {
      address: tokenAddress,
      name: `${tokenName(tokenAddress)}`,
      symbol: `${tokenSymbol(tokenAddress)}`,
      decimals: 18,
      totalSupply: mockSupply.toString(),
      circulatingSupply: (mockSupply * 0.3).toString(),
      priceUSD: mockPrice,
      marketCapUSD: (mockSupply * 0.3 * parseFloat(mockPrice)).toFixed(2),
      holders: mockHolders,
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, `Failed to fetch token details for ${tokenAddress}`);
};

/**
 * Get current token price and market data
 * @param {Address} tokenAddress - Contract address of the token
 * @returns {Promise<Object>} Current price and market data
 */
export const getTokenPriceData = async (tokenAddress) => {
  if (!tokenAddress) throw new Error("Token address is required");

  return safeSDKCall(async () => {
    // Mock implementation for development
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Generate consistent mock data based on the address
    const addressSum = tokenAddress
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const basePrice = 0.000001 + (addressSum % 1000) / 10000000;

    // Add some randomness to simulate price fluctuations
    const priceNoise = (Math.random() - 0.5) * 0.00000005;
    const currentPrice = basePrice + priceNoise;

    // Calculate 24h change with slight randomness
    const change24h = ((Math.random() - 0.45) * 8).toFixed(2);

    return {
      address: tokenAddress,
      currentPriceUSD: currentPrice.toFixed(8),
      change24hPercent: change24h,
      high24h: (currentPrice * (1 + Math.random() * 0.05)).toFixed(8),
      low24h: (currentPrice * (1 - Math.random() * 0.05)).toFixed(8),
      volume24hUSD: (Math.random() * 5000 + 1000).toFixed(2),
      updatedAt: new Date().toISOString(),
    };
  }, `Failed to fetch price data for ${tokenAddress}`);
};

/**
 * Get price history for a token
 * @param {Address} tokenAddress - Contract address of the token
 * @param {string} timeframe - Timeframe for history (1h, 24h, 7d, 30d, etc.)
 * @returns {Promise<Array>} Array of price data points for charting
 */
export const getTokenPriceHistory = async (tokenAddress, timeframe = "7d") => {
  if (!tokenAddress) throw new Error("Token address is required");

  return safeSDKCall(async () => {
    // Mock implementation for development
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Determine number of data points based on timeframe
    let dataPoints = 24;
    let intervalMs = 3600000; // 1 hour in milliseconds

    switch (timeframe) {
      case "1h":
        dataPoints = 60;
        intervalMs = 60000; // 1 minute
        break;
      case "24h":
        dataPoints = 24;
        intervalMs = 3600000; // 1 hour
        break;
      case "7d":
        dataPoints = 168;
        intervalMs = 3600000; // 1 hour
        break;
      case "30d":
        dataPoints = 30;
        intervalMs = 86400000; // 1 day
        break;
      case "90d":
        dataPoints = 90;
        intervalMs = 86400000; // 1 day
        break;
      default:
        dataPoints = 24;
        intervalMs = 3600000; // 1 hour
    }

    // Generate mock price data points
    const endTime = Date.now();
    const startTime = endTime - dataPoints * intervalMs;

    // Get base price for consistency
    const addressSum = tokenAddress
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const basePrice = 0.000001 + (addressSum % 1000) / 10000000;

    // Generate price data with random walk pattern
    let currentPrice = basePrice;
    const priceHistory = [];

    for (let i = 0; i < dataPoints; i++) {
      const timestamp = new Date(startTime + i * intervalMs);

      // Random walk with some momentum
      const percentChange = (Math.random() - 0.5) * 0.03; // -1.5% to +1.5%
      currentPrice = currentPrice * (1 + percentChange);

      // Add some randomness to volume
      const volume = Math.random() * 1000 + 100;

      priceHistory.push({
        timestamp: timestamp.toISOString(),
        priceUSD: currentPrice.toFixed(8),
        volumeUSD: volume.toFixed(2),
      });
    }

    return priceHistory;
  }, `Failed to fetch price history for ${tokenAddress}`);
};

// Helper function to generate token name from address
const tokenName = (address) => {
  // Use the last 6 characters of the address to generate a name
  const suffix = address.slice(-6);
  const nameMap = {
    "000000": "Zero Token",
    ffffff: "Peak Token",
    a: "Alpha",
    b: "Beta",
    c: "Crypto",
    d: "Delta",
    e: "Echo",
    f: "Fox",
  };

  // Check if the suffix starts with any of the patterns
  for (const [pattern, name] of Object.entries(nameMap)) {
    if (suffix.startsWith(pattern)) {
      return `${name} ${suffix.substring(1, 3)}`;
    }
  }

  // Default name generation
  return `Token ${suffix.substring(0, 3)}`;
};

// Helper function to generate token symbol from address
const tokenSymbol = (address) => {
  // Use last 6 characters of the address
  const suffix = address.slice(-6);

  // Convert to uppercase symbols
  return suffix.substring(0, 3).toUpperCase();
};

/**
 * Generate prize distribution tiers
 * @param {number} amount - Total prize amount
 * @param {number} winnerCount - Number of winners
 * @returns {Array} Array of prize tiers with positions, percentages and winner counts
 */
export const generatePrizeDistribution = (amount = 500, winnerCount = 10) => {
  // Default equitable distribution model
  const distribution = [
    { position: "1st", percentage: 45, winners: 1 },
    { position: "2nd", percentage: 12.5, winners: 2 },
    { position: "3rd", percentage: 7.5, winners: 2 },
    { position: "4th", percentage: 5, winners: 2 },
    { position: "5th", percentage: 2.5, winners: 3 },
  ];

  // Calculate actual prize amounts
  return distribution.map((tier) => ({
    ...tier,
    amount: (amount * (tier.percentage / 100)).toFixed(2),
  }));
};
