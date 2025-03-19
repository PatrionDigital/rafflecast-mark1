// React and Package imports
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

// Farcast Auth-kit Profile
import { useProfile } from "@farcaster/auth-kit";

// Custom hooks
import { useRaffle } from "../hooks/useRaffle";
import { getCreatorUsername } from "../utils/farcasterUtils";

// Components
import ShareModal from "./ShareModal";

const RaffleDetailsPanel = ({ raffle, onClose }) => {
  const {
    eligibilityStatus,
    updateEligibilityStatus,
    addEntry,
    getRaffleById,
    checkLikeCondition,
    getEntriesByEntrant,
  } = useRaffle();

  // Component state
  const { linkedCast } = raffle.criteria || {};
  const { isAuthenticated, profile } = useProfile();
  const [criteriaCastData, setCriteriaCastData] = useState({});
  const [selectedAddress, setSelectedAddress] = useState("");
  const [hasEntered, setHasEntered] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState(null);
  const [creatorLoading, setCreatorLoading] = useState(true);
  const [creatorError, setCreatorError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Check if the user has already entered the raffle
  useEffect(() => {
    const userEntries = getEntriesByEntrant(profile?.fid);
    const hasEnteredThisRaffle = userEntries.some(
      (entry) => entry.raffleId === raffle.id
    );
    setHasEntered(hasEnteredThisRaffle);
  }, [getEntriesByEntrant, raffle.id, profile?.fid]);

  // Add this useEffect to fetch creator username
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

      if (!raffle.criteria?.linkedCast) {
        updateEligibilityStatus(raffleId, "No linked Cast");
        console.log("Raffle does not have a specified cast.");
        return;
      }

      const hasLiked = await checkLikeCondition(profile.fid, linkedCast);
      if (hasLiked) {
        updateEligibilityStatus(raffleId, "Eligible");
        console.log("User has met Like condition.");
      } else {
        updateEligibilityStatus(raffleId, "Ineligible");
        console.log("User must Like the linked Cast to join this raffle.");
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
      updateEligibilityStatus(raffleId, "Error checking eligibility");
    }
  };

  const handleFetchUserFromCast = async (castHash) => {
    const pinataBaseUrl = "https://api.pinata.cloud/v3/farcaster";
    const jwtToken = import.meta.env.VITE_PINATA_JWT;

    try {
      const castResponse = await fetch(`${pinataBaseUrl}/casts/${castHash}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${jwtToken}`,
        },
      });

      const castData = await castResponse.json();

      if (!castResponse.ok) {
        throw new Error(
          `Failed to fetch cast data: ${castResponse.statusText}`
        );
      }

      const username = castData.cast.author.username;

      setCriteriaCastData((prev) => ({
        ...prev,
        [castHash]: {
          username,
          hashPrefix: castHash.slice(0, 10),
        },
      }));
    } catch (error) {
      console.error("Error fetching user data from cast hash:", error);
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
      console.log("Successfully joined the raffle");
    } catch (error) {
      console.error("Error joining raffle:", error);
    }
  };

  useEffect(() => {
    if (linkedCast && !criteriaCastData[linkedCast]) {
      handleFetchUserFromCast(linkedCast);
    }
  }, [linkedCast, criteriaCastData]);

  const criteriaUrl = criteriaCastData[linkedCast]
    ? `https://warpcast.com/${criteriaCastData[linkedCast].username}/${criteriaCastData[linkedCast].hashPrefix}`
    : "#";

  // Update the creator display section
  const creatorProfileLink = creatorUsername
    ? `https://warpcast.com/${creatorUsername}`
    : "#";

  // Add this helper function to get the status for the current raffle
  const getCurrentEligibilityStatus = () => {
    const statusObj = eligibilityStatus.find(
      (item) => item.raffleId === raffle.id
    );
    return statusObj ? statusObj.status : "Ineligible";
  };

  return (
    <div className="raffle-details-panel">
      <div className="raffle-details-left">
        <button className="close-button" onClick={onClose}>
          <span className="close-icon">&times;</span>
        </button>
        <h2 className="raffle-title">{raffle.title}</h2>
        <div className="raffle-details-creator">
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
              >
                @{creatorUsername}
              </a>
            )}
          </span>
        </div>
        <div className="raffle-details-dates">
          <span>Start: {new Date(raffle.startDate).toLocaleDateString()}</span>
          <span>End: {new Date(raffle.closingDate).toLocaleDateString()}</span>
        </div>
        <div className="raffle-details-description">
          <p>{raffle.description}</p>
        </div>
      </div>
      <div className="raffle-details-right">
        <div className="raffle-details-criteria">
          {criteriaCastData ? (
            <button onClick={() => window.open(criteriaUrl, "_blank")}>
              {`Like this cast to enter the raffle`}
            </button>
          ) : (
            <p>Loading cast information...</p>
          )}
          {isAuthenticated && getCurrentEligibilityStatus() === "Eligible" && (
            <div className="address-selector">
              <select
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                disabled={!profile}
              >
                <option value="">
                  Select Ethereum Address to send rewards to
                </option>
                {profile?.verifications?.map((address, index) => (
                  <option key={index} value={address}>
                    {address}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="raffle-actions">
          <button
            onClick={() => handleCheckEligibility(raffle.id)}
            disabled={!isAuthenticated || !profile}
            style={{
              backgroundColor:
                getCurrentEligibilityStatus() === "Eligible" ? "green" : "red",
            }}
          >
            {getCurrentEligibilityStatus() === "Eligible"
              ? "Eligible"
              : "Check Eligibility"}
          </button>
          <button
            onClick={() => handleJoinRaffle(raffle.id)}
            disabled={
              getCurrentEligibilityStatus() !== "Eligible" || hasEntered
            }
          >
            {hasEntered ? "Already Entered" : "Join Raffle"}
          </button>

          <button
            className="share-button"
            onClick={() => setShowShareModal(true)}
          >
            Share Raffle
          </button>
        </div>
      </div>

      {showShareModal && (
        <ShareModal raffle={raffle} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

export default RaffleDetailsPanel;

RaffleDetailsPanel.propTypes = {
  raffle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    creator: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    closingDate: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    criteria: PropTypes.shape({
      linkedCast: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
