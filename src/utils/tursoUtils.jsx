import { createClient } from "@libsql/client";

const TURSO_URL = import.meta.env.VITE_TURSO_DATABASE_URL;
const TURSO_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN;

const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

export const addRaffleToDB = async (raffle) => {
  const {
    creator,
    id,
    name,
    linkedCast,
    closingDate,
    challengePeriod,
    phase,
    createdAt,
  } = raffle;
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

export const fetchRaffles = async () => {
  try {
    const result = await client.execute("SELECT * FROM raffles;");
    return result.rows;
  } catch (error) {
    console.error("Error fetching raffles:", error);
    return [];
  }
};
