import { createContext, useEffect, useState } from "react";
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

const RaffleContext = createContext();

export function RaffleProvider({ children }) {
  const [raffles, setRaffles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [eventMessage, setEventMessage] = useState(null);

  // Simulate initial data loading (replace with fetchRaffles/fetchEntries later)
  useEffect(() => {
    const loadData = async () => {
      const fetchedRaffles = await fetchRaffles();
      const fetchedEntries = await fetchEntries();

      setRaffles(fetchedRaffles);
      setEntries(fetchedEntries);
    };
    loadData();
  }, []);

  const clearMessage = () => {
    setEventMessage("");
  };

  useEffect(() => {
    const cleanupListeners = [
      onRaffleCreated((data) => {
        if (data.success) {
          setRaffles((prev) => [...prev, data.newRaffle]);
          setEventMessage("Raffle created successfully!");
        } else {
          setEventMessage(`Error creating raffle: ${data.error}`);
        }
      }),
      onRaffleEntry((data) => {
        if (data.success) {
          setEntries((prevEntries) => [...(prevEntries || []), data.newEntry]);
          setEventMessage("Entry added successfully!");
        } else {
          setEventMessage(`Error adding entry: ${data.error}`);
        }
      }),
      onRafflePhaseUpdated((data) => {
        if (data.success) {
          setRaffles((prev) =>
            prev.map((raffle) =>
              raffle.id === data.raffleId
                ? { ...raffle, phase: data.newPhase }
                : raffle
            )
          );
          setEventMessage(
            `Raffle ${data.raffleId} updated to phase ${data.newPhase}`
          );
        } else {
          setEventMessage(`Error updating raffle phase: ${data.error}`);
        }
      }),
    ];

    return () => {
      cleanupListeners.forEach((unsub) => unsub && unsub());
    };
  }, []);

  const addRaffle = async (raffleData) => {
    // Optimistically Update the state
    setRaffles((prev) => {
      const updatedRaffles = [...(prev || []), raffleData];
      console.log("Updated Raffles State:", updatedRaffles);
      return updatedRaffles;
    });
    try {
      await addRaffleToDB(raffleData);
      setEventMessage("Raffle created successfully!");
    } catch (error) {
      console.error("Error adding raffle:", error.message);
      setEventMessage("An error occurred while creating the raffle.");

      // Revert the state update if the database write fails
      setRaffles((prev) =>
        prev.filter((raffle) => raffle.id !== raffleData.id)
      );
    }
  };

  const addEntry = async (entryData) => {
    const { raffleId, participant } = entryData;

    // Check if the user has already entered the raffle
    const hasEntered = entries.some(
      (entry) =>
        entry?.raffleId === raffleId && entry?.participant === participant
    );

    if (!hasEntered) {
      // Optimistically Update State (only happens if not a duplicate entry)
      setEntries((prev) => {
        const updatedEntries = [...(prev || []), entryData];
        console.log("Optimistic Entries State:", updatedEntries);
        return updatedEntries;
      });

      try {
        // Try adding the entry to the DB
        await addEntryToDB(entryData);

        // On success, show success message
        setEventMessage("Entry added successfully!");
        console.log("Entry added to DB successfully.");
      } catch (error) {
        // In case of error, show failure message
        console.error("Error adding entry:", error.message);
        setEventMessage("An error occurred while joining the raffle.");

        // Revert the state update if the database write fails
        setEntries((prev) => prev.filter((entry) => entry.id !== entryData.id));
      }
    } else {
      // If the user has already entered, show a message
      setEventMessage("You have already joined this raffle!");
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
      console.error("Errof updating raffle:", error.message);
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

  const getRafflesByPhase = async (phase) =>
    raffles.filter((raffle) => raffle.phase === phase);

  const getRafflesByCreator = (creator) =>
    raffles.filter((raffle) => raffle.creator === creator);

  const getRaffleById = (id) => raffles.find((raffle) => raffle.id === id);

  const getEntriesByRaffleId = (raffleId) =>
    entries.filter((entry) => entry.raffleId === raffleId);

  return (
    <RaffleContext.Provider
      value={{
        raffles,
        entries,
        addRaffle,
        addEntry,
        updateRaffle,
        updateEntry,
        getRafflesByPhase,
        getRafflesByCreator,
        getRaffleById,
        getEntriesByRaffleId,
        eventMessage,
        clearMessage,
      }}
    >
      {children}
    </RaffleContext.Provider>
  );
}

RaffleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { RaffleContext };
