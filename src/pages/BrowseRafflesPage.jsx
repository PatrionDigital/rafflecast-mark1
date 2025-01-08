import { useEffect, useState } from "react";
import { useRaffle } from "../context/useRaffle";
import { v4 as uuidv4 } from "uuid";
import { useProfile } from "@farcaster/auth-kit";

const BrowseRafflesPage = () => {
  const { getRafflesByPhase, addEntry, eventMessage, clearMessage } =
    useRaffle();
  const { isAuthenticated, profile } = useProfile();
  const [activeRaffles, setActiveRaffles] = useState([]);

  useEffect(() => {
    // Reset the RaffleContext eventMessage when loading new component/page
    clearMessage();
  }, [clearMessage]);

  useEffect(() => {
    const loadActiveRaffles = async () => {
      const fetchedActiveRaffles = await getRafflesByPhase("Active");
      // Filter out any raffles that are missing the 'phase' property
      const validRaffles = fetchedActiveRaffles.filter((raffle) =>
        raffle && raffle.phase ? true : false
      );
      setActiveRaffles(validRaffles);
    };
    loadActiveRaffles();
  }, [getRafflesByPhase]);

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
            <li key={raffle.id}>
              <strong>{raffle.name}</strong> - Linked Cast: {raffle.linkedcast}
              <br />
              Creator: {raffle.creator}
              <br />
              <em>Phase: {raffle?.phase || "Not Available"}</em>
              <br />
              <button
                onClick={() => handleJoinRaffle(raffle.id)}
                disabled={!isAuthenticated}
              >
                Join
              </button>
            </li>
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

export default BrowseRafflesPage;
