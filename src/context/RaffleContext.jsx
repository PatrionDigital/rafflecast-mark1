// Modified src/context/RaffleContext.jsx
import { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  fetchRaffles,
  fetchEntries,
  addRaffleToDB,
  addEntryToDB,
  updateEntryInDB,
  onRaffleCreated,
  onRaffleEntry,
  onRafflePhaseUpdated,
} from "../utils/tursoUtils";
import { generatePrizeDistribution } from "../utils/zoraUtils";

const RaffleContext = createContext();

export function RaffleProvider({ children }) {
  const [raffles, setRaffles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [eligibilityStatus, setEligibilityStatus] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const fetchedRaffles = await fetchRaffles();
      const fetchedEntries = await fetchEntries();

      setRaffles(fetchedRaffles);
      setEntries(fetchedEntries);

      const intitialELigibilityStatus = fetchedRaffles.map((raffle) => ({
        raffleId: raffle.id,
        status: "Eligible", // Since we're removing criteria, all raffles are eligible by default
      }));
      setEligibilityStatus(intitialELigibilityStatus);
    };
    loadData();
  }, []);

  useEffect(() => {
    const cleanupListeners = [
      onRaffleCreated((response) => {
        console.log("onRaffleCreated received:", response);
        if (response && response.success) {
          console.log("Raffle created successfully:", response.id);
        } else {
          console.error(
            "Error creating raffle:",
            response ? response.error : "Unknown error"
          );
        }
      }),
      onRaffleEntry((data) => {
        console.log("onRaffleEntry received:", data);
        if (data && data.success && data.newEntry) {
          setEntries((prevEntries) => {
            // Check if the entry already exists
            if (prevEntries.some((entry) => entry.id === data.newEntry.id)) {
              return prevEntries;
            }
            return [...(prevEntries || []), data.newEntry];
          });
          console.log("Entry added successfully!");
        } else {
          console.log(`Error adding entry: ${data.error}`);
        }
      }),
      onRafflePhaseUpdated((data) => {
        if (data && data.success && data.raffleId && data.newPhase) {
          setRaffles((prev) =>
            prev.map((raffle) =>
              raffle.id === data.raffleId
                ? { ...raffle, phase: data.newPhase }
                : raffle
            )
          );
          console.log(
            `Raffle ${data.raffleId} updated to phase ${data.newPhase}`
          );
        } else {
          console.log(`Error updating raffle phase: ${data.error}`);
        }
      }),
    ];

    return () => {
      cleanupListeners.forEach((unsub) => unsub && unsub());
    };
  }, []);

  const addRaffle = async (raffleData) => {
    // Add default prize structure if not provided
    if (!raffleData.prize) {
      raffleData.prize = {
        amount: 500,
        currency: "USDC",
        winnerCount: 10,
        distribution: {
          model: "equitable",
          tiers: generatePrizeDistribution(500, 10),
        },
      };
    }

    // Ensure startDate and startTime are set to creation time if not provided
    if (!raffleData.startDate || !raffleData.startTime) {
      const now = new Date();
      raffleData.startDate = now.toISOString().split("T")[0];
      raffleData.startTime = now.toTimeString().split(" ")[0].substring(0, 5);
    }

    // Optimistically Update the state
    setRaffles((prev) => [...prev, raffleData]);
    try {
      await addRaffleToDB(raffleData);
      console.log("Raffle created successfully!");
    } catch (error) {
      console.error("Error adding raffle:", error.message);
      console.log("An error occurred while creating the raffle.");

      // Revert the state update if the database write fails
      setRaffles((prev) =>
        prev.filter((raffle) => raffle.id !== raffleData.id)
      );
    }
  };

  const addEntry = async (entryData) => {
    // TODO: Add Data Validation
    const { raffleId, participant } = entryData;

    // Check if the user has already entered the raffle
    const hasEntered = entries.some(
      (entry) =>
        entry?.raffleId === raffleId && entry?.participant === participant
    );

    if (!hasEntered) {
      // Optimistically Update the state
      setEntries((prev) => [...prev, entryData]);

      try {
        // Try adding the entry to the DB
        await addEntryToDB(entryData);

        // On success, show success message
        console.log("Entry added successfully!");
      } catch (error) {
        // In case of error, show failure message
        console.error("Error adding entry:", error.message);
        console.log("An error occurred while joining the raffle.");

        // Revert the state update if the database write fails
        setEntries((prev) => prev.filter((entry) => entry.id !== entryData.id));
      }
    } else {
      // If the user has already entered, show a message
      console.log("You have already joined this raffle!");
      return;
    }
  };

  const updateRaffle = (id, updates) => {
    try {
      setRaffles((prev) =>
        prev.map((raffle) =>
          raffle.id === id ? { ...raffle, ...updates } : raffle
        )
      );
    } catch (error) {
      console.error("Error updating raffle:", error.message);
    }
  };

  const updateEntry = async (entryId, updates) => {
    try {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, ...updates } : entry
        )
      );

      await updateEntryInDB(entryId, updates);
    } catch (error) {
      console.error("Error updating entry:", error.message);
    }
  };

  const getRafflesByPhase = async (phase) => {
    const filteredRaffles = raffles.filter((raffle) => raffle.phase === phase);
    return filteredRaffles;
  };

  const getRafflesByCreator = (creator) => {
    const filteredRaffles = raffles.filter(
      (raffle) => raffle.creator === creator
    );
    return filteredRaffles;
  };

  const getRaffleById = (raffleId) => {
    return raffles.find((raffle) => raffle.id === raffleId);
  };

  const getEntriesByRaffleId = (raffleId) => {
    return entries.filter((entry) => entry.raffleId === raffleId);
  };

  const getEntriesByEntrant = (entrant) => {
    return entries.filter((entry) => entry.participant === entrant);
  };

  const updateEligibilityStatus = (raffleId, status) => {
    console.log(
      "Updating eligibility status for raffle:",
      raffleId,
      "to",
      status
    );
    setEligibilityStatus((prev) =>
      prev.map((item) =>
        item.raffleId === raffleId ? { ...item, status } : item
      )
    );
  };

  // Clear message from context
  const clearMessage = () => {
    // No-op function since we removed event messages
  };

  // NOTE: Functions like addRaffle, addEntry etc are stable and don't need to be included in the dependency array
  // as they only depend on raffles, entries, eligibilityStatus
  const contextValue = useMemo(
    () => ({
      raffles,
      entries,
      eligibilityStatus,
      getRafflesByPhase,
      addRaffle,
      addEntry,
      updateRaffle,
      updateEntry,
      getRafflesByCreator,
      getRaffleById,
      getEntriesByRaffleId,
      getEntriesByEntrant,
      updateEligibilityStatus,
      clearMessage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [raffles, entries, eligibilityStatus]
  );

  return (
    <RaffleContext.Provider value={contextValue}>
      {children}
    </RaffleContext.Provider>
  );
}

RaffleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { RaffleContext };
