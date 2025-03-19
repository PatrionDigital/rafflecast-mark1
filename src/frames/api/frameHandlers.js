// src/frames/api/frameHandlers.js
import { getUserInfo, isInFrame } from "./index";

/**
 * Handles user authentication within a frame
 * @param {Function} connectWallet - Function to connect wallet (like from wagmi)
 * @returns {Promise<Object>} Auth result with user information
 */
export const handleFrameAuth = async (connectWallet) => {
  try {
    // Check if we're in a frame
    const inFrame = await isInFrame();
    if (!inFrame) {
      return { success: false, error: "Not in a Farcaster frame" };
    }

    // Get user info from frame context
    const userInfo = await getUserInfo();
    if (!userInfo || !userInfo.fid) {
      return { success: false, error: "User not authenticated in frame" };
    }

    // If a wallet connect function is provided, try to connect the wallet
    if (connectWallet && typeof connectWallet === "function") {
      try {
        await connectWallet();
      } catch (error) {
        console.error("Error connecting wallet:", error);
        // Continue even if wallet connection fails, as we have FID
      }
    }

    return {
      success: true,
      user: userInfo,
    };
  } catch (error) {
    console.error("Frame auth error:", error);
    return {
      success: false,
      error: error.message || "Unknown error during frame authentication",
    };
  }
};

/**
 * Handles raffle entry within a frame
 * @param {Object} options Options for entering a raffle
 * @param {string} options.raffleId The ID of the raffle to enter
 * @param {Function} options.addEntry Function to add entry (from your useRaffle hook)
 * @param {Function} options.checkEligibility Function to check eligibility (from your useRaffle hook)
 * @returns {Promise<Object>} Result of entering the raffle
 */
export const handleFrameRaffleEntry = async ({
  raffleId,
  addEntry,
  checkEligibility,
}) => {
  try {
    // First, get user info and verify we're in a frame
    const userInfo = await getUserInfo();
    if (!userInfo || !userInfo.fid) {
      return {
        success: false,
        error: "User not authenticated in frame",
      };
    }

    // Check eligibility if a function is provided
    if (checkEligibility && typeof checkEligibility === "function") {
      const eligibility = await checkEligibility(raffleId);
      if (eligibility !== "Eligible") {
        return {
          success: false,
          error: `User is not eligible: ${eligibility}`,
        };
      }
    }

    // Generate entry data
    const entryData = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      raffleId,
      participant: userInfo.fid,
      enteredAt: new Date().toISOString(),
      // If user has connecting wallet, get that address for prize delivery
      prizeWallet: userInfo.custody || "",
    };

    // Add entry using provided function
    if (!addEntry || typeof addEntry !== "function") {
      return {
        success: false,
        error: "No addEntry function provided",
      };
    }

    await addEntry(entryData);

    return {
      success: true,
      entry: entryData,
    };
  } catch (error) {
    console.error("Frame raffle entry error:", error);
    return {
      success: false,
      error: error.message || "Unknown error during raffle entry",
    };
  }
};
