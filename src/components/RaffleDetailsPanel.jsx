// src/components/RaffleDetailsPanel.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { Badge, Button, Card, Label, Textarea } from "@windmill/react-ui";
import {
  XMarkIcon,
  ShareIcon,
  UserCircleIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

// Use our custom auth hook
import { useAuth } from "@/hooks/useAuth";

// Custom hooks
import { useRaffle } from "../hooks/useRaffle";
import { getCreatorUsername } from "../utils/farcasterUtils";
import {
  buyZoraCoins,
  sellZoraCoins,
  getZoraCoinBalance,
} from "../utils/zoraUtils";

// Components
import ShareModal from "./ShareModal";
import { useLocation } from "react-router-dom";

const RaffleDetailsPanel = ({
  raffle,
  onClose,
  isInFrame = false,
  isEntrant: isEntrantProp,
}) => {
  const { addEntry, getEntriesByEntrant } = useRaffle();

  // Component state
  const { isAuthenticated, profile } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [hasEntered, setHasEntered] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState(null);
  const [creatorLoading, setCreatorLoading] = useState(true);
  const [creatorError, setCreatorError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [ticketBalance, setTicketBalance] = useState(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [buyAmount, setBuyAmount] = useState(1);
  const [sellAmount, setSellAmount] = useState(1);

  const location = useLocation();
  // Determine isEntrant from prop or route
  const isEntrant =
    typeof isEntrantProp === "boolean"
      ? isEntrantProp
      : location.pathname.startsWith("/entrant/");

  // --- Robust parsing utility ---
  function robustParse(objOrStr) {
    if (!objOrStr) return null;
    if (typeof objOrStr === 'string') {
      try {
        return JSON.parse(objOrStr);
      } catch {
        return null;
      }
    }
    return objOrStr;
  }

  // Always robustly parse ticketToken and prize
  const ticketToken = robustParse(raffle.ticketToken);
  const prize = robustParse(raffle.prize);

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

  // Format dates for display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  // Create profile link
  const creatorProfileLink = creatorUsername
    ? `https://warpcast.com/${creatorUsername}`
    : "#";

  const ticketTokenAddress =
    ticketToken?.contractAddress ||
    ticketToken?.address ||
    "0xDUMMY_CONTRACT_ADDRESS";

  // Fetch ticket balance when user or raffle changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (isAuthenticated && profile && ticketTokenAddress) {
        setIsBalanceLoading(true);
        let balance = 0;
        try {
          balance = await getZoraCoinBalance(
            profile.verifications?.[0],
            ticketTokenAddress
          );
        } catch (e) {
          // If error, leave balance at 0
        }
        setTicketBalance(balance || 0);
        setIsBalanceLoading(false);
      } else {
        setTicketBalance(0);
      }
    };
    fetchBalance();
  }, [isAuthenticated, profile, ticketTokenAddress]);

  const handleBuyTickets = async () => {
    if (!isAuthenticated || !profile || !ticketTokenAddress) return;
    setIsBuying(true);
    await buyZoraCoins(
      profile.verifications?.[0],
      ticketTokenAddress,
      buyAmount
    );
    // Refresh balance
    const balance = await getZoraCoinBalance(
      profile.verifications?.[0],
      ticketTokenAddress
    );
    setTicketBalance(balance);
    setIsBuying(false);
  };

  const handleSellTickets = async () => {
    if (!isAuthenticated || !profile || !ticketTokenAddress) return;
    setIsSelling(true);
    await sellZoraCoins(
      profile.verifications?.[0],
      ticketTokenAddress,
      sellAmount
    );
    // Refresh balance
    const balance = await getZoraCoinBalance(
      profile.verifications?.[0],
      ticketTokenAddress
    );
    setTicketBalance(balance);
    setIsSelling(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/70 backdrop-blur-md border border-enamel-red rounded-lg shadow-md p-4">
        <Card className="shadow-none bg-transparent p-0">
          {/* Header with Close Button */}
          <div className="flex justify-between items-center mb-6 px-4 md:px-0 pt-4 md:pt-0">
            <h2 className="text-xl font-bold">{raffle.title}</h2>
            {!isInFrame && (
              <Button
                aria-label="Close"
                onClick={onClose}
                size="small"
                layout="link"
                className="rounded-full p-1"
              >
                <XMarkIcon className="w-6 h-6" />
              </Button>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-8 w-full px-4 md:px-0 pb-4 md:pb-0">
            {/* Left Column - Info */}
            <div className={`${isEntrant ? "md:w-2/3" : "w-full"}`}>
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
                  <Card className="relative shadow-xl overflow-visible max-w-4xl w-full p-3">
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
                    </div>
                  </Card>
                </div>
              )}

              {/* Prize Information */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-asphalt mb-2">
                  Prize Pool
                </h3>
                <Card className="relative shadow-xl overflow-visible max-w-4xl w-full p-3">
                  <div className="mb-2">
                    <span className="text-sm text-cement">Total Amount:</span>
                    <p className="font-medium">
                      ${prize?.amount || 500} {prize?.currency || "USDC"}
                    </p>
                  </div>
                  {/* Contract Address */}
                  {ticketToken?.contractAddress && (
                    <div className="text-xs text-cement mb-2">
                      Contract Address:{" "}
                      <span className="font-mono break-all">
                        {ticketToken.contractAddress}
                      </span>
                    </div>
                  )}
                  {/* Prize Distribution Table */}
                  {(prize?.distribution || (prize && Array.isArray(prize))) && (
                    <div className="mt-3">
                      <span className="block text-sm font-medium text-cement mb-1">
                        Prize Distribution
                      </span>
                      <table className="min-w-full text-xs">
                        <thead>
                          <tr className="text-cement">
                            <th className="px-2 py-1 text-left">Place</th>
                            <th className="px-2 py-1 text-left">Winners</th>
                            <th className="px-2 py-1 text-left">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Array.isArray(prize?.distribution) ? prize.distribution : Array.isArray(prize) ? prize : []).map((tier, idx) => (
                            <tr key={idx}>
                              <td className="px-2 py-1 font-semibold">
                                {tier.position ||
                                  `${idx + 1}${[
                                    "st",
                                    "nd",
                                    "rd",
                                    "th",
                                  ][Math.min(idx, 3)]}`}
                              </td>
                              <td className="px-2 py-1">
                                {tier.winners || 1}
                              </td>
                              <td className="px-2 py-1">
                                ${tier.amount} {prize.currency || "USDC"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Right Column - Actions (Entrant only) */}
            {isEntrant && (
              <div className="md:w-1/3 space-y-4">
                <Card className="relative shadow-xl overflow-visible w-full p-6">
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

                  {/* Ticket Token Balance & Buy/Sell */}
                  {isAuthenticated && ticketTokenAddress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-cement">
                          Your Ticket Balance:
                        </span>
                        {isBalanceLoading ? (
                          <span className="text-xs text-gray-400">
                            Loading...
                          </span>
                        ) : (
                          <span className="font-mono">{ticketBalance}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        {/* Buy Tickets */}
                        <div className="flex flex-col gap-2">
                          <Label
                            className="text-sm font-medium text-cement"
                            htmlFor="buy-amount"
                          >
                            Buy Tickets
                          </Label>
                          <div className="flex gap-2 w-full">
                            <input
                              id="buy-amount"
                              type="number"
                              min={1}
                              step="0.000000001"
                              value={buyAmount}
                              onChange={(e) => setBuyAmount(e.target.value)}
                              className="w-full border rounded p-2 text-sm font-mono"
                              placeholder="Amount to buy"
                            />
                            <Button
                              size="small"
                              className="bg-green-600 hover:bg-green-700 px-6"
                              onClick={handleBuyTickets}
                              disabled={isBuying}
                            >
                              {isBuying ? "Buying..." : "Buy"}
                            </Button>
                          </div>
                        </div>
                        {/* Sell Tickets */}
                        <div className="flex flex-col gap-2">
                          <Label
                            className="text-sm font-medium text-cement"
                            htmlFor="sell-amount"
                          >
                            Sell Tickets
                          </Label>
                          <div className="flex gap-2 w-full">
                            <input
                              id="sell-amount"
                              type="number"
                              min={1}
                              step="0.000000001"
                              value={sellAmount}
                              onChange={(e) => setSellAmount(e.target.value)}
                              className="w-full border rounded p-2 text-sm font-mono"
                              placeholder="Amount to sell"
                            />
                            <Button
                              size="small"
                              className="bg-cochineal-red hover:bg-enamel-red px-6"
                              onClick={handleSellTickets}
                              disabled={isSelling}
                            >
                              {isSelling ? "Selling..." : "Sell"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => handleJoinRaffle(raffle.id)}
                      disabled={
                        !isAuthenticated || hasEntered || !selectedAddress
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
                </Card>
              </div>
            )}
          </div>

          {/* Share Modal */}
          {showShareModal && (
            <ShareModal
              raffle={raffle}
              onClose={() => setShowShareModal(false)}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

RaffleDetailsPanel.propTypes = {
  raffle: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  isInFrame: PropTypes.bool,
  isEntrant: PropTypes.bool,
};

export default RaffleDetailsPanel;
