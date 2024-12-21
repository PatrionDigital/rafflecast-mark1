import { createClient } from "@libsql/client";
import { v4 as uuidv4 } from "uuid";

const TURSO_URL = import.meta.env.VITE_TURSO_DATABASE_URL;
const TURSO_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN;

const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

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
};

export const addEntryToDB = async (entryData) => {
  const { raffleId, participant, enteredAt } = entryData;
  const id = uuidv4();
  try {
    await client.execute(
      `INSERT INTO entries (id, raffleId, participant, enteredAt) VALUES (?,?,?,?)`,
      [id, raffleId, participant, enteredAt]
    );

    return { id: id, ...entryData };
  } catch (error) {
    console.error("Unable to submit entry to raffle", error);
    throw error;
  }
};

export const updateRafflePhaseInDB = async (raffleId, newPhase) => {
  try {
    await client.execute("UPDATE raffles SET phase = ? WHERE id = ?", [
      newPhase,
      raffleId,
    ]);
    console.log(`Raffle ${raffleId} updated to phase ${newPhase}`);
  } catch (error) {
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

export const fetchEntries = async () => {
  try {
    const result = await client.execute("SELECT * FROM entries;");
    return result.rows;
  } catch (error) {
    console.error("Error fetching entries:", error);
    return [];
  }
};
