import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid"; // For unique raffle IDs
import { fetchRaffles, addRaffleToDB } from "../utils/tursoUtils";

const RaffleContext = createContext();

export function RaffleProvider({ children }) {
  const [raffles, setRaffles] = useState([]);

  useEffect(() => {
    const loadRaffles = async () => {
      const fetchedRaffles = await fetchRaffles();
      setRaffles(fetchedRaffles);
    };
    loadRaffles();
  }, []);

  const addRaffle = async (raffleData) => {
    const newRaffle = {
      id: uuidv4(),
      ...raffleData,
      phase: "Active",
      createdAt: new Date().toISOString(),
    };
    setRaffles((prev) => [...prev, newRaffle]);
    await addRaffleToDB(newRaffle);
  };

  const updateRaffle = (id, updates) => {
    setRaffles((prev) =>
      prev.map((raffle) =>
        raffle.id === id ? { ...raffle, ...updates } : raffle
      )
    );
  };

  // Get raffles by phase
  const getRafflesByPhase = async (phase) => {
    const fetchedRaffles = await fetchRaffles();
    return fetchedRaffles.filter((raffle) => raffle.phase === phase);
  };

  // Get a single raffle by id
  const getRaffleById = (id) => raffles.find((raffle) => raffle.id === id);

  return (
    <RaffleContext.Provider
      value={{
        raffles,
        addRaffle,
        updateRaffle,
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
