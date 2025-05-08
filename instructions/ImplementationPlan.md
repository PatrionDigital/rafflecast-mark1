# SecondOrder.fun Implementation Plan

## 1. MVP with Web App Interface (Off-chain Database)

### Core Components

- **Authentication System**

  - Continue with Farcaster Auth Kit for user login
  - Store user profiles with their FIDs

- **Database Structure**

  - Use Turso (SQLite) as shown in your current implementation
  - Tables for raffles, entries, criteria, distributions

- **Web UI Flows**

  - **Creator Flow**

    - Create raffle with title, description, criteria, time settings
    - Manage active raffles
    - Close/settle raffles and select winners
    - Distribute rewards to winners

  - **Participant Flow**
    - Browse available raffles
    - View eligibility status
    - Enter raffles
    - Track entered raffles and status

- **Raffle Logic Implementation**
  - Eligibility verification (currently focused on "Like" criteria)
  - Random winner selection
  - Claim period management

### Deliverables

- Functioning web app with both creator and participant interfaces
- Off-chain database for storing all raffle and entry data
- Basic analytics for creators

## 2. Farcaster Frames Integration

### Frame Implementation

- **Entry Frames** Allow users to enter raffles directly from Farcaster
- **Sharing Frames** Let creators generate frames to promote their raffles
- **Results Frames** Display winners when raffles are settled

### Technical Components

- Build on your existing frame implementation
- Enhance `/frame/raffle/:raffleId` route
- Implement frame context detection and handling
- Support Farcaster wallet connection for prize claiming

### User Flows

- See raffle → Enter without leaving Farcaster
- Share raffles to Warpcast with interactive frame
- Receive notifications about raffle status
- View/track entries from frame interface

### Testing & Debugging

- Enhance the frame debug tool you've already started
- Ensure proper rendering across clients (Warpcast, etc.)

## 3. Additional Criteria Types

### New Criteria Types

- **Recast Criteria** Verify if user has recast a specific cast
- **Follow Criteria** Verify if user follows a specific account
- **Multi-action Criteria** Require multiple conditions (like AND follow)
- **Channel Criteria** Verify membership in specific channels
- **Token-gated Criteria** Require ownership of specific tokens/NFTs

### Implementation Requirements

- Extend criteria data structure to support multiple types
- Create verification functions for each criteria type
- Update UI to allow creators to select and configure criteria
- Build eligibility checking system for each type

### Technical Challenges

- API integration for different verification types
- Caching strategy for performance optimization
- Handling edge cases (unfollows, etc.)

## 4. Migration to On-chain Components

### Contract Architecture

- **Distribution Methods** Explore alternatives to Mint.club's MerkleDistributor for enhanced composability
- **RaffleRegistry** Store raffle metadata and state on-chain
- **Verification Oracle** Bridge between off-chain criteria and on-chain state

### Hybrid Model Design

- Keep criteria verification off-chain (Farcaster-specific)
- Store entry proofs and winner selection on-chain
- Use Merkle trees for efficient verification

### Distribution Protocol Options

- **Custom Distribution Contract** Build dedicated distribution logic specific to raffles
- **Integration with Existing Protocols** Explore Zora, Sound.xyz, or other distribution mechanisms
- **Multi-chain Options** Consider distribution compatibility across multiple chains

### Deployment Strategy

- Initially deploy to Base (as shown in your current code)
- Consider multi-chain approach for wider accessibility
- Implement proper upgradeability patterns

### Security Considerations

- Audit contracts before production deployment
- Implement circuit breakers and emergency controls
- Design proper access control systems

## 5. Tokenomics Design

### Token Utility

- Creator rewards for hosting popular raffles
- Entry fees (optional) for premium raffles
- Governance over platform parameters
- Staking for enhanced features

### Economic Model

- Sustainable fee structure (% of prize or flat fee)
- Incentives for early adopters
- Protocol revenue distribution
- Treasury management

### Implementation Strategy

- Start with non-token MVP to grow user base
- Phase in token features gradually
- Build governance system with token holders

### Market Fit

- Research competitor models (such as Lens Protocol raffles)
- Differentiate with Farcaster-specific features
- Build for long-term sustainability

## 6. NFT Integration (Optional)

### Raffle Tickets as NFTs

- Design collectible ticket system
- Implement transferable vs. non-transferable options
- Build on ERC-721 or ERC-1155 standards

### Zora Integration

- Research integration with Zora's NFT creation tools
- Explore using Zora for NFT-based prizes
- Consider Zora Drops for raffle winners

### Advanced Features

- Tiered entry systems with different NFT values
- Historical provenance for winning tickets
- Secondary market considerations

### Technical Architecture

- Contract interactions between raffle system and NFT contracts
- Gas optimization for batch minting
- Metadata standards for ticket NFTs

## Next Steps and Priorities

Based on your current codebase, this execution order is recommended:

1. **Complete the MVP Web App**

   - Finish the entry management system
   - Polish the creator dashboard
   - Implement robust error handling

2. **Enhance Frame Integration**

   - Improve the user experience in frames
   - Add more sharing and viral features
   - Optimize for mobile frame interaction

3. **Add More Criteria Types**

   - Start with Recast criteria as it's similar to Like
   - Test thoroughly with real Farcaster users
   - Document API integration points

4. **Begin On-chain Component Development**

   - Research alternative distribution methods to MerkleDistributor
   - Start with proof-of-concept for on-chain components
   - Test with small-scale prizes first
   - Build migration path from off-chain to on-chain

5. **Design Tokenomics in Parallel**
   - Research while building technical components
   - Get community feedback on token utility
   - Prepare whitepaper/documentation

## Implementation Steps

### Step 1: Basic SDK Integration

#### Create Core SDK Utility Functions

- Expand the existing zoraUtils.js to include:
- SDK initialization function with proper provider configuration
- Helper to check SDK connectivity status
- Error handling wrapper for SDK calls

#### Token Information Fetching

- Implement function to fetch token details by address
- Create utility to get token price and market data
- Build price history fetching for charts

### Files to Update for Zora SDK Integration

1. src/utils/zoraUtils.js
This file already exists with basic mock functions. We'll need to expand it significantly:
Changes needed:

Add SDK initialization with proper configuration
Implement token information retrieval functions
Create price data fetching utilities
Add error handling wrapper for all SDK calls
Update existing mock functions to align with SDK patterns

2. src/utils/Web3Provider.jsx
Needs minor updates to ensure proper provider configuration for Zora SDK:
Changes needed:

Ensure the provider is properly exposed for Zora SDK use
Add any necessary network configuration for Base chain

3. package.json
Verify the Zora SDK dependencies:
Changes needed:

Ensure @zoralabs/coins-sdk is properly listed with correct version
Add any additional dependencies required for SDK integration

4. src/context/RaffleContext.jsx
The context needs to be updated to handle token-related state:
Changes needed:

Add token-related state (userTokens, tokenPrices)
Integrate token fetching into raffle loading logic
Add methods for token purchases and sales

5. src/components/EntriesManagement/EntryCard.jsx
Update to display token position information:
Changes needed:

Add token position display section
Show token value and profit/loss indicators

6. src/components/EntriesManagement/EntryDetailModal.jsx
Extend to include token management features:
Changes needed:

Add token details section
Include buy/sell controls
Show position history if available

7. src/hooks/useRaffle.js
Update to include token-related functionality:
Changes needed:

Add token-specific hooks or functions
Include position management methods

8. New file: src/components/TokenPurchaseForm.jsx
Create a new component for token purchasing:
Details:

Form for specifying purchase amount
Price impact preview
Confirmation flow
Success/failure handling

9. New file: src/components/TokenSaleForm.jsx
Create a new component for token selling:
Details:

Form for specifying sale amount (partial or full)
Price impact preview
Confirmation flow
Success/failure handling

10. New file: src/components/TokenPositionChart.jsx
Create a chart component for token price history:
Details:

Price history visualization
User's purchase points indicated
Performance metrics display

Implementation Priority Order

Expand zoraUtils.js with core SDK functionality
Update Web3Provider.jsx if needed
Enhance RaffleContext.jsx to handle token state
Create the new token-related components
Update the existing entry management components

Step 2: Mock Token Pool Implementation

Create Liquidity Pool Simulation

Implement a mock liquidity pool with 990 million token limit
Add function to calculate token price based on pool reserves
Set up token price slippage simulation


Purchase Flow Implementation

Create function to simulate token purchases from pool
Implement price impact calculation
Add transaction delay simulation for realistic UX
Store purchase records in local state or mock database


Sell Flow Implementation

Create function to return tokens to the liquidity pool
Calculate sell proceeds based on pool dynamics
Update user balances after selling
Maintain transaction history



Step 3: User Token Management

User Balance Tracking

Implement function to track user's token balances across raffles
Create utility to calculate total portfolio value
Add function to show profit/loss statistics


Position Management

Implement increasing position size functionality
Create partial sell functionality
Add position liquidation (full sell) capability



Step 4: Transaction History

Transaction Recording

Design schema for transaction records
Implement function to add transaction to history
Create query functions to retrieve transaction history


Transaction Analysis

Add function to calculate average purchase price
Implement realized/unrealized gains calculation
Create period-based performance metrics



Step 5: Mock Data Generation

Token Data Generation

Create function to generate realistic token price movement patterns
Implement time-based price fluctuations
Add market cap and volume simulations


User Activity Simulation

Create function to simulate other users' trading activity
Implement realistic market impact from simulated trades
Add randomized trading patterns



Integration Points
Entry Creation Flow Connection

Link to Raffle Entry Process

Add token purchase step to raffle entry workflow
Update entry model to include token position data
Connect entry creation with token purchase functions


Purchase Confirmation

Implement purchase preview before confirmation
Create success/failure handling for purchases
Add position details to entry confirmation



Entry Management Connection

Dashboard Integration

Connect token position data to entry cards
Add token value calculations to entries list
Implement sorting by position value


Detail View Enhancement

Extend entry detail modal to show token position details
Add buy/sell controls to detail view
Implement position history visualization



Testing and Validation

Mock Transaction Testing

Create test suite for simulated purchases/sales
Validate price impact calculations
Test edge cases (large purchases, pool exhaustion)


UI Flow Testing

Verify entry creation with token purchase
Test position management UI
Validate transaction history display
