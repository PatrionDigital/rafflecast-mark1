import { useContext } from "react";
import { RaffleContext } from "./RaffleContext";
export const useRaffle = () => {
  const context = useContext(RaffleContext);

  if (!context) {
    throw new Error("useRaffle must be used within a RaffleProvider");
  }

  return context;
};
