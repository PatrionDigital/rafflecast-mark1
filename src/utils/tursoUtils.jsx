import { createClient } from "@libsql/client";
import mitt from "mitt";

const eventEmitter = mitt();

const TURSO_URL = import.meta.env.VITE_TURSO_DATABASE_URL;
const TURSO_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN;

const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

export const addRaffleToDB = async (raffle) => {
  const {
    creator,
    id,
    title,
    description,
    startDate,
    startTime,
    closingDate,
    closingTime,
    challengePeriod,
    createdAt,
    updatedAt,
    phase,
    criteria,
    distributions,
  } = raffle;

  try {
    console.log("creator:", creator);
    console.log("id:", id);
    console.log("title:", title);
    console.log("description:", description);
    console.log("startDate:", startDate);
    console.log("closingDate:", closingDate);
    console.log("challengePeriod:", challengePeriod);
    console.log("createdAt:", createdAt);
    console.log("updatedAt:", updatedAt);
    console.log("phase:", phase);
    console.log("criteria:", JSON.stringify(criteria));
    await client.execute(
      `INSERT INTO raffles (creator, id, title, description, startDate, startTime, closingDate, closingTime, challengePeriod, createdAt, updatedAt, phase, criteria, distributions) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        creator,
        id,
        title,
        description,
        startDate,
        startTime,
        closingDate,
        closingTime,
        challengePeriod,
        createdAt,
        updatedAt,
        phase,
        criteria,
        distributions,
      ]
    );
    // Emit success event
    eventEmitter.emit("raffleCreated", { success: true, id });
  } catch (error) {
    // Emit error event
    eventEmitter.emit("raffleCreated", {
      success: false,
      error: error.message,
    });
    throw error;
  }
};

export const addEntryToDB = async (entryData) => {
  const { id, raffleId, participant, enteredAt, prizeWallet } = entryData;
  try {
    await client.execute(
      `INSERT INTO entries (id, raffleId, participant, enteredAt, prizeWallet) VALUES (?,?,?,?,?)`,
      [id, raffleId, participant, enteredAt, prizeWallet]
    );
    // Emit success event
    eventEmitter.emit("raffleEntry", { success: true, id });
    return { id: id, ...entryData };
  } catch (error) {
    // Emit error event
    eventEmitter.emit("raffleEntry", { success: false, error: error.message });
    throw error;
  }
};

export const updateRafflePhaseInDB = async (raffleId, newPhase) => {
  try {
    await client.execute("UPDATE raffles SET phase = ? WHERE id = ?", [
      newPhase,
      raffleId,
    ]);
    // Emit success event
    eventEmitter.emit("rafflePhaseUpdated", {
      success: true,
      raffleId,
      newPhase,
    });
    console.log(`Raffle ${raffleId} updated to phase ${newPhase}`);
  } catch (error) {
    // Emit error event
    eventEmitter.emit("rafflePhaseUpdated", {
      success: false,
      error: error.message,
    });
    console.error(`Error updating raffle phase: ${error.message}`);
  }
};

export const updateEntryInDB = async (entryId, updates) => {
  const setClause = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(updates), entryId];
  const query = `UPDATE entries SET ${setClause} WHERE id = ?;`;
  await client.execute(query, values);
};

export const fetchRaffles = async () => {
  try {
    const result = await client.execute("SELECT * FROM raffles;");
    return result.rows;
  } catch (error) {
    console.error("Error fetching raffles:", error);
    return [];
  }
};

export const fetchRaffleById = async (raffleId) => {
  try {
    const result = await client.execute("SELECT * FROM raffles WHERE id = ?;", [
      raffleId,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    const raffle = result.rows[0];

    // Parse criteria if it's a string
    if (raffle && typeof raffle.criteria === "string") {
      try {
        raffle.criteria = JSON.parse(raffle.criteria);
      } catch (error) {
        console.error("Error parsing criteria:", error);
      }
    }

    return raffle;
  } catch (error) {
    console.error("Error fetching raffle:", error);
    return null;
  }
};

export const fetchEntries = async () => {
  try {
    const result = await client.execute("SELECT * FROM entries;");
    return result.rows;
  } catch (error) {
    console.error("Error fetching entries:", error);
    return [];
  }
};

// Event listener functions for other parts of the app to listen to events
export const onRaffleCreated = (listener) => {
  eventEmitter.on("raffleCreated", listener);
};

export const onRaffleEntry = (listener) => {
  eventEmitter.on("raffleEntry", listener);
};

export const onRafflePhaseUpdated = (listener) => {
  eventEmitter.on("rafflePhaseUpdated", listener);
};
