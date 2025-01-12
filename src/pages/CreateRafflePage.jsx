import { useState, useEffect } from "react";
import { useProfile } from "@farcaster/auth-kit";
import { v4 as uuidv4 } from "uuid";
import { useRaffle } from "../context/useRaffle";

const CreateRafflePage = () => {
  const [raffleTitle, setRaffleTitle] = useState("");
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

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthenticated, profile } = useProfile();
  const { fid = "", custody = "" } = profile || {};
  const { addRaffle, eventMessage, clearMessage } = useRaffle();

  useEffect(() => {
    // Reset the RaffleContext eventMessage when loading new component/page
    clearMessage();
  }, [clearMessage]);

  const validateDates = ({ startDate, closingDate, challengePeriod }) => {
    const now = new Date();
    const start = new Date(startDate);
    const close = new Date(closingDate);
    const challengeEnd = new Date(challengePeriod);

    if (start < now) {
      return "Start date cannot be in the past.";
    }
    if (close <= start) {
      return "Closing date must be after the start date.";
    }
    if (challengeEnd <= close) {
      return "Challenge period must be on or after the closing date.";
    }
    return null;
  };
  const handleStartDateChange = (event) => {
    const selectedDate = event.target.value;
    const dateObject = new Date(selectedDate);
    setStartDate(dateObject.toISOString()); // Keep full timestamp in state
  };

  const handleClosingDateChange = (event) => {
    const selectedDate = event.target.value;
    const dateObject = new Date(selectedDate);
    setClosingDate(dateObject.toISOString()); // Keep full timestamp in state
  };

  const handleChallengePeriodChange = (event) => {
    const selectedDate = event.target.value;
    const dateObject = new Date(selectedDate);
    setChallengePeriod(dateObject.toISOString()); // Keep full timestamp in state
  };

  const handleCreateRaffle = async () => {
    if (!isAuthenticated) {
      return; // Block creating if user isn't logged in.
    }

    setError("");
    setIsSubmitting(true);

    const validationError = validateDates(
      startDate,
      closingDate,
      challengePeriod
    );

    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    const newRaffle = {
      id: uuidv4(),
      creator: fid,
      title: raffleTitle,
      description: "A Rafflecast raffle",
      startDate,
      closingDate,
      challengePeriod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phase: "Active",
      criteria: {
        // hardcoded for testing
        type: "like",
        linkedCast: "0xc2c6f9642ebe6f74eda4b5575c701431d16ca290",
      },
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
      {(eventMessage || error) && (
        <div
          style={{
            background: "#f0f8ff",
            color: "#333",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          {error || eventMessage}
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
                value={raffleTitle}
                onChange={(e) => setRaffleTitle(e.target.value)}
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
                onChange={handleStartDateChange}
              />
            </label>
          </div>
          <div>
            <label>
              Closing Date:
              <input
                type="date"
                value={closingDate}
                onChange={handleClosingDateChange}
              />
            </label>
          </div>
          <div>
            <label>
              Challenge Period Ends:
              <input
                type="date"
                value={challengePeriod}
                onChange={handleChallengePeriodChange}
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
