import { useContext } from "react";
import { RaffleContext } from "./RaffleContext";
export const useRaffle = () => useContext(RaffleContext);
