import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRaffle } from "../context/useRaffle";

const BrowseEntriesPage = () => {
  const { raffleId } = useParams();
  const { entries } = useRaffle();
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    if (raffleId) {
      const entriesForRaffle = entries.filter(
        (entry) => entry.raffleId === raffleId
      );
      setFilteredEntries(entriesForRaffle);
    }
  }, [raffleId, entries]);

  if (!raffleId) return <p>Error: No Raffle ID provided.</p>;
  if (filteredEntries.length === 0)
    return <p>No entries found for this raffle.</p>;

  return (
    <div>
      <h1>Entries for Raffle {raffleId}</h1>
      <ul>
        {filteredEntries.map((entry) => (
          <li key={entry.id}>
            <p>Participant: {entry.participant}, Entered At: </p>
            <p>{new Date(entry.enteredAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrowseEntriesPage;
