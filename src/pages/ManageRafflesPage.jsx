import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "@farcaster/auth-kit";
import { useRaffle } from "../hooks/useRaffle";
import { settleRaffle } from "../utils/raffleUtils";

const ManageRafflesPage = () => {
  const { isAuthenticated, profile } = useProfile();
  const { getRafflesByCreator, getEntriesByRaffleId } = useRaffle();
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [fetchingEntries, setFetchingEntries] = useState(false);
  const { fid = "" } = profile || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (fid) {
      setLoading(true);
      try {
        const fetchedRaffles = getRafflesByCreator(fid);

        //console.log("Fetched Raffles:", fetchedRaffles);
        setRaffles(fetchedRaffles);
      } catch (error) {
        console.error("Error fetching raffles:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [fid, getRafflesByCreator]);

  const handleCheckEntries = async (raffleId) => {
    console.log("RaffleId to check:", raffleId);
    setFetchingEntries(true);
    setSelectedRaffle(raffleId);
    try {
      const fetchedEntries = await getEntriesByRaffleId(raffleId);
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setFetchingEntries(false);
    }
  };

  const handleSettleRaffle = async (raffleId) => {
    if (!raffles || raffles.length === 0) {
      console.log("No raffles available to settle.");
      return;
    }

    try {
      const raffle = raffles.find((r) => r.id === raffleId);
      const entriesForRaffle = await getEntriesByRaffleId(raffleId);
      const result = await settleRaffle(raffle, entriesForRaffle);

      if (result.success) {
        console.log(`Raffle ${raffleId} has been settled.`);
        navigate(`/creator/distribute-rewards/${raffleId}`, {
          state: {
            winners: result.winners.map((winner) => winner.prizeWallet),
          },
        });
      } else {
        console.log(result.error || "Error settling raffle");
      }
    } catch (error) {
      console.log(error.message || "Error settling raffle");
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
    <div className="page-container">
      <div className="section">
        <h3>Manage Raffles</h3>
        <ul>
          {raffles.map((raffle) => {
            const isClosingPassed = new Date(raffle.closingDate) < new Date();
            const isInActivePhase = raffle.phase === "Active";

            return (
              <li key={raffle.id}>
                <h4>{raffle.name}</h4>
                <p>
                  Closing Date: {new Date(raffle.closingDate).toLocaleString()}
                </p>
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

                {isClosingPassed && isInActivePhase && (
                  <button
                    onClick={() => handleSettleRaffle(raffle.id)}
                    style={{ backgroundColor: "orange", color: "white" }}
                  >
                    Settle Raffle
                  </button>
                )}
              </li>
            );
          })}
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
    </div>
  );
};

export default ManageRafflesPage;
