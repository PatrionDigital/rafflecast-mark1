import { useEffect, useState } from "react";
import { useRaffle } from "../context/useRaffle";
import { useProfile } from "@farcaster/auth-kit";

const BrowseEntriesPage = () => {
  const { entries, clearMessage } = useRaffle();
  const { isAuthenticated, profile } = useProfile();
  const [userEntries, setUserEntries] = useState([]);

  useEffect(() => {
    // Reset the RaffleContext eventMessage when loading new component/page
    clearMessage();
  }, [clearMessage]);

  useEffect(() => {
    if (isAuthenticated && profile?.fid) {
      const entriesForUser = entries.filter(
        (entry) => entry.participant === profile.fid
      );
      setUserEntries(entriesForUser);
    }
  }, [entries, isAuthenticated, profile?.fid]);

  if (!isAuthenticated)
    return (
      <p style={{ color: "red", fontWeight: "bold" }}>
        Please log in with Warpcast to view your entries.
      </p>
    );

  if (userEntries.length === 0) {
    return <p>You have not entered any raffles</p>;
  }

  return (
    <div>
      <h1>Your Entries</h1>
      <ul>
        {userEntries.map((entry) => (
          <li key={entry.id}>
            <p>Raffle ID: {entry.raffleId}, Entered At: </p>
            <p>{new Date(entry.enteredAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrowseEntriesPage;
