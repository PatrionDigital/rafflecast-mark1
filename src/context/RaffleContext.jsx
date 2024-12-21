import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  fetchRaffles,
  fetchEntries,
  addRaffleToDB,
  addEntryToDB,
  updateEntryInDB,
} from "../utils/tursoUtils";

const RaffleContext = createContext();

export function RaffleProvider({ children }) {
  const [raffles, setRaffles] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const loadRaffles = async () => {
      const fetchedRaffles = await fetchRaffles();
      setRaffles(fetchedRaffles);
    };
    loadRaffles();
  }, []);
  useEffect(() => {
    const loadEntries = async () => {
      const fetchedEntries = await fetchEntries();
      setEntries(fetchedEntries);
    };
    loadEntries();
  }, []);

  const addToStateAndDB = async (addFunction, newData, setState) => {
    try {
      const savedData = await addFunction(newData);
      if (savedData) {
        setState((prev) => [...prev, savedData]);
      }
    } catch (error) {
      console.error("Error adding data:", error.message);

    }
  };

  const addRaffle = async (raffleData) => {
    const newRaffle = {
      ...raffleData,
      phase: "Active",
      createdAt: new Date().toISOString(),
    };
    await addToStateAndDB(addRaffleToDB, newRaffle, setRaffles);
  };

  const addEntry = async (entryData) => {
    const { raffleId, participant } = entryData;
    const newEntry = {
      raffleId,
      participant,
      enteredAt: new Date().toISOString(),
    };
    await addToStateAndDB(addEntryToDB, newEntry, setEntries);
  };

  const updateRaffle = (id, updates) => {
    setRaffles((prev) =>
      prev.map((raffle) =>
        raffle.id === id ? { ...raffle, ...updates } : raffle
      )
    );
  };
  const updateEntry = async (entryId, updates) => {
    try {
      // Update database
      await updateEntryInDB(entryId, updates);

      // Update state
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, ...updates } : entry
        )
      );
    } catch (error) {
      console.error("Error updating entry:", error.message);
    }
  };

  // Get raffles by phase
  const getRafflesByPhase = async (phase) => {
    //const fetchedRaffles = await fetchRaffles();
    return raffles.filter((raffle) => raffle.phase === phase);
  };

  // Get a single raffle by id
  const getRaffleById = (id) => raffles.find((raffle) => raffle.id === id);

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
        getRaffleById,
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
