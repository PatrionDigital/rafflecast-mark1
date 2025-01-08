import { createClient } from "@libsql/client";
import mitt from "mitt";
import { v4 as uuidv4 } from "uuid";

const eventEmitter = mitt();

const TURSO_URL = import.meta.env.VITE_TURSO_DATABASE_URL;
const TURSO_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN;

const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

const normalizeKeys = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => normalizeKeys(item));
  } else if (typeof data === "object" && data !== null) {
    return Object.keys(data).reduce((acc, key) => {
      if (!isNaN(Number(key))) return acc;
      acc[key.toLowerCase()] = data[key];
      return acc;
    }, {});
  }
  return data;
};

const normalizeRows = (rows) => rows.map(normalizeKeys);

export const addRaffleToDB = async (raffle) => {
  const {
    creator,
    name,
    linkedCast,
    closingDate,
    challengePeriod,
    phase,
    createdAt,
  } = raffle;
  const id = uuidv4();

  try {
    await client.execute(
      `INSERT INTO raffles (creator, id, name, linkedCast, closingDate, challengePeriod, phase, createdAt) VALUES (?,?,?,?,?,?,?,?)`,
      [
        creator,
        id,
        name,
        linkedCast,
        closingDate,
        challengePeriod,
        phase,
        createdAt,
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
  const { raffleId, participant, enteredAt } = entryData;
  const id = uuidv4();
  try {
    await client.execute(
      `INSERT INTO entries (id, raffleId, participant, enteredAt) VALUES (?,?,?,?)`,
      [id, raffleId, participant, enteredAt]
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
    const normalizedRows = normalizeRows(result.rows);
    return normalizedRows;
  } catch (error) {
    console.error("Error fetching raffles:", error);
    return [];
  }
};

export const fetchEntries = async () => {
  try {
    const result = await client.execute("SELECT * FROM entries;");
    return normalizeRows(result.rows);
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
