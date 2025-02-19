import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRaffle } from "../hooks/useRaffle";
import { v4 as uuidv4 } from "uuid";
import { useProfile } from "@farcaster/auth-kit";
import {
  checkLikeCondition,
  //checkRecastCondition,
} from "../utils/farcasterUtils";
import { useMessages } from "../hooks/useMessageContext";
import "../styles/messages.css"; // Import messages.css

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const BrowseRafflesPage = () => {
  const {
    getRafflesByPhase,
    getRaffleById,
    addEntry,
    eventMessage,
    clearMessage,
    eligibilityStatus,
    updateEligibilityStatus,
  } = useRaffle();
  const { isAuthenticated, profile } = useProfile();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [activeRaffles, setActiveRaffles] = useState([]);
  const [casterData, setCasterData] = useState({});
  const { addMessage } = useMessages();

  useEffect(() => {
    // Reset the RaffleContext eventMessage when loading new component/page
    clearMessage();
  }, [clearMessage]);

  useEffect(() => {
    const loadActiveRaffles = async () => {
      const fetchedActiveRaffles = await getRafflesByPhase("Active");
      const validRaffles = fetchedActiveRaffles.filter((raffle) =>
        raffle && raffle.phase ? true : false
      );
      setActiveRaffles(validRaffles);
    };
    loadActiveRaffles();
  }, [getRafflesByPhase]);

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

      const hasLiked = await checkLikeCondition(
        profile.fid,
        raffle.criteria.linkedCast
      );
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

      setCasterData((prev) => ({
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
      addMessage("Please select an Ethereum address.", "error");
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
    } catch (error) {
      addMessage(error.message || "Error joining raffle", "error");
    }
  };

  return (
    <div className={`page-container ${isAuthenticated ? "logged-in" : ""}`}>
      <div className="section">
        <h2>Browse Raffles</h2>
        {!isAuthenticated && (
          <p className="auth-message">
            Please log in with Warpcast to join raffles.
          </p>
        )}
        {/** Message banner */}
        {eventMessage && (
          <div
            style={{
              background: "#f0f8ff",
              color: "#333",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {eventMessage}
          </div>
        )}
        <ul className="raffle-list">
          {activeRaffles.length > 0 ? (
            activeRaffles.map((raffle) => (
              <li key={raffle.id} className="raffle-item">
                <RaffleItem
                  raffle={raffle}
                  isAuthenticated={isAuthenticated}
                  eligibilityStatus={eligibilityStatus[raffle.id]}
                  onCheckEligibility={handleCheckEligibility}
                  onJoinRaffle={handleJoinRaffle}
                  onFetchUser={handleFetchUserFromCast}
                  casterData={casterData}
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                  profile={profile}
                />
              </li>
            ))
          ) : (
            <p>
              No raffles available. Why not <a href="/creator">create one?</a>
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

const RaffleItem = ({
  raffle,
  isAuthenticated,
  eligibilityStatus,
  onCheckEligibility,
  onJoinRaffle,
  onFetchUser,
  casterData = {},
  selectedAddress,
  setSelectedAddress,
  profile,
}) => {
  const { linkedCast } = raffle.criteria || {};
  const caster = casterData?.[linkedCast];

  useEffect(() => {
    if (linkedCast && !caster) {
      onFetchUser(linkedCast);
    }
  }, [linkedCast, onFetchUser, caster]);

  const criteriaUrl = caster
    ? `https://warpcast.com/${caster.username}/${caster.hashPrefix}`
    : "#";

  return (
    <div className="raffle-item">
      <strong>{raffle.title}</strong>
      Creator: {raffle.creator}
      <div>
        <label>Eligibility Conditions:</label>
        {caster ? (
          <button onClick={() => window.open(criteriaUrl, "_blank")}>
            {capitalizeFirstLetter(raffle.criteria.type)} this cast
          </button>
        ) : (
          <p>Loading cast information...</p>
        )}
      </div>
      {isAuthenticated && (
        <div>
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            disabled={!profile}
          >
            <option value=" ">Select Ethereum Address</option>
            {profile.verifications.map((address, index) => (
              <option key={index} value={address}>
                {address}
              </option>
            ))}
          </select>
        </div>
      )}
      {isAuthenticated ? (
        eligibilityStatus === "Eligible" ? (
          <button onClick={() => onJoinRaffle(raffle.id)}>Join</button>
        ) : (
          <button
            onClick={() => onCheckEligibility(raffle.id)}
            disabled={!isAuthenticated}
          >
            Check Eligibility
          </button>
        )
      ) : (
        <button disabled>Check Eligibility</button>
      )}
      {eligibilityStatus && (
        <p
          style={{
            fontStyle: "italic",
            color: eligibilityStatus === "Eligible" ? "green" : "red",
          }}
        >
          {eligibilityStatus}
        </p>
      )}
    </div>
  );
};
RaffleItem.propTypes = {
  raffle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    creator: PropTypes.number.isRequired,
    phase: PropTypes.string,
    criteria: PropTypes.shape({
      type: PropTypes.string.isRequired,
      linkedCast: PropTypes.string.isRequired,
    }),
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  eligibilityStatus: PropTypes.string,
  onCheckEligibility: PropTypes.func.isRequired,
  onJoinRaffle: PropTypes.func.isRequired,
  onFetchUser: PropTypes.func.isRequired,
  casterData: PropTypes.object.isRequired,
  selectedAddress: PropTypes.string,
  setSelectedAddress: PropTypes.func.isRequired,
  profile: PropTypes.object,
};

export default BrowseRafflesPage;
