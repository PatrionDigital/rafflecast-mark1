// src/utils/zoraUtils.js

/**
 * Utility functions for working with Zora Coins SDK
 * Note: Initial implementation with mock functions
 * that will be replaced with actual SDK calls
 */

// Mock data for initial development
const MOCK_COINS = [];

/**
 * Create a new Zora coin to be used as raffle tickets
 * @param {Object} coinData - Information for the new coin
 * @param {string} coinData.name - Name of the coin
 * @param {string} coinData.symbol - Symbol for the coin (1-5 characters)
 * @param {string} coinData.description - Optional description of the coin
 * @returns {Promise<Object>} The created coin data
 */
export const createZoraCoin = async (coinData) => {
  // Validate inputs
  if (!coinData.name || !coinData.symbol) {
    throw new Error("Name and symbol are required for coin creation");
  }

  if (!/^[A-Z0-9]{1,5}$/.test(coinData.symbol)) {
    throw new Error("Symbol must be 1-5 uppercase letters or numbers");
  }

  try {
    // In actual implementation, we would call the Zora SDK here
    // const sdk = new CoinsSDK();
    // const newCoin = await sdk.createCoin(coinData);

    // For now, return mock data
    const mockCoin = {
      id: `zora-${Date.now()}`,
      name: coinData.name,
      symbol: coinData.symbol,
      contractAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
      createdAt: new Date().toISOString(),
      metadata: {
        description:
          coinData.description || `Ticket token for ${coinData.name} raffle`,
        image: "https://placeholder.com/logo.png", // Default image
      },
    };

    // Store in mock database
    MOCK_COINS.push(mockCoin);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return mockCoin;
  } catch (error) {
    console.error("Error creating Zora coin:", error);
    throw new Error(`Failed to create token: ${error.message}`);
  }
};

/**
 * Get details for a specific Zora coin
 * @param {string} coinId - The ID of the coin
 * @returns {Promise<Object>} Coin details
 */
export const getZoraCoin = async (coinId) => {
  try {
    // In actual implementation, we would call the Zora SDK here
    // const sdk = new CoinsSDK();
    // const coin = await sdk.getCoin(coinId);

    // For now, return mock data
    const mockCoin = MOCK_COINS.find((coin) => coin.id === coinId);

    if (!mockCoin) {
      throw new Error(`Coin with ID ${coinId} not found`);
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockCoin;
  } catch (error) {
    console.error(`Error fetching Zora coin ${coinId}:`, error);
    throw error;
  }
};

/**
 * Helper function to generate prize distribution tiers
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
