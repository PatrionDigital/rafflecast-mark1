import { createContext, useState } from "react";
import PropTypes from "prop-types";

const RaffleContext = createContext();

export function RaffleProvider({ children }) {
  const [raffles, setRaffles] = useState([]);

  const addRaffle = (raffleData) => {
    setRaffles([...raffles, raffleData]);
  };

  const updateRaffle = (id, updates) => {
    setRaffles((prev) =>
      prev.map((raffle) =>
        raffle.id === id ? { ...raffle, ...updates } : raffle
      )
    );
  };
  const getRaffleById = (id) => raffles.find((raffle) => raffle.id === id);

  return (
    <RaffleContext.Provider
      value={{ raffles, addRaffle, updateRaffle, getRaffleById }}
    >
      {children}
    </RaffleContext.Provider>
  );
}

RaffleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { RaffleContext };
