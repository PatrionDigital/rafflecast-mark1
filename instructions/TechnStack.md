# RaffleCast Tech Stack Documentation

## Overview

RaffleCast is a web application for creating, managing, and participating in raffles with Farcaster integration. The application allows users to authenticate with Farcaster credentials, create raffles, set eligibility criteria, and distribute rewards to winners. It features a responsive UI with support for mobile, tablet, and desktop views, and includes Farcaster Frame support for improved sharing on the Farcaster platform.

## Core Technologies

### Dev Environment

- I use MacOS
- IDE is VS Code with the following plugins:
  - Git Source Control
  - Git Pull Requests (also used for Issues)
  - ESLint, Prettier
  - IntelliCode and TabOut
- I use `zsh` for my shell environment

### Frontend Framework

- **React**: The application is built using React 18.3.1 for creating a component-based user interface
- **Vite**: Modern build tool used for fast development and optimized production builds
- **React Router DOM (v7)**: For client-side routing and navigation

### Authentication & Web3 Integration

- **Farcaster Auth Kit**: Used for authentication with Farcaster profiles
- **Farcaster Frame SDK**: Implementation for Farcaster Frames
- **Wagmi**: React hooks for Ethereum/Web3 functionality
- **Viem**: Low-level Ethereum interface library
- **ConnectKit**: UI components for connecting to wallets
- **ethers.js**: Ethereum utility library

### Data Management

- **@libsql/client**: Client for Turso database connections
- **TanStack React Query**: For fetching, caching, and updating data

### Blockchain & Smart Contracts

- **MerkleDistributor Contract**: Smart contract used for distributing prizes
- **merkletreejs**: For creating Merkle proofs for whitelist verification
- **Pinata Web3**: IPFS integration for storing prize distribution address whitelist

### Styling & UI

- **CSS Modules**: Custom CSS files for component styling
- **Custom Component Library**: Hand-crafted UI components including:
  - Cards
  - Modals
  - Forms
  - Navigation components
  - Pagination

### Additional Libraries

- **mitt**: Event emitter for internal communication
- **uuid**: For generating unique identifiers
- **axios**: HTTP client for API requests
- **dayjs**: Date manipulation library
- **prop-types**: Runtime type checking for React props

## Project Structure

### Directory Organization

```dir
src/
├── assets/            # Static assets like images
├── components/        # Reusable UI components
│   ├── EntriesManagement/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── MessageDisplay.jsx
│   ├── RaffleCard.jsx
│   ├── RaffleDetailsPanel.jsx
│   └── ...
├── context/           # React context providers
│   ├── MessageContext.jsx
│   └── RaffleContext.jsx
├── frames/            # Farcaster Frames integration
│   ├── api/
│   ├── components/
│   └── utils/
├── hooks/             # Custom React hooks
│   ├── useMessageContext.js
│   └── useRaffle.js
├── pages/             # Page components
│   ├── layouts/       # Layout components
│   ├── BrowseRafflesPage.jsx
│   ├── CreateRafflePage.jsx
│   └── ...
├── services/          # Service modules for external APIs
│   └── merkleDistributorServices.js
├── styles/            # Global and shared styles
│   ├── pages.css
│   ├── messages.css
│   └── ...
├── utils/             # Utility functions
│   ├── contractUtils.js
│   ├── merkleUtils.js
│   ├── tursoUtils.jsx
│   └── ...
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── router.jsx         # Router configuration
```

### Key Components

#### Core Application Components

- **App.jsx**: The root component that sets up providers and global state
- **router.jsx**: Defines the routing structure of the application
- **ParentLayout.jsx**: Main layout wrapper that includes Header, content area, and Footer

#### Context Providers

- **RaffleContext**: Manages raffle state, entries, and interactions with the backend
- **MessageContext**: Handles application-wide notifications and messages

#### Feature Components

- **RaffleCard.jsx**: Card component displaying raffle summary information
- **RaffleDetailsPanel.jsx**: Modal showing detailed raffle information
- **CreateRafflePage.jsx**: Multi-step form for creating new raffles
- **ManageRafflesPage.jsx**: Interface for managing created raffles

#### Farcaster Integration

- **frames/**: Contains components and utilities for Farcaster Frames integration
- **FrameRafflePage.jsx**: Specialized page for displaying raffles in Farcaster Frames
- **FrameDebugPage.jsx**: Tool for testing Farcaster Frame integration

## Data Flow

### State Management

- **Context API**: Used for global state management
  - **RaffleContext**: Manages raffle data, entries, and user eligibility
  - **MessageContext**: Handles application-wide notifications

### API Integration

- **tursoUtils.jsx**: Functions for interacting with the Turso database
- **contractUtils.js**: Utilities for interacting with smart contracts
- **farcasterUtils.js**: Functions for Farcaster API interactions

### Authentication Flow

1. User authenticates via Farcaster Auth Kit
2. Authentication state is stored in the Farcaster `profile` object
3. Profile information is used for authorization checks and user-specific views

## Web3 Integration

### Wallet Connection

- **ConnectKitButton**: Component for connecting to Ethereum wallets
- **Web3Provider.jsx**: Provides wallet context to the application

### Smart Contract Interaction

- **createDistribution.js**: Functions for creating reward distributions
- **MerkleDistributor.json**: ABI for the Merkle distributor contract

### IPFS Integration

- **PinataSDK**: Used for uploading raffle data to IPFS

## Responsive Design

The application is designed to be responsive across multiple screen sizes:

- **Mobile**: Single-column layouts
- **Tablet**: Two-column layouts
- **Desktop**: Three or four-column layouts

Components automatically adjust their layout based on screen size using media queries and responsive CSS.

## Frame Integration

Farcaster Frames integration enables rich sharing experiences:

- **FrameMeta.jsx**: Adds required meta tags for Frame integration
- **FrameProvider.jsx**: Initializes the Frame SDK
- **generateBase64FrameImage.js**: Creates dynamic SVG images for Frames

## Development and Build Tools

- **Vite**: For fast development and optimized builds
- **ESLint**: For code linting and formatting
- **Vercel**: Deployment platform with automatic builds
- **dotenv**: Environment variable management

## Extensions and Enhancements

The application is designed to be extended with the following features:

1. Additional eligibility criteria types
2. Enhanced reward distribution mechanisms
3. Expanded Frame integration capabilities
4. Analytics and tracking for raffle performance

## Database Structure

### Tables

#### raffles

- id (string): Unique raffle identifier
- creator (number): Farcaster ID of the creator
- title (string): Raffle title
- description (string): Raffle description
- startDate (string): Start date in ISO format
- startTime (string): Start time
- closingDate (string): Closing date in ISO format
- closingTime (string): Closing time
- challengePeriod (string): Date when challenges period ends
- createdAt (string): Creation timestamp
- updatedAt (string): Last update timestamp
- phase (string): Current phase of the raffle (Active, Settled, Finalized)
- criteria (string): JSON string of raffle entry criteria
- distributions (string): JSON string of reward distribution information

#### entries

- id (string): Unique entry identifier
- raffleId (string): Reference to the raffle
- participant (number): Farcaster ID of the participant
- enteredAt (string): Entry timestamp
- prizeWallet (string): Ethereum address for prize delivery

## Smart Contracts

### MerkleDistributor Contract

- Address: `0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4`
- Network: Base
- Functions:
  - `createDistribution`: Create a new token distribution
  - `claim`: Claim tokens from a distribution
  - `refund`: Refund unclaimed tokens to the distribution creator

## Security Considerations

- **Authentication**: Uses Farcaster's authentication system
- **Eligibility Verification**: Verifies raffle criteria via Farcaster API
- **Merkle Tree Verification**: Uses cryptographic proofs for winner verification
- **Wallet Connection**: Secure wallet connection via ConnectKit

## Performance Optimizations

- **Code Splitting**: Lazy loading for routes
- **Optimized Rendering**: Component memoization where appropriate
- **Pagination**: Limits the number of displayed items to improve performance
- **Frame Optimization**: Efficient SVG generation for Frames

## Future Enhancements

1. **Analytics Dashboard**: Track raffle metrics and user engagement
2. **Enhanced Eligibility Options**: More sophisticated entry criteria
3. **Multi-chain Support**: Expand beyond Base to other EVM chains
4. **Integration with Frame v2**: Support for enhanced Frame features
5. **Advanced Winner Selection**: More sophisticated algorithms for selecting winners

## Installation and Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

```env
VITE_TURSO_DATABASE_URL=https://yourdb.turso.io
VITE_TURSO_AUTH_TOKEN=your_turso_token
VITE_PINATA_JWT=your_pinata_jwt
```
