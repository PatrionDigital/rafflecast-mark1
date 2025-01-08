import { useState, useEffect } from "react";
import { useProfile } from "@farcaster/auth-kit";
import { useRaffle } from "../context/useRaffle";

const CreateRafflePage = () => {
  const [raffleName, setRaffleName] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [closingDate, setClosingDate] = useState(() => {
    const oneWeekFromToday = new Date();
    oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7);
    return oneWeekFromToday.toISOString().split("T")[0];
  });
  const [challengePeriod, setChallengePeriod] = useState(() => {
    const twoWeeksFromToday = new Date();
    twoWeeksFromToday.setDate(twoWeeksFromToday.getDate() + 14);
    return twoWeeksFromToday.toISOString().split("T")[0];
  });

  const { isAuthenticated, profile } = useProfile();
  const { fid = "", custody = "" } = profile || {};
  const { addRaffle, eventMessage, clearMessage } = useRaffle();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Reset the RaffleContext eventMessage when loading new component/page
    clearMessage();
  }, [clearMessage]);

  const handleCreateRaffle = async () => {
    if (!isAuthenticated) {
      return; // Block creating if user isn't logged in.
    }
    setIsSubmitting(true);
    const newRaffle = {
      creator: fid,
      name: raffleName,
      linkedCast: "https://warpcase.com/test",
      startDate,
      closingDate,
      challengePeriod,
    };
    try {
      await addRaffle(newRaffle);
    } catch (error) {
      console.error("Error creating raffle:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <h3>Create a New Raffle</h3>
      {!isAuthenticated && (
        <p>Please sign in with Warpcast to create a new raffle.</p>
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
      {isAuthenticated && (
        <>
          <div>
            <label>
              Farcaster FID:
              <input type="text" value={fid} readOnly />
            </label>
          </div>
          <div>
            <label>
              Custody Address:
              <input type="text" value={custody} readOnly />
            </label>
          </div>
          <div>
            <label>
              Set Raffle Title:
              <input
                type="text"
                value={raffleName}
                onChange={(e) => setRaffleName(e.target.value)}
                placeholder="Enter raffle title"
              />
            </label>
          </div>
          <div>
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Closing Date:
              <input
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Challenge Period Ends:
              <input
                type="date"
                value={challengePeriod}
                onChange={(e) => setChallengePeriod(e.target.value)}
              />
            </label>
          </div>
          <button onClick={handleCreateRaffle} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Add Raffle"}
          </button>
        </>
      )}
    </div>
  );
};

export default CreateRafflePage;
