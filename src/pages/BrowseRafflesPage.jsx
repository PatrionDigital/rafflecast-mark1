import { useEffect, useState } from "react";
import { useRaffle } from "../context/useRaffle";
import { Link } from "react-router-dom";

const BrowseRafflesPage = () => {
  const { getRafflesByPhase, addEntry } = useRaffle();
  const [activeRaffles, setActiveRaffles] = useState([]);

  useEffect(() => {
    const loadActiveRaffles = async () => {
      const fetchedActiveRaffles = await getRafflesByPhase("Active");
      setActiveRaffles(fetchedActiveRaffles);
    };
    loadActiveRaffles();
  }, [getRafflesByPhase]);

  const handleJoinRaffle = async (raffleId) => {
    const participant = "0x123..."; // Hardcoded for testing.

    const entryData = {
      raffleId,
      participant,
    };

    try {
      await addEntry(entryData);

      // Update local state to reflect the change (optional UI feedback)
      /*
      setActiveRaffles((prevRaffles) =>
        prevRaffles.map((raffle) =>
          raffle.id === raffleId
            ? {
                ...raffle,
                participantCount: (raffle.participantCount || 0) + 1,
              }
            : raffle
        )
      );*/

      alert(`Successfully joined raffle ${raffleId}!`);
    } catch (error) {
      console.error("Error joining raffle:", error);
      alert("Could not join the raffle. Please try again.");
    }
  };

  return (
    <div>
      <h1>Browse Raffles</h1>
      <p>Here, users can view all active raffles.</p>
      <h2>All Active Raffles</h2>
      <ul>
        {activeRaffles.length > 0 ? (
          activeRaffles.map((raffle) => (
            <li key={raffle.id}>
              <strong>{raffle.name}</strong> - Linked Cast: {raffle.linkedCast}
              <br />
              Creator: {raffle.creator}
              <br />
              <em>Phase: {raffle.phase}</em>
              <br />
              <button onClick={() => handleJoinRaffle(raffle.id)}>Join</button>
              <Link to={`/admin/entries/${raffle.id}`}>
                <button>View Entries</button>
              </Link>
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
