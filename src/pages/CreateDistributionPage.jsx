// pages/CreateDistributionPage.jsx
import { useState } from "react";
import { useProfile } from "@farcaster/auth-kit";
import { ConnectKitButton } from "connectkit";

const CreateDistributionPage = () => {
  const { profile } = useProfile();
  // Distribution Address
  const [selectedAddress, setSelectedAddress] = useState("");

  // Extract wallet addresses from the profile's verifications array
  const walletAddresses = profile?.verifications || [];

  const handleAddressSelect = (event) => {
    setSelectedAddress(event.target.value);
  };

  return (
    <div className="create-distribution-page">
      <h2>Create Rewards Distribution</h2>
      <div className="wallet-selection">
        <label htmlFor="wallet-address">Select Wallet Address:</label>
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
          <label>Token Address:</label>
          <label>ERC20?:</label>
        </div>
        <div className="claim-info">
          <div>
            <label>Reward Amount:</label>
          </div>
          <div>
            <label>Reward Wallet:</label>
          </div>
          <div>
            <label>Claim Period Start:</label>
            <label>Claim Period End:</label>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
  token,
  isERC20,
  amountPerClaim,
  walletCount,
  startTime,
  endTime,
  merkleRoot,
  title,
  ipfsCID
  */
export default CreateDistributionPage;
