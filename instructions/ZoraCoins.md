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
