import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
// import {
//   fetchRaffles,
//   fetchEntries,
//   addRaffleToDB,
//   addEntryToDB,
//   updateEntryInDB,
//   onRaffleCreated,
//   onRaffleEntry,
//   onRafflePhaseUpdated,
// } from "../utils/tursoUtils";

const RaffleContext = createContext();

export function RaffleProvider({ children }) {
  const [raffles, setRaffles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [eventMessage, setEventMessage] = useState(null);

  // Simulate initial data loading (replace with fetchRaffles/fetchEntries later)
  useEffect(() => {
    const loadData = async () => {
      const fetchedRaffles = []; // Mock initial data
      const fetchedEntries = []; // Mock initial data
      setRaffles(fetchedRaffles);
      setEntries(fetchedEntries);
    };
    loadData();
  }, []);

  const clearMessage = () => {
    setEventMessage("");
  };

  /*
  // Uncomment to enable real-time event listeners
  useEffect(() => {
    onRaffleCreated((data) => {
      if (data.success) {
        setEventMessage("Raffle created successfully!");
      } else {
        setEventMessage(`Error creating raffle: ${data.error}`);
      }
    });

    onRaffleEntry((data) => {
      if (data.success) {
        setEntries((prevEntries) => [...(prevEntries || []), data.newEntry]);
        setEventMessage("Entry added successfully!");
      } else {
        setEventMessage(`Error adding entry: ${data.error}`);
      }
    });

    onRafflePhaseUpdated((data) => {
      if (data.success) {
        setEventMessage(
          `Raffle ${data.raffleId} updated to phase ${data.newPhase}`
        );
      } else {
        setEventMessage(`Error updating raffle phase: ${data.error}`);
      }
    });
  }, []);
  */

  const addRaffle = async (raffleData) => {
    const newRaffle = {
      ...raffleData,
      id: `raffle-${Date.now()}`, // Temporary ID generation
      phase: "Active",
      createdAt: new Date().toISOString(),
    };

    try {
      // Simulate database save
      // const savedRaffle = await addRaffleToDB(newRaffle);
      const savedRaffle = newRaffle; // Mock response

      // Update state
      setRaffles((prev) => {
        const updatedRaffles = [...(prev || []), savedRaffle];
        console.log("Updated Raffles State:", updatedRaffles);
        return updatedRaffles;
      });

      setEventMessage("Raffle created successfully!");
    } catch (error) {
      console.error("Error adding raffle:", error.message);
      setEventMessage("An error occurred while creating the raffle.");
    }
  };

  const addEntry = async (entryData) => {
    const { raffleId, participant } = entryData;

    const alreadyJoined = entries.some(
      (entry) =>
        entry?.raffleId === raffleId && entry?.participant === participant
    );

    if (alreadyJoined) {
      setEventMessage("You have already joined this raffle!");
      return;
    }

    const newEntry = {
      ...entryData,
      id: `entry-${Date.now()}`, // Temporary ID generation
      enteredAt: new Date().toISOString(),
    };

    try {
      // Simulate database save
      // const savedEntry = await addEntryToDB(newEntry);
      const savedEntry = newEntry; // Mock response

      // Update State
      setEntries((prev) => {
        const updatedEntries = [...(prev || []), savedEntry];
        console.log("Updated Entries State:", updatedEntries);
        return updatedEntries;
      });

      setEventMessage("Entry added successfully!");
    } catch (error) {
      console.error("Error adding entry:", error.message);
      setEventMessage("An error occurred while joining the raffle.");
    }
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
      // Simulate database update
      // await updateEntryInDB(entryId, updates);

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

  const getRafflesByPhase = async (phase) => {
    return new Promise((resolve, reject) => {
      try {
        const filteredRaffles = raffles.filter(
          (raffle) => raffle.phase === phase
        );
        resolve(filteredRaffles);
      } catch (error) {
        reject(error);
      }
    });
  };

  const getRafflesByCreator = (creator) => {
    return new Promise((resolve, reject) => {
      try {
        const filteredRaffles = raffles.filter(
          (raffle) => raffle.creator === creator
        );
        resolve(filteredRaffles);
      } catch (error) {
        reject(error);
      }
    });
  };

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
