# Rafflecast Implementation Plan

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
