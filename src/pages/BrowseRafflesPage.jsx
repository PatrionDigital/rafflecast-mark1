import { useEffect, useState } from "react";
import { useRaffle } from "../context/useRaffle";
//import { Link } from "react-router-dom";
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
      setActiveRaffles(fetchedActiveRaffles);
    };
    loadActiveRaffles();
  }, [getRafflesByPhase]);

  const handleJoinRaffle = async (raffleId) => {
    const participant = profile.fid;

    const entryData = {
      raffleId,
      participant,
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
              <em>Phase: {raffle.phase}</em>
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
            No raffles available. Why not <a href="/create">create one?</a>
          </p>
        )}
      </ul>
    </div>
  );
};

export default BrowseRafflesPage;
