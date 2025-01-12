import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRaffle } from "../context/useRaffle";
import { v4 as uuidv4 } from "uuid";
import { useProfile } from "@farcaster/auth-kit";
import {
  checkLikeCondition,
  //checkRecastCondition,
} from "../utils/farcasterUtils";

const BrowseRafflesPage = () => {
  const {
    getRafflesByPhase,
    getRaffleById,
    addEntry,
    eventMessage,
    clearMessage,
  } = useRaffle();
  const { isAuthenticated, profile } = useProfile();
  const [activeRaffles, setActiveRaffles] = useState([]);
  const [eligibilityStatus, setEligibilityStatus] = useState({});
  const [casterData, setCasterData] = useState({});

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
        setEligibilityStatus((prev) => ({
          ...prev,
          [raffleId]: "No linked Cast",
        }));
        console.log("Raffle does not have a specified cast.");
        return;
      }

      const hasLiked = await checkLikeCondition(
        profile.fid,
        raffle.criteria.linkedCast
      );
      if (hasLiked) {
        setEligibilityStatus((prev) => ({ ...prev, [raffleId]: "Eligible" }));
        console.log("User has met Like condition.");
      } else {
        setEligibilityStatus((prev) => ({
          ...prev,
          [raffleId]: "Not Eligible",
        }));
        console.log("User must Like the linked Cast to join this raffle.");
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
      setEligibilityStatus((prev) => ({
        ...prev,
        [raffleId]: "Error checking eligibility",
      }));
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
    const participant = profile.fid;

    const entryData = {
      id: uuidv4(),
      raffleId,
      participant,
      enteredAt: new Date(),
    };

    try {
      await addEntry(entryData);
    } catch (error) {
      console.error("Error joining raffle:", error);
    }
  };

  return (
    <div>
      <h2>Browse Raffles</h2>
      {!isAuthenticated && (
        <p style={{ color: "red", fontWeight: "bold" }}>
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
      <ul>
        {activeRaffles.length > 0 ? (
          activeRaffles.map((raffle) => (
            <RaffleItem
              key={raffle.id}
              raffle={raffle}
              isAuthenticated={isAuthenticated}
              eligibilityStatus={eligibilityStatus[raffle.id]}
              onCheckEligibility={handleCheckEligibility}
              onJoinRaffle={handleJoinRaffle}
              onFetchUser={handleFetchUserFromCast}
              casterData={casterData}
            />
          ))
        ) : (
          <p>
            No raffles available. Why not <a href="/creator">create one?</a>
          </p>
        )}
      </ul>
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
  const shouldDisableJoin =
    !isAuthenticated || !eligibilityStatus || eligibilityStatus !== "Eligible";

  return (
    <li>
      <strong>{raffle.title}</strong>
      <br />
      Creator: {raffle.creator} -
      <em> Phase: {raffle?.phase || "Not Available"}</em>
      <br />
      <em>Eligibility Conditions: {raffle.criteria.type} this cast:</em>
      <br />
      {caster ? (
        <a
          href={criteriaUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {criteriaUrl}
        </a>
      ) : (
        <p>Loading cast information...</p>
      )}
      <br />
      <button
        onClick={() => onJoinRaffle(raffle.id)}
        disabled={shouldDisableJoin}
      >
        Join
      </button>
      <button
        onClick={() => onCheckEligibility(raffle.id)}
        disabled={!isAuthenticated}
      >
        Check Eligibility
      </button>
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
    </li>
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
};

export default BrowseRafflesPage;
