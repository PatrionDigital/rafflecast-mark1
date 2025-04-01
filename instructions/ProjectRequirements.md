# Rafflecast Project Requirements Document (PRD)

## Project Objectives

The project aims to create a web application called "Rafflecast" that allows users to create and participate in raffles on the Farcaster social network. The platform will enable users to:

- Create raffles with specific entry criteria (such as liking a particular Farcaster cast)
- Enter raffles if they meet the eligibility criteria
- Distribute rewards to raffle winners via blockchain transactions
- Share raffles through Farcaster Frames for increased engagement

## Project Scope

### In Scope

- User authentication via Farcaster Auth Kit
- Raffle creation and management interface
- Raffle entry verification system
- Rewards distribution system using smart contracts
- Integration with Farcaster Frames for sharing raffles
  - **All participant-oriented workflows must be available in the Frame interface:**
  - Browsing raffles
  - Entering raffles
  - Managing raffle entries
  - Sharing raffles
- Mobile and desktop responsive web application
- Profile and dashboard for users to manage their raffles and entries

### Out of Scope

- Native mobile applications
- Advanced analytics and reporting
- Email notifications system
- Community forum or chat features
- Custom reward types (beyond cryptocurrency tokens)

## Functional Requirements

### Authentication

- Users should be able to sign in using Farcaster Auth Kit
- Application should verify Farcaster FID (Farcaster ID) and fetch associated wallet addresses

### Raffle Creation

- Users should be able to create new raffles with:
  - Title and description
  - Entry criteria (like a specific cast)
  - Start and end dates
  - Challenge period end date
  - Reward details

### Raffle Entry

- Users should be able to browse available raffles
- System should verify if users meet the eligibility criteria (e.g., liked a specific cast)
- Users should be able to enter a raffle by specifying a prize wallet address
- System should prevent multiple entries from the same user

### Rewards Distribution

- Raffle creators should be able to distribute rewards to winners
- System should integrate with blockchain contracts for reward distribution
- Support for both ERC20 tokens and potentially other token types

### Sharing System

- Integration with Farcaster Frames for interactive sharing
- Should generate shareable links for raffles
- Frame validator and debugging tools for testing

## Non-Functional Requirements

### Performance

- Page load time should be under 3 seconds
- Should handle concurrent users efficiently

### Security

- Secure wallet connections
- Proper validation of all inputs
- Protection against common web vulnerabilities

### Usability

- Mobile-first responsive design
- Intuitive UI for both raffle creators and participants
- Clear error messages and status indicators

### Compatibility

- Support for modern browsers (Chrome, Firefox, Safari, Edge)
- Integration with Farcaster ecosystem

## Stakeholders

- End users (Raffle creators and participants)
- Farcaster platform (integration partner)
- Development team
- Blockchain network operators

## Assumptions

- Users have a Farcaster account
- Users have Ethereum-compatible wallets
- Users understand basic blockchain concepts for reward distribution
- Access to Pinata API for IPFS storage
- Integration with Base blockchain network

## Constraints

- Farcaster API limitations and rate limits
- Blockchain transaction costs and speed
- Web browser capabilities for crypto wallet integration
- Dependency on third-party services (Pinata, Turso)

## Deliverables

- Fully functional web application
- Admin dashboard for raffle management
- User-facing interfaces for raffle participation
- Frame integration for Farcaster sharing
- Smart contract integration for reward distribution
- Documentation for users and developers

## Milestones

1. Authentication and user profile system
2. Raffle creation and management
3. Raffle entry and verification system
4. Rewards distribution implementation
5. Farcaster Frames integration
6. Testing and bug fixes
7. Production deployment

## Schedule and Deadlines

- Beta version completion: April 15, 2025 (2 weeks to complete Frames integration and final testing)
- Final production deployment: TBD based on beta feedback

## Technical Stack

- Frontend: React with Vite
- State Management: React Context API
- Authentication: Farcaster Auth Kit
- Wallet Connection: ConnectKit, Wagmi, Ethers.js
- Database: Turso (libSQL client)
- File Storage: Pinata for IPFS
- Smart Contracts: EVM-compatible (Base network)
