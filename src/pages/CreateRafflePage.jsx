import { useState } from "react";
import { useProfile } from "@farcaster/auth-kit";
import { v4 as uuidv4 } from "uuid";
import { useRaffle } from "../hooks/useRaffle";
import { useNavigate } from "react-router-dom";

const CreateRafflePage = () => {
  const [raffleTitle, setRaffleTitle] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [startTime, setStartTime] = useState("12:00");
  const [closingDate, setClosingDate] = useState(() => {
    const oneWeekFromToday = new Date();
    oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7);
    return oneWeekFromToday.toISOString().split("T")[0];
  });
  const [closingTime, setClosingTime] = useState("12:00");
  const [challengePeriod, setChallengePeriod] = useState(() => {
    const twoWeeksFromToday = new Date();
    twoWeeksFromToday.setDate(twoWeeksFromToday.getDate() + 14);
    return twoWeeksFromToday.toISOString().split("T")[0];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthenticated, profile } = useProfile();
  const { fid = "", custody = "" } = profile || {};
  const { addRaffle } = useRaffle();
  const navigate = useNavigate();

  const validateDates = ({ startDate, closingDate, challengePeriod }) => {
    const now = new Date();
    const start = new Date(startDate);
    const close = new Date(closingDate);
    const challengeEnd = new Date(challengePeriod);

    if (start < now) {
      console.log("Start date cannot be in the past.");
      return false;
    }
    if (close <= start) {
      console.log("Closing date must be after the start date.");
      return false;
    }
    if (challengeEnd <= close) {
      console.log("Challenge period must be on or after the closing date.");
      return false;
    }
    return true;
  };
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };
  const handleClosingDateChange = (event) => {
    setClosingDate(event.target.value);
  };
  const handleClosingTimeChange = (event) => {
    setClosingTime(event.target.value);
  };
  const handleChallengePeriodChange = (event) => {
    setChallengePeriod(event.target.value);
  };

  const handleCreateRaffle = async () => {
    if (!isAuthenticated) {
      return; // Block creating if user isn't logged in.
    }

    setIsSubmitting(true);

    const validationError = validateDates(
      startDate,
      closingDate,
      challengePeriod
    );

    if (!validationError) {
      const newRaffle = {
        id: uuidv4(),
        creator: fid,
        title: raffleTitle,
        description: "A Rafflecast raffle",
        startDate,
        startTime,
        closingDate,
        closingTime,
        challengePeriod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        phase: "Active",
        criteria: JSON.stringify({
          // hardcoded for testing
          type: "like",
          linkedCast: "0xc2c6f9642ebe6f74eda4b5575c701431d16ca290",
        }),
        distributions: JSON.stringify({
          // Empty Reward Distribution Data
          rewards: [
            {
              token: "0x0000000000000000DEAD",
              erc20: "true",
              amountPerClaim: "0",
              startTime: "12:00",
              endTime: "12:00",
              merkleRoot: "0x0000000000000000DEAD",
              title: "Rafflecast Prize",
            },
          ],
        }),
      };
      try {
        await addRaffle(newRaffle);
        console.log("Raffle created successfully!");
        navigate("/creator/raffles/manage");
      } catch (error) {
        console.log(error.message || "Failed to create raffle");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="page-container">
      <div className="form-section">
        <h3>Create a New Raffle</h3>
        {!isAuthenticated && (
          <div>Please sign in with Warpcast to create a new raffle.</div>
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
              <label>
                Start Time:
                <input
                  type="time"
                  value={startTime}
                  onChange={handleStartTimeChange}
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
              <label>
                Closing Time:
                <input
                  type="time"
                  value={closingTime}
                  onChange={handleClosingTimeChange}
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
    </div>
  );
};

export default CreateRafflePage;
