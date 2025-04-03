import { useProfile } from "@farcaster/auth-kit";
import { useEffect, useMemo, useState } from "react";

import { useRaffle } from "@/hooks/useRaffle";

const BrowseEntriesPage = () => {
  const { entries, clearMessage } = useRaffle();
  const { isAuthenticated, profile } = useProfile();
  const [userEntries, setUserEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset the RaffleContext eventMessage when loading new component/page
    clearMessage();
  }, [clearMessage]);

  useEffect(() => {
    if (isAuthenticated && profile?.fid && entries?.length > 0) {
      setLoading(true);
      try {
        const entriesForUser = entries.filter(
          (entry) => entry.participant === profile.fid
        );
        setUserEntries(entriesForUser);
      } catch (e) {
        setError("Error fetching entries.", e.message);
      } finally {
        setLoading(false);
      }
    }
  }, [entries, isAuthenticated, profile?.fid]);

  const userEntriesMemo = useMemo(() => {
    return userEntries.map((entry) => (
      <li key={entry.id}>
        <p>Raffle ID: {entry.raffleId}</p>
        <p>Entered At: {new Date(entry.enteredAt).toLocaleDateString()}</p>
      </li>
    ));
  }, [userEntries]);

  if (!isAuthenticated)
    return (
      <p style={{ color: "red", fontWeight: "bold" }}>
        Please log in with Warpcast to view your entries.
      </p>
    );
  if (loading) return <p>Loading your entries...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (userEntries.length === 0) {
    return <p>You have not entered any raffles</p>;
  }

  return (
    <div>
      <h1>Your Entries</h1>
      <ul>{userEntriesMemo}</ul>
    </div>
  );
};

export default BrowseEntriesPage;
