# Getting started

The Coins SDK is a library that allows you to create, manage, and query data for Zora coins.

Most features available on the Zora product on web and native mobile apps are available in the SDK and API.

## Installation

This SDK is designed to work with both client and server environments running both js and typescript.

The SDK can be installed from NPM by running:

:::code-group

```bash [npm]
npm install @zoralabs/coins-sdk
```

```bash [pnpm]
pnpm install @zoralabs/coins-sdk
```

```bash [yarn]
yarn install @zoralabs/coins-sdk
```

```bash [bun]
bun install @zoralabs/coins-sdk
```

:::

Additionally, the SDK requires `viem` to be installed as a peer dependency:

:::code-group

```bash [npm]
npm install viem
```

```bash [pnpm]
pnpm install viem
```

```bash [yarn]
yarn install viem
```

```bash [bun]
bun install viem
```

:::

On-chain write operations will not work without `viem` installed.

## Usage

The SDK integrates with `fetch` and `viem` for on-chain interactions and writes.

It can be used on both client and server environments.

## Non-javascript environments

If your product does not support or use a javascript environment, you can use the API endpoints and ABIs directly to interact with the protocol.

The [Coins SDK API](/coins/sdk/queries#non-javascript-usage) can be used in any language that supports HTTP requests.

# Creating Coins

The Coins SDK provides a set of functions to create new coins on the Zora protocol. This page details the process of creating a new coin, the parameters involved, and code examples to help you get started.

## Overview

Creating a coin involves deploying a new ERC20 contract with the necessary Zora protocol integrations. The `createCoin` function handles this process and provides access to the deployed contract.

## Parameters

To create a new coin, you'll need to provide the following parameters:

```ts twoslash
import { Address } from "viem";

type CreateCoinArgs = {
  name: string; // The name of the coin (e.g., "My Awesome Coin")
  symbol: string; // The trading symbol for the coin (e.g., "MAC")
  uri: string; // Metadata URI (an IPFS URI is recommended)
  owners?: Address[]; // Optional array of owner addresses, defaults to [payoutRecipient]
  tickLower?: number; // Optional tick lower for Uniswap V3 pool, defaults to -199200
  payoutRecipient: Address; // Address that receives creator earnings
  platformReferrer?: Address; // Optional platform referrer address, earns referral fees
  initialPurchaseWei?: bigint; // Optional initial purchase amount in wei
};
```

### Metadata

The `uri` parameter structure is described in the [Metadata](/coins/sdk/metadata) section.

### Currency

The `currency` parameter is the address of the currency that will be used to trade the coin.

For now, only WETH/ETH pairs are supported by our user interface and indexer.

### Tick Lower

The `tickLower` parameter is the lower tick for the Uniswap V3 pool. It is not required when using the SDK for WETH pairs.

### Initial Purchase

The `initialPurchaseWei` parameter is the amount of currency to purchase for the initial liquidity.

It should match the `msg.value` of the create call. It is fine to set to `0` to not process an additional purchase at time of creation.

### More Information

Further contract details can be found in the [Factory Contract](/coins/contracts/factory) section and the [Coin Contract](/coins/contracts/coin) section.

## Usage

### Basic Creation

```ts twoslash
import { createCoin } from "@zoralabs/coins-sdk";
import {
  Hex,
  createWalletClient,
  createPublicClient,
  http,
  Address,
} from "viem";
import { base } from "viem/chains";

// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

const walletClient = createWalletClient({
  account: "0x<YOUR_ACCOUNT>" as Hex,
  chain: base,
  transport: http("<RPC_URL>"),
});

// Define coin parameters
const coinParams = {
  name: "My Awesome Coin",
  symbol: "MAC",
  uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
  payoutRecipient: "0xYourAddress" as Address,
  platformReferrer: "0xOptionalPlatformReferrerAddress" as Address, // Optional
  initialPurchaseWei: 0n, // Optional: Initial amount to purchase in Wei
};

// Create the coin
async function createMyCoin() {
  try {
    const result = await createCoin(coinParams, walletClient, publicClient);

    console.log("Transaction hash:", result.hash);
    console.log("Coin address:", result.address);
    console.log("Deployment details:", result.deployment);

    return result;
  } catch (error) {
    console.error("Error creating coin:", error);
    throw error;
  }
}
```

### Using with WAGMI

If you're using WAGMI in your frontend application, you can use the lower-level `createCoinCall` function:

```typescript
import * as React from "react";
import { createCoinCall } from "@zoralabs/coins-sdk";
import { Address } from "viem";
import { useWriteContract, useSimulateContract } from "wagmi";

// Define coin parameters
const coinParams = {
  name: "My Awesome Coin",
  symbol: "MAC",
  uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
  payoutRecipient: "0xYourAddress" as Address,
  platformReferrer: "0xOptionalPlatformReferrerAddress" as Address,
};

// Create configuration for wagmi
const contractCallParams = createCoinCall(coinParams);

// In your component
function CreateCoinComponent() {
  const { data: writeConfig } = useSimulateContract({
    ...contractCallParams,
  });

  const { writeContract, status } = useWriteContract(writeConfig);

  return (
    <button
      disabled={!writeContract || status !== "pending"}
      onClick={() => writeContract?.()}
    >
      {status === "pending" ? "Creating..." : "Create Coin"}
    </button>
  );
}
```

## Getting Coin Address from Transaction Receipt

Once the transaction is complete, you can extract the deployed coin address from the transaction receipt logs using the `getCoinCreateFromLogs` function:

```typescript
import { getCoinCreateFromLogs } from "@zoralabs/coins-sdk";

// Assuming you have a transaction receipt
const coinDeployment = getCoinCreateFromLogs(receipt);
console.log("Deployed coin address:", coinDeployment?.coin);
```

# Trading Coins

The Coins SDK provides functionality to buy and sell coins on the Zora protocol. This page details the trading functions, their parameters, and includes code examples to help you integrate trading into your application.

## Overview

Trading coins involves either buying or selling an existing coin through the Zora protocol. The SDK provides two main approaches:

1. **High-level functions**: Complete solutions that handle the entire trading process.
2. **Low-level functions**: Building blocks for more customized implementations.

## Trading Parameters

When trading coins, you'll work with the following parameter structure:

```ts twoslash
import { Address } from "viem";

type TradeParams = {
  direction: "sell" | "buy"; // The trade direction
  target: Address; // The target coin contract address
  args: {
    recipient: Address; // The recipient of the trade output
    orderSize: bigint; // The size of the order
    minAmountOut?: bigint; // Optional minimum amount to receive
    sqrtPriceLimitX96?: bigint; // Optional price limit for the trade
    tradeReferrer?: Address; // Optional referrer address for the trade
  };
};
```

## Buying Coins

### Basic Buy

```ts twoslash
import { tradeCoin } from "@zoralabs/coins-sdk";
import {
  Address,
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  Hex,
} from "viem";
import { base } from "viem/chains";

// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

const walletClient = createWalletClient({
  account: "0x<YOUR_ACCOUNT>" as Hex,
  chain: base,
  transport: http("<RPC_URL>"),
});

// Define buy parameters
const buyParams = {
  direction: "buy" as const,
  target: "0xCoinContractAddress" as Address,
  args: {
    recipient: "0xYourAddress" as Address, // Where to receive the purchased coins
    orderSize: parseEther("0.1"), // Amount of ETH to spend
    minAmountOut: 0n, // Minimum amount of coins to receive (0 = no minimum)
    tradeReferrer: "0xOptionalReferrerAddress" as Address, // Optional
  },
};

// Execute the buy
async function buyCoin() {
  const result = await tradeCoin(buyParams, walletClient, publicClient);

  console.log("Transaction hash:", result.hash);
  console.log("Trade details:", result.trade);

  return result;
}
```

### Simulating a Buy

Before executing a buy, you can simulate it to check the expected output:

```ts twoslash
import { simulateBuy } from "@zoralabs/coins-sdk";
import { Address, parseEther, createPublicClient, http } from "viem";
import { base } from "viem/chains";

// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

async function simulateCoinBuy() {
  const simulation = await simulateBuy({
    target: "0xCoinContractAddress" as Address,
    requestedOrderSize: parseEther("0.1"),
    publicClient,
  });

  console.log("Order size", simulation.orderSize);
  console.log("Amount out", simulation.amountOut);

  return simulation;
}
```

## Selling Coins

```ts twoslash
import { tradeCoin } from "@zoralabs/coins-sdk";
import {
  Address,
  parseEther,
  Hex,
  createWalletClient,
  createPublicClient,
  http,
} from "viem";
import { base } from "viem/chains";

// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

const walletClient = createWalletClient({
  account: "0x<YOUR_ACCOUNT>" as Hex,
  chain: base,
  transport: http("<RPC_URL>"),
});

// Define sell parameters
const sellParams = {
  direction: "sell" as const,
  target: "0xCoinContractAddress" as Address,
  args: {
    recipient: "0xYourAddress" as Address, // Where to receive the ETH
    orderSize: parseEther("100"), // Amount of coins to sell
    minAmountOut: parseEther("0.05"), // Minimum ETH to receive
    tradeReferrer: "0xOptionalReferrerAddress" as Address, // Optional
  },
};

// Execute the sell
async function sellCoin() {
  const result = await tradeCoin(sellParams, walletClient, publicClient);

  console.log("Transaction hash:", result.hash);
  console.log("Trade details:", result.trade);

  return result;
}
```

## Using with WAGMI

If you're using WAGMI in your frontend application, you can use the lower-level `tradeCoinCall` function:

```typescript
import { tradeCoinCall } from "@zoralabs/coins-sdk";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { Address, parseEther } from "viem";

// Define trade parameters
const tradeParams = {
  direction: "buy" as const,
  target: "0xCoinContractAddress" as Address,
  args: {
    recipient: "0xYourAddress" as Address,
    orderSize: parseEther("0.1"),
    minAmountOut: 0n,
    tradeReferrer: "0x0000000000000000000000000000000000000000" as Address,
  },
};

// Create configuration for wagmi
const contractCallParams = tradeCoinCall(tradeParams);

// In your component
function BuyCoinComponent() {
  const { config } = usePrepareContractWrite({
    ...contractCallParams,
    value: tradeParams.args.orderSize,
  });

  const { writeContract, status, write } = useContractWrite(config);

  return (
    <button
      disabled={!writeContract || status === "pending"}
      onClick={() => writeContract?.()}
    >
      {status === "pending" ? "Buying..." : "Buy Coin"}
    </button>
  );
}
```

## Reading Trade Events from Transaction Logs

After a trade is completed, you can extract the trade event details from the transaction receipt:

```ts twoslash
const receipt: any = null;

// ---- cut -----
import { getTradeFromLogs } from "@zoralabs/coins-sdk";

// Assuming you have a transaction receipt and know the direction
const tradeEvent = getTradeFromLogs(receipt, "buy"); // or "sell"

if (tradeEvent) {
  console.log(tradeEvent);
  ///         ^?
}
```

## Best Practices

1. **Referrers**: Creating platforms on top of coins allows you to earn from both platform creation and trading fees on both the create and trade side. Make sure to include your addresses in these fields.

2. **Consider Slippage**: Always set a reasonable `minAmountOut` to protect against slippage in volatile markets.

3. **Simulation First**: If not using the high level API, make sure to simulate and return reasonable errors to the user. This is done for you if using the higher-level `trade` function.

4. **Error Handling**: Implement robust error handling for failed trades.

5. **Gas Estimation**: Be aware that gas costs can vary, especially during network congestion.

6. **Price Limits**: For advanced trading, consider setting `sqrtPriceLimitX96` to control the maximum price impact of your trade.
