import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "@farcaster/auth-kit";
import { useRaffle } from "../context/useRaffle";

const ManageRafflesPage = () => {
  const { isAuthenticated, profile } = useProfile();
  const {
    getRafflesByCreator,
    getEntriesByRaffleId,
    eventMessage,
    clearMessage,
  } = useRaffle();
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [fetchingEntries, setFetchingEntries] = useState(false);
  const { fid = "" } = profile || {};

  useEffect(() => {
    // Reset the RaffleContext eventMessage when loading new component/page
    clearMessage();
  }, [clearMessage]);

  useEffect(() => {
    if (fid) {
      setLoading(true);
      getRafflesByCreator(fid)
        .then((fetchedRaffles) => {
          console.log("Fetched Raffles:", fetchedRaffles);
          setRaffles(fetchedRaffles);
        })
        .catch((error) => {
          console.error("Error fetching raffles:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [fid, getRafflesByCreator]);

  const handleCheckEntries = async (raffleID) => {
    setFetchingEntries(true);
    clearMessage();
    setSelectedRaffle(raffleID);
    try {
      const fetchedEntries = await getEntriesByRaffleId(raffleID);
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setFetchingEntries(false);
    }
  };

  if (!isAuthenticated)
    return (
      <>
        <h3>Manage Raffles</h3>
        <p>Please sign in with Warpcast to manage your raffles.</p>
      </>
    );
  if (loading)
    return (
      <>
        <h3>Manage Raffles</h3>
        <p>Loading your raffles...</p>
      </>
    );
  if (!raffles.length)
    return (
      <>
        <h3>Manage Raffles</h3>
        <p>You have no raffles yet.</p>
        <p>
          <Link to="/creator/raffles/new">Create a new raffle.</Link>
        </p>
      </>
    );

  return (
    <div>
      <h3>Manage Raffles</h3>
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
        {raffles.map((raffle) => (
          <li key={raffle.id}>
            <h4>{raffle.name}</h4>
            <p>Closing Date: {raffle.closingDate}</p>
            <button
              onClick={() => handleCheckEntries(raffle.id)}
              disabled={fetchingEntries && selectedRaffle === raffle.id}
            >
              {fetchingEntries && selectedRaffle === raffle.id
                ? "Loading..."
                : "Check Entries"}
            </button>
            <button onClick={() => console.log(`Edit ${raffle.id}`)}>
              Edit
            </button>
          </li>
        ))}
      </ul>

      {/** Show entries for the selected raffle */}
      {selectedRaffle && (
        <div>
          <h4>Entries for Raffle {selectedRaffle}</h4>
          {fetchingEntries ? (
            <p>Loading entries...</p>
          ) : entries.length === 0 ? (
            <p>No entries found for this raffle.</p>
          ) : (
            <ul>
              {entries.map((entry) => (
                <li key={entry.id}>
                  <p>Participant: {entry.participant}</p>
                  <p>
                    Entered At: {new Date(entry.enteredAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageRafflesPage;
