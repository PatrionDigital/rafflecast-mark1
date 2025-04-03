// pages/CreateDistributionPage.jsx
import { useProfile } from "@farcaster/auth-kit";
import { ConnectKitButton } from "connectkit";
import { ethers, BrowserProvider } from "ethers";
import { PinataSDK } from "pinata-web3";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAccount } from "wagmi";

import { createDistribution } from "../utils/contractUtils";
import { generateMerkleTree } from "../utils/merkleUtils";

const CreateDistributionPage = () => {
  const { raffleId } = useParams();
  const { state } = useLocation();
  const { profile } = useProfile();
  const { address, connector, isConnected } = useAccount();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [isERC20, setIsERC20] = useState(true);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [claimStart, setClaimStart] = useState("");
  const [claimEnd, setClaimEnd] = useState("");
  const [merkleRoot, setMerkleRoot] = useState("");
  const [error, setError] = useState("");

  /*
  const pinataBaseUrl = "https://api.pinata.cloud/v3/farcaster";
    const jwtToken = import.meta.env.VITE_PINATA_JWT;
  */
  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: "maroon-left-takin-392.mypinata.cloud",
  });

  const winners = useMemo(() => state?.winners || [], [state]);

  // Extract wallet addresses from the profile's verifications array
  const walletAddresses = profile?.verifications || [];

  const handleAddressSelect = (event) => {
    setSelectedAddress(event.target.value);
  };

  // Generate Merkle root whenever winners changes
  useEffect(() => {
    if (winners.length > 0) {
      try {
        const { root } = generateMerkleTree(winners);
        setMerkleRoot(root);
      } catch (error) {
        console.error("Error generating Merkle root:", error);
        setMerkleRoot("");
      }
    } else {
      setMerkleRoot("");
    }
  }, [winners]);

  useEffect(() => {
    console.log("Wallet connection Status:", { isConnected, address });
    console.log("Connector:", connector);
  }, [isConnected, address, connector]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tokenAddress || !rewardAmount || !claimStart || !claimEnd) {
      setError("Please fill in all required fields.");
      return;
    }

    if (winners.length === 0) {
      setError("No winners found for this raffle.");
      return;
    }
    try {
      // Check if user is signed in
      if (!isConnected || !address) {
        throw new Error("Please connect your wallet before submitting.");
      }
      if (connector) {
        const provider = await connector.getProvider();
        const ethersProvider = new BrowserProvider(provider);
        const ethersSigner = await ethersProvider.getSigner();

        if (!ethersSigner.provider || !ethersSigner.sendTransaction) {
          throw new Error("The signer does not support sending transactions.");
        }
        console.log("Signer:", ethersSigner);
        // Get decimals from Token Contract
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ["function decimals() view returns (uint8)"],
          ethersProvider
        );
        const decimals = await tokenContract.decimals();
        const decimalFactor = BigInt(10) ** BigInt(decimals);
        const rewardAmountBigInt = BigInt(rewardAmount);
        const adjustedAmountPerClaim = rewardAmountBigInt * decimalFactor;

        // Pin distribution whitelist addresses to IPFS
        console.log("Whitelist:", winners);
        // Set to CIDv0
        const upload = await pinata.upload.json(winners).cidVersion(0);
        const ipfsCID = upload.IpfsHash;
        console.log("ipfsCID:", ipfsCID);

        // Prepare the distribution data
        const distributionData = {
          token: tokenAddress,
          isERC20,
          amountPerClaim: adjustedAmountPerClaim.toString(),
          walletCount: winners.length,
          startTime: Math.floor(new Date(claimStart).getTime() / 1000),
          endTime: Math.floor(new Date(claimEnd).getTime() / 1000),
          merkleRoot,
          title: `Rewards for Raffle ${raffleId}`,
          ipfsCID: ipfsCID,
        };

        console.log("Distribution Data:", distributionData);

        const tx = await createDistribution(ethersSigner, distributionData);
        await tx.wait();

        setError("");
        console.log("Rewards distribution created successfully");
      } else {
        throw new Error("No connector found for the connected wallet.");
      }
    } catch (error) {
      console.error("Error creating rewards distribution:", error);
      setError("Failed to create rewards distribution.");
      console.log(error.message || "Failed to create distribution");
    }
  };

  return (
    <div className="page-container">
      <div className="form-section">
        <h2>Create Rewards Distribution</h2>
        <form onSubmit={handleSubmit}>
          <div className="wallet-selection">
            <label htmlFor="wallet-address">Select Signing Wallet:</label>
            <select
              id="wallet-address"
              value={selectedAddress}
              onChange={handleAddressSelect}
            >
              <option value="">Choose an address</option>
              {walletAddresses.map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))}
            </select>
            <ConnectKitButton />
          </div>
          <div>
            <div className="token-info">
              <label>
                Token Address:
                <input
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="Enter token address"
                  required
                />
              </label>
              <label>
                ERC20?:
                <input
                  type="checkbox"
                  checked={isERC20}
                  onChange={(e) => setIsERC20(e.target.checked)}
                />
              </label>
            </div>
            <div className="claim-info">
              <div>
                <label>
                  Reward Amount:
                  <input
                    type="number"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(Number(e.target.value))}
                    placeholder="Enter reward amount"
                    required
                  />
                </label>
              </div>
              <div>
                <div>
                  <label>
                    Merkle Root:
                    <input
                      type="text"
                      value={merkleRoot}
                      readOnly
                      style={{ width: "100%", marginTop: "8px" }}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label>
                  Claim Period Start:
                  <input
                    type="datetime-local"
                    value={claimStart}
                    onChange={(e) => setClaimStart(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Claim Period End:
                  <input
                    type="datetime-local"
                    value={claimEnd}
                    onChange={(e) => setClaimEnd(e.target.value)}
                    required
                  />
                </label>
              </div>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit">Create Distribution</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDistributionPage;
