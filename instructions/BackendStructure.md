# SecondOrder.fun Backend & Blockchain Migration Plan

## Current Backend Structure

### Overview

The current backend for SecondOrder.fun primarily uses TursoDB for data persistence, with some blockchain functionality already integrated via the Merkle Distributor contract. This document outlines the current structure and the planned migration to a fully blockchain-based system.

### TursoDB Client Implementation

The database client is implemented in `src/utils/tursoUtils.jsx`:

```javascript
import { createClient } from "@libsql/client";
import mitt from "mitt";

const eventEmitter = mitt();

const TURSO_URL = import.meta.env.VITE_TURSO_DATABASE_URL;
const TURSO_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN;

const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

export const addRaffleToDB = async (raffle) => {
  // Implementation for adding raffle to TursoDB
};

export const addEntryToDB = async (entryData) => {
  // Implementation for adding entry to TursoDB
};

// Other database operations...

// Event listeners for real-time updates
export const onRaffleCreated = (listener) => {
  eventEmitter.on("raffleCreated", listener);
};

export const onRaffleEntry = (listener) => {
  eventEmitter.on("raffleEntry", listener);
};

export const onRafflePhaseUpdated = (listener) => {
  eventEmitter.on("rafflePhaseUpdated", listener);
};
```

### Data Context Provider

The `RaffleContext` serves as the primary data access layer, implemented in `src/context/RaffleContext.jsx`:

```javascript
import { createContext, useEffect, useState, useMemo } from "react";
import {
  fetchRaffles,
  fetchEntries,
  addRaffleToDB,
  addEntryToDB,
  // Other imports...
} from "../utils/tursoUtils";

export function RaffleProvider({ children }) {
  const [raffles, setRaffles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [eligibilityStatus, setEligibilityStatus] = useState([]);

  // Data loading and event listeners...

  const addRaffle = async (raffleData) => {
    // Optimistic updates and DB operations
  };

  const addEntry = async (entryData) => {
    // Entry handling logic
  };

  // Other methods...

  const contextValue = useMemo(
    () => ({
      raffles,
      entries,
      eligibilityStatus,
      getRafflesByPhase,
      addRaffle,
      addEntry,
      // Other methods...
    }),
    [raffles, entries, eligibilityStatus]
  );

  return (
    <RaffleContext.Provider value={contextValue}>
      {children}
    </RaffleContext.Provider>
  );
}
```

### Current Web3 Integration

The application already has some blockchain integration, primarily for the Merkle Distributor contract:

```javascript
// src/utils/contractUtils.js
import { Contract } from "ethers";
import MerkleDistributorABI from "../contracts/MerkleDistributor.json";

const MERKLE_DISTRIBUTOR_ADDRESS = "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4";

const getMerkleDistributorContract = (signer) => {
  // Implementation...
};

export const createDistribution = async (signer, distributionData) => {
  // Implementation...
};
```

### Current Data Schema

#### Raffles Table Schema

| Field Name      | Type              | Description                                              |
| --------------- | ----------------- | -------------------------------------------------------- |
| id              | String (UUID)     | Unique identifier for the raffle                         |
| creator         | Number            | Farcaster ID (FID) of the raffle creator                 |
| title           | String            | Title of the raffle                                      |
| description     | String            | Description of the raffle                                |
| startDate       | String (ISO Date) | Start date for the raffle                                |
| startTime       | String            | Start time for the raffle                                |
| closingDate     | String (ISO Date) | Closing date for the raffle                              |
| closingTime     | String            | Closing time for the raffle                              |
| challengePeriod | String (ISO Date) | Date when challenge period ends                          |
| createdAt       | String (ISO Date) | Timestamp when the raffle was created                    |
| updatedAt       | String (ISO Date) | Timestamp when the raffle was last updated               |
| phase           | String (Enum)     | Current phase of the raffle (Active, Settled, Finalized) |
| criteria        | String (JSON)     | JSON string containing entry criteria                    |
| distributions   | String (JSON)     | JSON string containing distribution details              |

**Sample raffle data:**

```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  creator: 12345,  // Farcaster FID
  title: "Win 100 USDC",
  description: "Like my cast to enter this raffle and win 100 USDC!",
  startDate: "2025-01-01",
  startTime: "12:00",
  closingDate: "2025-01-07",
  closingTime: "12:00",
  challengePeriod: "2025-01-14",
  createdAt: "2024-12-25T12:00:00Z",
  updatedAt: "2024-12-25T12:00:00Z",
  phase: "Active",
  criteria: JSON.stringify({
    type: "like",
    linkedCast
```
