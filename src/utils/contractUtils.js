import { Contract } from "ethers";
import MerkleDistributorABI from "../contracts/MerkleDistributor.json";

// TODO: move this out to a settings file, such as .env
const MERKLE_DISTRIBUTOR_ADDRESS = "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4";

/**
 * Get the MerkleDistributor contract instance.
 * @param {ethers.Signer} signer - the signer (connected wallet).
 * @returns {ethers.Contract} - the contract instance
 */
const getMerkleDistributorContract = (signer) => {
  if (!signer.provider || !signer.sendTransaction) {
    throw new Error(
      "contractUtils: The signer does not support sending transactions."
    );
  }
  return new Contract(MERKLE_DISTRIBUTOR_ADDRESS, MerkleDistributorABI, signer);
};

/**
 * Create a new distribution on the MerkleDistributor contract.
 * @param {ethers.Signer} signer - the signer (connected wallet).
 * @param {Object} distributionData - the distribution data.
 * @returns {Promise<ethers.ContractTransaction} - the transaction object.
 */
export const createDistribution = async (signer, distributionData) => {
  const contract = getMerkleDistributorContract(signer);

  const {
    token,
    isERC20,
    amountPerClaim,
    walletCount,
    startTime,
    endTime,
    merkleRoot,
    title,
    ipfsCID,
  } = distributionData;

  const tx = await contract.createDistribution(
    token,
    isERC20,
    amountPerClaim,
    walletCount,
    startTime,
    endTime,
    merkleRoot,
    title,
    ipfsCID
  );

  return tx;
};
