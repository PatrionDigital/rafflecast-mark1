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
} from "@heroicons/react/24/outline";

// Use our custom auth hook
import { useAuth } from "@/hooks/useAuth";

// Custom hooks
import { useRaffle } from "../hooks/useRaffle";
import { getCreatorUsername } from "../utils/farcasterUtils";

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
