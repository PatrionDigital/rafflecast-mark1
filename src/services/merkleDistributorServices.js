// src/services/merkleDistributorService.js
import walletClient from "../utils/viemClient";
import distributorABI from "../contracts/MerkleDistributor.json";

// Replace with the deployed contract address
const CONTRACT_ADDRESS = "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4";

export const createDistribution = async ({
  token,
  isERC20,
  amountPerClaim,
  walletCount,
  startTime,
  endTime,
  merkleRoot,
  title,
  ipfsCID,
}) => {
  try {
    const result = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: distributorABI,
      functionName: "createDistribution",
      args: [
        token,
        isERC20,
        amountPerClaim,
        walletCount,
        startTime,
        endTime,
        merkleRoot,
        title,
        ipfsCID,
      ],
    });
    return result; // Transaction result
  } catch (error) {
    console.error("Error creating distribution:", error);
    throw error;
  }
};
