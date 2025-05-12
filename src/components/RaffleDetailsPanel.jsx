// src/components/RaffleDetailsPanel.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { Badge, Button, Card } from "@windmill/react-ui";
import {
  XMarkIcon,
  ShareIcon,
  CheckCircleIcon,
  UserCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

// Use our custom auth hook
import { useAuth } from "@/hooks/useAuth";

// Custom hooks
import { useRaffle } from "../hooks/useRaffle";
import { getCreatorUsername } from "../utils/farcasterUtils";

// Import Zora utility functions
import {
  buyCoin,
  sellCoin,
  getTokenDetails,
  simulateCoinPurchase,
} from "../utils/zoraUtils";

// Components
import ShareModal from "./ShareModal";
import FrameMeta from "./FrameMeta";

const RaffleDetailsPanel = ({ raffle, onClose, isInFrame = false }) => {
  const {
    eligibilityStatus,
    updateEligibilityStatus,
    addEntry,
    getRaffleById,
    getEntriesByEntrant,
  } = useRaffle();

  // Component state
  const { isAuthenticated, profile } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [hasEntered, setHasEntered] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState(null);
  const [creatorLoading, setCreatorLoading] = useState(true);
  const [creatorError, setCreatorError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Token purchase state
  const [purchaseAmount, setPurchaseAmount] = useState(0.1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setpurchaseError] = useState(null);
  const [purchaseResult, setPurchaseResult] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // Parse ticketToken if it's a JSON string
  let ticketToken = null;
  if (raffle.ticketToken) {
    try {
      ticketToken =
        typeof raffle.ticketToken === "string"
          ? JSON.parse(raffle.ticketToken)
          : raffle.ticketToken;
    } catch (error) {
      console.error("Error parsing ticket token:", error);
    }
  }

  // Parse prize if it's a JSON string
  let prize = null;
  if (raffle.prize) {
    try {
      prize =
        typeof raffle.prize === "string"
          ? JSON.parse(raffle.prize)
          : raffle.prize;
    } catch (error) {
      console.error("Error parsing prize data:", error);
    }
  }

  // Check if the user has already entered the raffle
  useEffect(() => {
    if (isAuthenticated && profile?.fid) {
      const userEntries = getEntriesByEntrant(profile.fid);
      const hasEnteredThisRaffle = userEntries.some(
        (entry) => entry.raffleId === raffle.id
      );
      setHasEntered(hasEnteredThisRaffle);
    }
  }, [getEntriesByEntrant, raffle.id, profile?.fid, isAuthenticated]);

  // Fetch creator username
  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const username = await getCreatorUsername(raffle.creator);
        if (username) {
          setCreatorUsername(username);
        } else {
          setCreatorError("Creator not found");
        }
      } catch (err) {
        console.error("Error fetching creator:", err);
        setCreatorError("Error loading creator info");
      } finally {
        setCreatorLoading(false);
      }
    };

    fetchCreator();
  }, [raffle.creator]);

  // Fetch token details and user balance if authenticated
  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!ticketToken?.contractAddress) return;

      try {
        // Fetch token details
        const details = await getTokenDetails(ticketToken.contractAddress);
        setTokenPrice(details.priceUSD);

        // If user is authenticated, fetch their balance
        if (isAuthenticated && selectedAddress) {
          setIsFetchingBalance(true);
          try {
            // Mock balance for now - we'll retrieve actual balance later
            setTokenBalance({
              raw: "1000000000000000000", // 1 token in wei
              formatted: "1.0",
            });
          } catch (error) {
            console.error("Error fetching token balance:", error);
          } finally {
            setIsFetchingBalance(false);
          }
        }
      } catch (error) {
        console.error("Error fetching token details:", error);
      }
    };

    fetchTokenDetails();
  }, [ticketToken, isAuthenticated, selectedAddress]);

  // Simulate purchase when purchase amount changes
  useEffect(() => {
    const simulatePurchase = async () => {
      if (
        !ticketToken?.contractAddress ||
        !purchaseAmount ||
        purchaseAmount <= 0
      ) {
        setSimulationResult(null);
        return;
      }

      try {
        const simulation = await simulateCoinPurchase({
          coinAddress: ticketToken.contractAddress,
          amountInETH: purchaseAmount,
        });

        setSimulationResult({
          coinAmount: Number(simulation.amountOut) / 1e18, // Convert from wei to tokens
          ethAmount: purchaseAmount,
          priceImpact: (simulation.priceImpact * 100).toFixed(2) + "%",
        });
      } catch (error) {
        console.error("Error simulating purchase:", error);
        setSimulationResult(null);
      }
    };

    simulatePurchase();
  }, [ticketToken, purchaseAmount]);

  const handleCheckEligibility = async (raffleId) => {
    if (!isAuthenticated || !profile) {
      console.log("User is not logged in.");
      return;
    }
    try {
      const raffle = await getRaffleById(raffleId);
      console.log("Raffle:", raffle);
      updateEligibilityStatus(raffleId, "Eligible"); // Set to eligible for demo purposes
    } catch (error) {
      console.error("Error checking eligibility:", error);
      updateEligibilityStatus(raffleId, "Error checking eligibility");
    }
  };

  const handleJoinRaffle = async (raffleId) => {
    if (!selectedAddress) {
      console.log("Please select an Ethereum address.");
      return;
    }
    const participant = profile.fid;

    const entryData = {
      id: uuidv4(),
      raffleId,
      participant,
      enteredAt: new Date(),
      prizeWallet: selectedAddress,
    };

    try {
      await addEntry(entryData);
      setHasEntered(true);
      console.log("Successfully joined the raffle");
    } catch (error) {
      console.error("Error joining raffle:", error);
    }
  };

  const handleBuyTickets = async () => {
    if (!isAuthenticated || !selectedAddress || !ticketToken?.contractAddress) {
      console.log("Missing required info for purchase");
      return;
    }

    if (purchaseAmount <= 0) {
      setpurchaseError("Please enter a valid amount to purchase");
      return;
    }

    setIsPurchasing(true);
    setpurchaseError(null);
    setPurchaseResult(null);

    try {
      // Prepare purchase parameters
      const purchaseParams = {
        coinAddress: ticketToken.contractAddress,
        recipientAddress: selectedAddress,
        amountInETH: purchaseAmount,
        // You can add minAmountOut and referrerAddress here if needed
      };

      // Execute the purchase
      const result = await buyCoin(purchaseParams);

      console.log("Purchase result:", result);

      // Update UI with success
      setPurchaseResult({
        success: true,
        txHash: result.hash,
        coinAmount: simulationResult?.coinAmount || 0,
        ethAmount: purchaseAmount,
      });

      // Refresh token balance
      // This would be implemented in a full solution
    } catch (error) {
      console.error("Error purchasing tickets:", error);
      setpurchaseError(error.message || "Failed to purchase tokens");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleSellTickets = async (amount) => {
    if (!isAuthenticated || !selectedAddress || !ticketToken?.contractAddress) {
      console.log("Missing required info for sale");
      return;
    }

    if (!amount || amount <= 0) {
      setpurchaseError("Please enter a valid amount to sell");
      return;
    }

    setIsPurchasing(true);
    setpurchaseError(null);
    setPurchaseResult(null);

    try {
      // Prepare sell parameters
      const sellParams = {
        coinAddress: ticketToken.contractAddress,
        recipientAddress: selectedAddress,
        coinAmount: amount.toString(),
        // You can add minETHOut and referrerAddress here if needed
      };

      // Execute the sale
      const result = await sellCoin(sellParams);

      console.log("Sale result:", result);

      // Update UI with success
      setPurchaseResult({
        success: true,
        txHash: result.hash,
        coinAmount: amount,
        ethAmount: result.trade.ethAmount || 0,
        isSell: true,
      });

      // Refresh token balance
      // This would be implemented in a full solution
    } catch (error) {
      console.error("Error selling tickets:", error);
      setpurchaseError(error.message || "Failed to sell tokens");
    } finally {
      setIsPurchasing(false);
    }
  };

  // Helper function to get the status for the current raffle
  const getCurrentEligibilityStatus = () => {
    const statusObj = eligibilityStatus.find(
      (item) => item.raffleId === raffle.id
    );
    return statusObj ? statusObj.status : "Ineligible";
  };

  // Format dates for display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  // Create profile link
  const creatorProfileLink = creatorUsername
    ? `https://warpcast.com/${creatorUsername}`
    : "#";

  return (
    <Card className="relative shadow-xl overflow-hidden max-w-4xl w-full">
      <FrameMeta raffle={raffle} />

      {/* Header with Close Button */}
      <div className="bg-cochineal-red text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">{raffle.title}</h2>
        {!isInFrame && (
          <button
            className="p-1 rounded-full hover:bg-enamel-red transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="p-6 flex flex-col md:flex-row gap-6">
        {/* Left Column - Details */}
        <div className="md:w-2/3 space-y-4">
          {/* Creator Info */}
          <div className="flex items-center gap-2 text-asphalt">
            <UserCircleIcon className="w-5 h-5" />
            <span>
              Created by{" "}
              {creatorLoading ? (
                "Loading..."
              ) : creatorError ? (
                "Unknown"
              ) : (
                <a
                  href={creatorProfileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cochineal-red hover:text-enamel-red"
                >
                  @{creatorUsername}
                </a>
              )}
            </span>
          </div>

          {/* Dates */}
          <div className="flex flex-col sm:flex-row gap-4 text-asphalt">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Start: {formatDate(raffle.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              <span>End: {formatDate(raffle.closingDate)}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            <Badge
              className={`${
                raffle.phase === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {raffle.phase}
            </Badge>
          </div>

          {/* Description */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-asphalt mb-2">
              Description
            </h3>
            <p className="text-cement">{raffle.description}</p>
          </div>

          {/* Ticket Token */}
          {ticketToken && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-asphalt mb-2">
                Ticket Token
              </h3>
              <Card className="relative shadow-xl overflow-hidden max-w-4xl w-full p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm text-cement">Name:</span>
                    <p className="font-medium">{ticketToken.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-cement">Symbol:</span>
                    <p className="font-medium">{ticketToken.symbol}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-cement">Contract:</span>
                    <p className="font-mono text-xs overflow-x-auto break-all bg-white p-2 rounded mt-1">
                      {ticketToken.contractAddress}
                    </p>
                  </div>

                  {tokenPrice && (
                    <div>
                      <span className="text-sm text-cement">
                        Current Price:
                      </span>
                      <p className="font-medium">
                        ${parseFloat(tokenPrice).toFixed(8)}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Prize Information */}
          {prize && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-asphalt mb-2">
                Prize Pool
              </h3>
              <Card className="relative shadow-xl overflow-hidden max-w-4xl w-full p-3">
                <div className="mb-2">
                  <span className="text-sm text-cement">Total Amount:</span>
                  <p className="font-medium">
                    ${prize.amount || 500} {prize.currency || "USDC"}
                  </p>
                </div>
                {prize.distribution && (
                  <div className="text-sm text-cement">
                    Distribution model:{" "}
                    {prize.distribution.model || "equitable"}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Token Balance Section - Show if user has a balance */}
          {tokenBalance && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-asphalt mb-2 flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 mr-1" />
                Your Token Position
              </h3>
              <Card className="bg-black/10 relative overflow-hidden max-w-4xl w-full p-3 border-l-2 border-cochineal-red">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm text-cement">Balance:</span>
                    <p className="font-medium">
                      {tokenBalance.formatted} {ticketToken.symbol}
                    </p>
                  </div>
                  {tokenPrice && (
                    <div>
                      <span className="text-sm text-cement">Value:</span>
                      <p className="font-medium">
                        $
                        {(
                          parseFloat(tokenBalance.formatted) *
                          parseFloat(tokenPrice)
                        ).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Token Action Buttons */}
                <div className="mt-3 flex gap-2">
                  <Button
                    size="small"
                    onClick={() =>
                      handleSellTickets(parseFloat(tokenBalance.formatted))
                    }
                    disabled={
                      !tokenBalance || parseFloat(tokenBalance.formatted) <= 0
                    }
                    className="bg-asphalt text-white"
                  >
                    Sell All
                  </Button>
                  <Button
                    size="small"
                    onClick={() =>
                      handleSellTickets(parseFloat(tokenBalance.formatted) / 2)
                    }
                    disabled={
                      !tokenBalance || parseFloat(tokenBalance.formatted) <= 0
                    }
                    className="bg-asphalt text-white"
                  >
                    Sell Half
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Right Column - Actions */}
        <div className="md:w-1/3 space-y-4">
          <Card className="relative shadow-xl overflow-hidden max-w-4xl w-full p-3">
            <h3 className="text-lg font-semibold text-asphalt mb-4">
              Participation
            </h3>

            {/* Wallet Selection for prize delivery */}
            {isAuthenticated && profile && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-cement mb-1">
                  Prize Delivery Address
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  disabled={hasEntered}
                >
                  <option value="">Select wallet address</option>
                  {profile.verifications?.map((address, index) => (
                    <option key={index} value={address}>
                      {address.substring(0, 6)}...
                      {address.substring(address.length - 4)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Button
                className={`w-full ${
                  getCurrentEligibilityStatus() === "Eligible"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-cochineal-red hover:bg-enamel-red"
                }`}
                onClick={() => handleCheckEligibility(raffle.id)}
                disabled={!isAuthenticated || !profile}
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                {getCurrentEligibilityStatus() === "Eligible"
                  ? "Eligible to Enter"
                  : "Check Eligibility"}
              </Button>

              <Button
                className="w-full"
                onClick={() => handleJoinRaffle(raffle.id)}
                disabled={
                  !isAuthenticated ||
                  getCurrentEligibilityStatus() !== "Eligible" ||
                  hasEntered ||
                  !selectedAddress
                }
              >
                {hasEntered ? "Already Entered" : "Join Raffle"}
              </Button>

              <Button
                className="w-full bg-fabric-red hover:bg-enamel-red"
                onClick={() => setShowShareModal(true)}
                layout="outline"
              >
                <ShareIcon className="w-5 h-5 mr-2" />
                Share Raffle
              </Button>
            </div>

            {/* Token Purchase Section */}
            {ticketToken && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-asphalt flex items-center mb-2">
                  <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
                  Buy Ticket Tokens
                </h4>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-cement mb-1">
                    Amount (ETH)
                  </label>
                  <input
                    type="number"
                    min="0.001"
                    step="0.01"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={isPurchasing}
                  />
                </div>

                {simulationResult && (
                  <div className="text-sm bg-asphalt/30 p-2 rounded mb-3">
                    <p>
                      Estimated tokens:{" "}
                      <span className="font-medium">
                        {simulationResult.coinAmount.toFixed(2)}
                      </span>
                    </p>
                    <p>
                      Price impact:{" "}
                      <span className="font-medium">
                        {simulationResult.priceImpact}
                      </span>
                    </p>
                  </div>
                )}

                {purchaseError && (
                  <div className="text-sm text-red-500 mb-3">
                    {purchaseError}
                  </div>
                )}

                {purchaseResult && (
                  <div className="text-sm bg-green-50 text-green-800 p-2 rounded mb-3">
                    <p className="font-medium">
                      {purchaseResult.isSell ? "Sold" : "Purchased"}{" "}
                      successfully!
                    </p>
                    <p>
                      {purchaseResult.isSell ? "Sold" : "Received"}{" "}
                      {purchaseResult.coinAmount.toFixed(2)}{" "}
                      {ticketToken.symbol}
                    </p>
                    <p className="text-xs mt-1">
                      TX:{" "}
                      <a
                        href={`https://basescan.org/tx/${purchaseResult.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {purchaseResult.txHash.substring(0, 10)}...
                      </a>
                    </p>
                  </div>
                )}

                <Button
                  className="w-full bg-cochineal-red hover:bg-enamel-red"
                  onClick={handleBuyTickets}
                  disabled={
                    isPurchasing ||
                    !isAuthenticated ||
                    !selectedAddress ||
                    purchaseAmount <= 0
                  }
                >
                  {isPurchasing ? "Processing..." : "Buy Tokens"}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal raffle={raffle} onClose={() => setShowShareModal(false)} />
      )}
    </Card>
  );
};

RaffleDetailsPanel.propTypes = {
  raffle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    creator: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    closingDate: PropTypes.string.isRequired,
    description: PropTypes.string,
    phase: PropTypes.string,
    ticketToken: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    prize: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  isInFrame: PropTypes.bool,
};

export default RaffleDetailsPanel;
