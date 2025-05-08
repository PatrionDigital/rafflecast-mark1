// src/context/RaffleContext.jsx
import { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import {
  fetchRaffles,
  fetchEntries,
  addRaffleToDB,
  addEntryToDB,
  updateEntryInDB,
  onRaffleCreated,
  onRaffleEntry,
  onRafflePhaseUpdated,
} from "../utils/tursoUtils";
import { 
  getTokenDetails, 
  getTokenPriceData, 
  simulateCoinPurchase 
} from "../utils/zoraUtils";

const RaffleContext = createContext();

export function RaffleProvider({ children }) {
  const [raffles, setRaffles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [eligibilityStatus, setEligibilityStatus] = useState([]);

  const [userTokens, setUserTokens] = useState([]); // User's token positions
  const [tokenPrices, setTokenPrices] = useState({}); // Current prices of relevant tokens
  const [tokenTransactions, setTokenTransactions] = useState([]); // History of token transactions
  const [loadingTokens, setLoadingTokens] = useState(false); // Loading state for token operations
  const [tokenError, setTokenError] = useState(null); // Error state for token operations

  useEffect(() => {
    const loadData = async () => {
      const fetchedRaffles = await fetchRaffles();
      const fetchedEntries = await fetchEntries();

      setRaffles(fetchedRaffles);
      setEntries(fetchedEntries);

      const intitialELigibilityStatus = fetchedRaffles.map((raffle) => ({
        raffleId: raffle.id,
        status: "Eligible", // Since we're removing criteria, all raffles are eligible by default
      }));
      setEligibilityStatus(intitialELigibilityStatus);
    };
    loadData();
  }, []);

  useEffect(() => {
    const cleanupListeners = [
      onRaffleCreated((response) => {
        console.log("onRaffleCreated received:", response);
        if (response && response.success) {
          console.log("Raffle created successfully:", response.id);
        } else {
          console.error(
            "Error creating raffle:",
            response ? response.error : "Unknown error"
          );
        }
      }),
      onRaffleEntry((data) => {
        console.log("onRaffleEntry received:", data);
        if (data && data.success && data.newEntry) {
          setEntries((prevEntries) => {
            // Check if the entry already exists
            if (prevEntries.some((entry) => entry.id === data.newEntry.id)) {
              return prevEntries;
            }
            return [...(prevEntries || []), data.newEntry];
          });
          console.log("Entry added successfully!");
        } else {
          console.log(`Error adding entry: ${data.error}`);
        }
      }),
      onRafflePhaseUpdated((data) => {
        if (data && data.success && data.raffleId && data.newPhase) {
          setRaffles((prev) =>
            prev.map((raffle) =>
              raffle.id === data.raffleId
                ? { ...raffle, phase: data.newPhase }
                : raffle
            )
          );
          console.log(
            `Raffle ${data.raffleId} updated to phase ${data.newPhase}`
          );
        } else {
          console.log(`Error updating raffle phase: ${data.error}`);
        }
      }),
    ];

    return () => {
      cleanupListeners.forEach((unsub) => unsub && unsub());
    };
  }, []);

  const addRaffle = async (raffleData) => {
    // Add default prize structure if not provided
    if (!raffleData.prize) {
      raffleData.prize = {
        amount: 500,
        currency: "USDC",
        winnerCount: 10,
        distribution: {
          model: "equitable",
          tiers: generatePrizeDistribution(500, 10),
        },
      };
    }

    // Ensure startDate and startTime are set to creation time if not provided
    if (!raffleData.startDate || !raffleData.startTime) {
      const now = new Date();
      raffleData.startDate = now.toISOString().split("T")[0];
      raffleData.startTime = now.toTimeString().split(" ")[0].substring(0, 5);
    }

    // Optimistically Update the state
    setRaffles((prev) => [...prev, raffleData]);
    try {
      await addRaffleToDB(raffleData);
      console.log("Raffle created successfully!");
    } catch (error) {
      console.error("Error adding raffle:", error.message);
      console.log("An error occurred while creating the raffle.");

      // Revert the state update if the database write fails
      setRaffles((prev) =>
        prev.filter((raffle) => raffle.id !== raffleData.id)
      );
    }
  };

  const addEntry = async (entryData) => {
    // TODO: Add Data Validation
    const { raffleId, participant } = entryData;

    // Check if the user has already entered the raffle
    const hasEntered = entries.some(
      (entry) =>
        entry?.raffleId === raffleId && entry?.participant === participant
    );

    if (!hasEntered) {
      // Optimistically Update the state
      setEntries((prev) => [...prev, entryData]);

      try {
        // Try adding the entry to the DB
        await addEntryToDB(entryData);

        // On success, show success message
        console.log("Entry added successfully!");
      } catch (error) {
        // In case of error, show failure message
        console.error("Error adding entry:", error.message);
        console.log("An error occurred while joining the raffle.");

        // Revert the state update if the database write fails
        setEntries((prev) => prev.filter((entry) => entry.id !== entryData.id));
      }
    } else {
      // If the user has already entered, show a message
      console.log("You have already joined this raffle!");
      return;
    }
  };

  const updateRaffle = (id, updates) => {
    try {
      setRaffles((prev) =>
        prev.map((raffle) =>
          raffle.id === id ? { ...raffle, ...updates } : raffle
        )
      );
    } catch (error) {
      console.error("Error updating raffle:", error.message);
    }
  };

  const updateEntry = async (entryId, updates) => {
    try {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, ...updates } : entry
        )
      );

      await updateEntryInDB(entryId, updates);
    } catch (error) {
      console.error("Error updating entry:", error.message);
    }
  };

  const getRafflesByPhase = async (phase) => {
    const filteredRaffles = raffles.filter((raffle) => raffle.phase === phase);
    return filteredRaffles;
  };

  const getRafflesByCreator = (creator) => {
    const filteredRaffles = raffles.filter(
      (raffle) => raffle.creator === creator
    );
    return filteredRaffles;
  };

  const getRaffleById = (raffleId) => {
    return raffles.find((raffle) => raffle.id === raffleId);
  };

  const getEntriesByRaffleId = (raffleId) => {
    return entries.filter((entry) => entry.raffleId === raffleId);
  };

  const getEntriesByEntrant = (entrant) => {
    return entries.filter((entry) => entry.participant === entrant);
  };

  const updateEligibilityStatus = (raffleId, status) => {
    console.log(
      "Updating eligibility status for raffle:",
      raffleId,
      "to",
      status
    );
    setEligibilityStatus((prev) =>
      prev.map((item) =>
        item.raffleId === raffleId ? { ...item, status } : item
      )
    );
  };

  // Fetch token details for a specific raffle
  const fetchTokenDetails = async (raffleId) => {
    if (!raffleId) {
      console.error("No raffle ID provided");
      return null;
    }
    
    setLoadingTokens(true);
    setTokenError(null);
    
    try {
      const raffle = await getRaffleById(raffleId);
      if (!raffle || !raffle.ticketToken) {
        throw new Error("Raffle or ticket token not found");
      }
      
      // Parse token data if it's a string
      const tokenData = typeof raffle.ticketToken === 'string' 
        ? JSON.parse(raffle.ticketToken) 
        : raffle.ticketToken;
        
      // Get token details from Zora
      const tokenDetails = await getTokenDetails(tokenData.contractAddress);
      
      // Update token prices state
      setTokenPrices(prevPrices => ({
        ...prevPrices,
        [tokenData.contractAddress]: {
          price: tokenDetails.priceUSD,
          updatedAt: new Date().toISOString()
        }
      }));
      
      return tokenDetails;
    } catch (error) {
      console.error("Error fetching token details:", error);
      setTokenError("Failed to load token information. Please try again.");
      return null;
    } finally {
      setLoadingTokens(false);
    }
  };

  // Get token positions for the current user
  const getUserTokenPositions = async (userAddress) => {
    if (!isAuthenticated || !profile?.fid) {
      console.log("User is not authenticated");
      return [];
    }
    
    setLoadingTokens(true);
    setTokenError(null);
    
    try {
      // Get all entries for the current user
      const userEntries = getEntriesByEntrant(profile.fid);
      
      // For each entry, get the raffle and token details
      const positions = await Promise.all(
        userEntries.map(async (entry) => {
          const raffle = await getRaffleById(entry.raffleId);
          if (!raffle || !raffle.ticketToken) return null;
          
          // Parse token data if it's a string
          const tokenData = typeof raffle.ticketToken === 'string' 
            ? JSON.parse(raffle.ticketToken) 
            : raffle.ticketToken;
          
          // Fetch token price data
          const priceData = await getTokenPriceData(tokenData.contractAddress);
          
          // Update token prices state
          setTokenPrices(prevPrices => ({
            ...prevPrices,
            [tokenData.contractAddress]: {
              price: priceData.currentPriceUSD,
              change24h: priceData.change24hPercent,
              updatedAt: new Date().toISOString()
            }
          }));
          
          // Mock token balance for now - would be replaced with actual on-chain balance check
          const tokenBalance = 100 + Math.floor(Math.random() * 900);
          
          return {
            entryId: entry.id,
            raffleId: entry.raffleId,
            raffleTitle: raffle.title,
            tokenAddress: tokenData.contractAddress,
            tokenSymbol: tokenData.symbol,
            tokenName: tokenData.name,
            balance: tokenBalance,
            value: tokenBalance * parseFloat(priceData.currentPriceUSD),
            purchasedAt: entry.enteredAt,
            currentPrice: priceData.currentPriceUSD,
            priceChange24h: priceData.change24hPercent
          };
        })
      );
      
      // Filter out null entries and update state
      const validPositions = positions.filter(p => p !== null);
      setUserTokens(validPositions);
      
      return validPositions;
    } catch (error) {
      console.error("Error fetching user token positions:", error);
      setTokenError("Failed to load your token positions. Please try again.");
      return [];
    } finally {
      setLoadingTokens(false);
    }
  };

  // Purchase tokens for a raffle
  const purchaseRaffleTokens = async (raffleId, amountInETH, walletAddress) => {
    if (!raffleId || !amountInETH || !walletAddress) {
      console.error("Missing required parameters for token purchase");
      return { success: false, error: "Missing required parameters" };
    }
    
    setLoadingTokens(true);
    setTokenError(null);
    
    try {
      const raffle = await getRaffleById(raffleId);
      if (!raffle || !raffle.ticketToken) {
        throw new Error("Raffle or ticket token not found");
      }
      
      // Parse token data if it's a string
      const tokenData = typeof raffle.ticketToken === 'string' 
        ? JSON.parse(raffle.ticketToken) 
        : raffle.ticketToken;
      
      // Simulate purchase to get expected output
      const simulation = await simulateCoinPurchase({
        coinAddress: tokenData.contractAddress,
        amountInETH
      });
      
      // Execute the purchase - for now, we'll simulate the transaction
      // In production, this would use buyCoin from zoraUtils
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate transaction time
      
      // Record the transaction
      const transaction = {
        id: uuidv4(),
        type: 'buy',
        raffleId,
        tokenAddress: tokenData.contractAddress,
        tokenSymbol: tokenData.symbol,
        amountInETH,
        tokenAmount: parseFloat(simulation.amountOut) / 1e18, // Convert from wei
        timestamp: new Date().toISOString(),
        status: 'completed',
        txHash: `0x${Math.random().toString(16).substring(2, 42)}` // Mock tx hash
      };
      
      // Update transaction history
      setTokenTransactions(prev => [transaction, ...prev]);
      
      // Update user tokens
      await getUserTokenPositions();
      
      return { 
        success: true, 
        transaction,
        expectedTokens: parseFloat(simulation.amountOut) / 1e18
      };
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      setTokenError(`Failed to purchase tokens: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setLoadingTokens(false);
    }
  };

  // Sell tokens for a raffle
  const sellRaffleTokens = async (tokenAddress, tokenAmount, walletAddress) => {
    if (!tokenAddress || !tokenAmount || !walletAddress) {
      console.error("Missing required parameters for token sale");
      return { success: false, error: "Missing required parameters" };
    }
    
    setLoadingTokens(true);
    setTokenError(null);
    
    try {
      // Find the raffle for this token
      const raffleBatch = raffles.filter(r => {
        const tokenData = typeof r.ticketToken === 'string' 
          ? JSON.parse(r.ticketToken) 
          : r.ticketToken;
        return tokenData && tokenData.contractAddress === tokenAddress;
      });
      
      if (!raffleBatch.length) {
        throw new Error("No raffle found for this token");
      }
      
      const raffle = raffleBatch[0];
      
      // Execute the sale - for now, we'll simulate the transaction
      // In production, this would use sellCoin from zoraUtils
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate transaction time
      
      // Calculate ETH received (simple approximation)
      const tokenPrice = tokenPrices[tokenAddress]?.price || 0.000001;
      const ethReceived = tokenAmount * parseFloat(tokenPrice);
      
      // Record the transaction
      const transaction = {
        id: uuidv4(),
        type: 'sell',
        raffleId: raffle.id,
        tokenAddress,
        tokenSymbol: typeof raffle.ticketToken === 'string' 
          ? JSON.parse(raffle.ticketToken).symbol 
          : raffle.ticketToken.symbol,
        amountInETH: ethReceived,
        tokenAmount,
        timestamp: new Date().toISOString(),
        status: 'completed',
        txHash: `0x${Math.random().toString(16).substring(2, 42)}` // Mock tx hash
      };
      
      // Update transaction history
      setTokenTransactions(prev => [transaction, ...prev]);
      
      // Update user tokens
      await getUserTokenPositions();
      
      return { 
        success: true, 
        transaction,
        ethReceived
      };
    } catch (error) {
      console.error("Error selling tokens:", error);
      setTokenError(`Failed to sell tokens: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setLoadingTokens(false);
    }
  };

  // Refresh token prices
  const refreshTokenPrices = async () => {
    if (!userTokens.length) return;
    
    try {
      const uniqueTokenAddresses = [...new Set(userTokens.map(t => t.tokenAddress))];
      
      // Fetch updated prices for all tokens
      const updatedPrices = await Promise.all(
        uniqueTokenAddresses.map(async (address) => {
          const priceData = await getTokenPriceData(address);
          return [address, {
            price: priceData.currentPriceUSD,
            change24h: priceData.change24hPercent,
            updatedAt: new Date().toISOString()
          }];
        })
      );
      
      // Update token prices state
      const newPrices = Object.fromEntries(updatedPrices);
      setTokenPrices(prevPrices => ({
        ...prevPrices,
        ...newPrices
      }));
      
      // Also update user tokens with the new prices
      setUserTokens(prev => prev.map(token => ({
        ...token,
        currentPrice: newPrices[token.tokenAddress]?.price || token.currentPrice,
        priceChange24h: newPrices[token.tokenAddress]?.change24h || token.priceChange24h,
        value: token.balance * parseFloat(newPrices[token.tokenAddress]?.price || token.currentPrice)
      })));
    } catch (error) {
      console.error("Error refreshing token prices:", error);
      setTokenError("Failed to refresh token prices");
    }
  };

  // Clear message from context
  const clearMessage = () => {
    // No-op function since we removed event messages
  };

  // NOTE: Functions like addRaffle, addEntry etc are stable and don't need to be included in the dependency array
  // as they only depend on raffles, entries, eligibilityStatus
  const contextValue = useMemo(
    () => ({
      // Existing properties
      raffles,
      entries,
      eligibilityStatus,
      getRafflesByPhase,
      addRaffle,
      addEntry,
      updateRaffle,
      updateEntry,
      getRafflesByCreator,
      getRaffleById,
      getEntriesByRaffleId,
      getEntriesByEntrant,
      updateEligibilityStatus,
      clearMessage,
      
      // New token-related properties
      userTokens,
      tokenPrices,
      tokenTransactions,
      loadingTokens,
      tokenError,
      
      // New token-related methods
      fetchTokenDetails,
      getUserTokenPositions,
      purchaseRaffleTokens,
      sellRaffleTokens,
      refreshTokenPrices
    }),
    // Update dependencies array to include new state variables
    [
      raffles, 
      entries, 
      eligibilityStatus, 
      userTokens, 
      tokenPrices, 
      tokenTransactions, 
      loadingTokens, 
      tokenError
    ]
  );

  return (
    <RaffleContext.Provider value={contextValue}>
      {children}
    </RaffleContext.Provider>
  );
}

RaffleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { RaffleContext };
