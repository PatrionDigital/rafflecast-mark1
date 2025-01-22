import { updateRafflePhaseInDB } from "../utils/tursoUtils";
import { PHASES } from "./constants";

// Helper: Select winners for a raffle based on criteria
const selectWinners = (entries, numberOfWinners) => {
  if (!entries || entries.length === 0) {
    throw new Error("No entries found for this raffle.");
  }

  // Randomly shuffle entries and select winners
  const shuffledEntries = [...entries].sort(() => Math.random() - 0.5);
  return shuffledEntries.slice(0, numberOfWinners);
};

// Helper: Validate challenges and determine final winners
const validateChallenges = (winners, challenges) => {
  // Placeholder for custom validation logic
  // Example: Filter out winners invalidated by challenges
  const invalidatedParticipants = challenges.map(
    (challenge) => challenge.participant
  );
  return winners.filter(
    (winner) => !invalidatedParticipants.includes(winner.participant)
  );
};

// Settle a raffle: End the entry period and select winners
export const settleRaffle = async (raffle, entries) => {
  if (raffle.phase !== PHASES.ACTIVE) {
    throw new Error(`Cannot settle raffle in phase: ${raffle.phase}`);
  }

  try {
    // Select winners
    const winners = selectWinners(entries, raffle.numberOfWinners);
    console.log(`Winners selected for raffle ${raffle.id}:`, winners);

    // Update raffle phase to Settled
    await updateRafflePhaseInDB(raffle.id, PHASES.SETTLED);
    console.log(`Raffle ${raffle.id} successfully settled.`);

    return { success: true, winners };
  } catch (error) {
    console.error(`Error settling raffle ${raffle.id}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Finalize a raffle: Validate challenges and distribute prizes
export const finalizeRaffle = async (raffle, winners, challenges = []) => {
  if (raffle.phase !== PHASES.SETTLED) {
    throw new Error(`Cannot finalize raffle in phase: ${raffle.phase}`);
  }

  try {
    // Validate challenges
    const validWinners = validateChallenges(winners, challenges);
    console.log(`Final valid winners for raffle ${raffle.id}:`, validWinners);

    // Update raffle phase to Finalized
    await updateRafflePhaseInDB(raffle.id, PHASES.FINALIZED);
    console.log(`Raffle ${raffle.id} successfully finalized.`);

    return { success: true, winners: validWinners };
  } catch (error) {
    console.error(`Error finalizing raffle ${raffle.id}:`, error.message);
    return { success: false, error: error.message };
  }
};
