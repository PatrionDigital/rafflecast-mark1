# Rafflecast Application Flow Document

## Overview

Rafflecast is a decentralized application that enables Farcaster users to create, manage, and participate in raffles. The platform leverages blockchain technology to ensure transparency and fairness in raffle execution, while integrating deeply with the Farcaster social network for user authentication and participation requirements.

## Application Architecture

### Technology Stack

- **Frontend**: React with Vite
- **Authentication**: Farcaster Auth Kit
- **Database**: Turso (LibSQL)
- **Smart Contracts**: Ethereum (Base network)
- **Frame Integration**: Farcaster Frame SDK

### Key Components

1. **Authentication System**: Integration with Farcaster for user identity verification
2. **Raffle Management**: Creation, management, and settlement of raffles
3. **Eligibility Verification**: Checking user compliance with raffle criteria
4. **Prize Distribution**: On-chain distribution of rewards using MerkleDistributor
5. **Frame Integration**: Interactive Farcaster Frames for social sharing and participation

### File Structure

The application is organized into the following structure:

- `/src/components`: Reusable UI components
- `/src/pages`: Main page components for different routes
- `/src/context`: React context providers for state management
- `/src/utils`: Utility functions and helpers
- `/src/hooks`: Custom React hooks
- `/src/styles`: CSS stylesheets
- `/src/contracts`: Smart contract ABIs
- `/src/frames`: Farcaster Frame integration components and utilities

## Core User Workflows

### 1. Creator's Workflow

#### 1.1 Raffle Creation

Creators access Rafflecast to set up new raffles with specific criteria and rewards.

**Implementation Status**: ✅ Implemented

- **Path**: `/creator/raffles/new`
- **Component**: `CreateRafflePage`
- **Key Functions**:
  - Form validation with multi-step process
  - Integration with Farcaster profile for creator verification
  - Storage of raffle data in Turso database

**Creation Process**:

1. **Authentication**: Users authenticate with their Farcaster account using `@farcaster/auth-kit`.
2. **Basic Information**: Creators provide title, description, and entry criteria (currently supporting "Like a Cast" with plans to expand to other criteria).
3. **Cast Lookup**: Creators can look up and validate a Cast hash to ensure it exists before setting it as criteria.
4. **Time Settings**: Setting start date, closing date, and challenge period for verification.
5. **Review and Confirm**: Final validation before creating the raffle.

#### 1.2 Publish and Share

Once created, raffles can be shared across different platforms.

**Implementation Status**: ✅ Implemented

- **Components**: `ShareModal`, `FrameMeta`
- **Key Features**:
  - Direct link sharing
  - Farcaster Frame link generation
  - Warpcast integration for direct sharing

**Sharing Options**:

1. **Direct Link**: Standard URL to the raffle that can be shared anywhere.
2. **Farcaster Frame**: Interactive Farcaster Frame that allows users to join directly from their feed.
3. **Warpcast Share**: Direct integration with Warpcast's compose feature.

#### 1.3 Managing Raffles

Creators can view and manage all their created raffles.

**Implementation Status**: ✅ Implemented

- **Path**: `/profile/raffles` or `/creator/raffles/manage`
- **Component**: `ManageRafflesPage`
- **Key Features**:
  - List view of all creator's raffles
  - Status indicators
  - Entry management
  - Pagination for large numbers of raffles

**Management Features**:

1. **Raffle Listing**: Grid display of raffles with status indicators.
2. **Entry Viewing**: Modal to view all participants in a specific raffle.
3. **Raffle Settlement**: Button to settle raffles once they've reached their closing date.

#### 1.4 Raffle Settlement

After the closing date, creators can settle raffles to select winners.

**Implementation Status**: ✅ Implemented

- **Utilities**: `settleRaffle()` in `raffleUtils.js`
- **Process Flow**:
  1. System checks if raffle is ready for settlement (past closing date and in Active phase)
  2. Random winner selection occurs
  3. Raffle phase is updated to "Settled"
  4. Creator is redirected to distribute rewards

#### 1.5 Rewards Distribution

For onchain rewards, creators can distribute tokens to winners.

**Implementation Status**: ✅ Implemented

- **Path**: `/creator/distribute-rewards/:raffleId`
- **Component**: `CreateDistributionPage`
- **Key Features**:
  - Integration with MerkleDistributor contract
  - Token address and amount selection
  - Merkle tree generation for secure distribution

**Distribution Process**:

1. **Contract Interaction**: Uses the MerkleDistributor contract for token distribution.
2. **Winner Verification**: Uses Merkle proofs to verify legitimate winners.
3. **Token Transfer**: Transfers specified tokens to winner wallets.

### 2. Participant's Workflow

#### 2.1 Discovering Raffles

Users can browse available raffles.

**Implementation Status**: ✅ Implemented

- **Path**: `/entrant/raffles/browse`
- **Component**: `BrowseRafflesPage`
- **Key Features**:
  - Responsive grid layout
  - Filtering by active status

**Discovery Features**:

1. **Browse Interface**: Grid of raffle cards with key information.
2. **Raffle Card**: Displays title, creator, and closing date.

#### 2.2 Viewing Raffle Details

Users can view detailed information about a raffle.

**Implementation Status**: ✅ Implemented

- **Component**: `RaffleDetailsPanel`
- **Key Features**:
  - Detailed raffle information
  - Eligibility checking
  - Entry submission

**Detail Features**:

1. **Raffle Information**: Title, description, dates, creator info.
2. **Criteria Link**: Link to the required Cast for participation.
3. **Eligibility Status**: Visual indicator of user's eligibility.

#### 2.3 Entering Raffles

Eligible users can enter raffles.

**Implementation Status**: ✅ Implemented

- **Key Functions**: `handleJoinRaffle()`, `checkEligibility()`
- **Process Flow**:
  1. User checks eligibility by verifying they've met criteria (e.g., liked a specific Cast)
  2. User selects a wallet address for potential prize delivery
  3. User submits entry

**Entry Features**:

1. **Eligibility Check**: Verification against Farcaster API to confirm criteria completion.
2. **Wallet Selection**: Drop-down of verified wallet addresses for prize delivery.
3. **Entry Confirmation**: Success/error messages after entry attempt.

#### 2.4 Managing Entries

Users can view all raffles they've entered.

**Implementation Status**: ✅ Implemented

- **Path**: `/profile/entries`
- **Component**: `EntriesManagementPage`
- **Key Features**:
  - List of all entered raffles
  - Entry details
  - Status tracking

**Management Features**:

1. **Entry Listing**: Grid of entry cards with key information
2. **Entry Details**: Modal for viewing detailed entry information
3. **Status Tracking**: Visual indicators of entry and raffle status

### 3. Detailed Entrant's Workflow

#### 3.1 Discovering Raffles

Entrants can discover raffles through multiple channels.

**Implementation Status**: ✅ Implemented

- **Channels**:
  - Direct browsing on Rafflecast platform
  - Shared Farcaster Frames in users' feeds
  - Links shared on social media platforms
  - Warpcast channel posts

**Discovery Features**:

1. **Farcaster Frames**: Interactive preview cards in Farcaster feeds
2. **Direct Links**: URLs that lead directly to specific raffles
3. **Browse Interface**: Grid listing of active raffles on the platform

#### 3.2 Login or Create Warpcast Account

Authentication is required for raffle participation.

**Implementation Status**: ✅ Implemented

- **Component**: Uses `@farcaster/auth-kit` for authentication
- **Login Options**:
  - Existing Farcaster account login
  - Support for new users to connect their Farcaster accounts

**Authentication Features**:

1. **Farcaster Integration**: Seamless login with Farcaster credentials
2. **Profile Connection**: Links user's Farcaster profile with their Rafflecast account
3. **Wallet Association**: Connects user's verified wallet addresses for prize delivery

#### 3.3 Meeting Raffle Criteria

Entrants must meet specified criteria to be eligible.

**Implementation Status**: ✅ Implemented (Base criteria - Cast likes)
**Planned Expansion**: 🔄 In Progress (Additional criteria types)

- **Current Criteria Types**:
  - Like a specific Cast
- **Planned Criteria Types**:
  - Token ownership
  - Following accounts
  - Channel membership
  - Recasting content

**Verification Process**:

1. **Criteria Check**: System checks against Farcaster API to verify criteria completion
2. **Eligibility Status**: Visual indicator shows whether user has met requirements
3. **Requirements Display**: Clear instructions on how to meet criteria

#### 3.4 Confirming Eligibility and Entering Raffles

Eligible entrants can submit their entry.

**Implementation Status**: ✅ Implemented

- **Components**: `RaffleDetailsPanel`, `FrameRafflePage`
- **Key Functions**: `handleCheckEligibility()`, `handleJoinRaffle()`

**Entry Process**:

1. **Eligibility Check**: User verifies that they meet all criteria
2. **Wallet Selection**: User selects which verified wallet should receive potential prizes
3. **Entry Submission**: User confirms their entry
4. **Confirmation**: System provides feedback on successful entry

#### 3.5 Participating and Engaging

After entering, users can track and engage with raffles.

**Implementation Status**: ✅ Implemented

- **Components**: `EntriesManagementPage`, `EntryDetailModal`
- **Engagement Options**:
  - View entered raffles
  - Check status updates
  - Share raffles with others

**Engagement Features**:

1. **Entry Management**: Dashboard for viewing all entered raffles
2. **Status Updates**: Visual indicators of raffle progress
3. **Sharing Tools**: Options to share raffles with other potential participants

#### 3.6 Winner Announcement and Prize Distribution

Winners are selected randomly after the raffle closes.

**Implementation Status**: ✅ Implemented

- **Selection Process**: Uses `settleRaffle()` function
- **Distribution**: Uses `MerkleDistributor` contract for token rewards

**Winner Selection Process**:

1. **Automatic Selection**: Random selection from eligible entries after closing date
2. **Notification**: Winners are notified of their selection
3. **Prize Distribution**:
   - **Onchain Rewards**: Winners can retrieve their prizes from the MerkleDistributor using their whitelisted wallet
   - **Offchain Rewards**: Instructions provided for manual prize collection

## Integration Points

### 1. Farcaster Integration

#### 1.1 Authentication

- **Implementation**: `@farcaster/auth-kit`
- **Usage**: User login and identity verification
- **Components**: `Header`, `SignInButton`

#### 1.2 Content Verification

- **Implementation**: Farcaster API via Pinata
- **Usage**: Verify user actions like liking or recasting content
- **Functions**: `checkLikeCondition()`, `checkRecastCondition()`

#### 1.3 Frame Integration

- **Implementation**: `@farcaster/frame-sdk`
- **Usage**: Interactive raffle cards in Farcaster feeds
- **Components**: `FrameMeta`, `FrameProvider`, `FrameRafflePage`

### 2. Blockchain Integration

#### 2.1 Token Distribution

- **Implementation**: MerkleDistributor contract
- **Usage**: Securely distribute tokens to raffle winners
- **Components**: `CreateDistributionPage`
- **Functions**: `createDistribution()`

#### 2.2 Wallet Connection

- **Implementation**: ConnectKit, Wagmi
- **Usage**: Connect user wallets for transaction signing
- **Components**: `Web3Provider`, `ConnectKitButton`

## User Journeys

### Creator Journey: Creating and Settling a Raffle

1. **Login**: Creator authenticates with Farcaster account
2. **Create Raffle**:
   - Navigate to `/creator/raffles/new`
   - Fill out multi-step form with raffle details
   - Set criteria (e.g., like a specific Cast)
   - Set timeframe and review details
3. **Share Raffle**:
   - Use Share Modal to get direct link or Frame link
   - Share to Warpcast or other platforms
4. **Monitor Entries**:
   - View entries in Management Dashboard
   - Track participation statistics
5. **Settle Raffle**:
   - After closing date, settle raffle to select winner
   - System randomly selects winner from eligible entries
6. **Distribute Rewards**:
   - For token rewards, use MerkleDistributor
   - Set up distribution parameters and Merkle tree with whitelisted winner wallets
   - Winners can claim their prizes from the MerkleDistributor contract using their whitelisted wallet

### Entrant Journey: Discovering and Entering a Raffle

1. **Discovery**:
   - See raffle in Farcaster feed as a Frame
   - Click to interact or enter
2. **Authentication**:
   - Login with Farcaster account
3. **View Details**:
   - See raffle information and criteria
4. **Meet Criteria**:
   - Like required Cast or meet other criteria
   - Check eligibility status
5. **Enter Raffle**:
   - Select wallet for potential prize delivery
   - Confirm entry
6. **Track Status**:
   - View entered raffles in profile
   - Await winner announcement
7. **Receive Prize** (if winner):
   - Claim tokens from the MerkleDistributor contract using whitelisted wallet
   - Follow instructions for offchain prizes

## Future Enhancements

### Planned Features

1. **Additional Criteria Types**:

   - Token ownership verification
   - Following accounts verification
   - Channel membership verification
   - Recast verification

2. **Enhanced Analytics**:

   - Dashboard for creators to track raffle performance
   - Participation metrics and conversion rates

3. **Advanced Sharing Options**:

   - Custom Frame designs
   - Embedding options for websites

4. **Multiple Winner Support**:

   - Select multiple winners from entry pool
   - Distribute different prize tiers

5. **Event Integration**:
   - Link raffles to specific events or timeframes
   - Schedule automated raffle series
