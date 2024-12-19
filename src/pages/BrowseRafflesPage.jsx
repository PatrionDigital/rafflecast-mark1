import { useEffect, useState } from "react";
import { useRaffle } from "../context/useRaffle";

const BrowseRafflesPage = () => {
  const { getRafflesByPhase } = useRaffle();
  const [activeRaffles, setActiveRaffles] = useState([]);

  useEffect(() => {
    const loadActiveRaffles = async () => {
      const fetchedActiveRaffles = await getRafflesByPhase("Active");
      setActiveRaffles(fetchedActiveRaffles);
    };
    loadActiveRaffles();
  }, [getRafflesByPhase]);

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
