Raffle Creation with Zora Coins Implementation Plan (Updated)
Overview of Changes
We'll modify the existing raffle creation workflow to:

Remove the entry criteria section completely
Make raffles open by default
Integrate Zora Coins SDK to create unique tokens that serve as "tickets" for each raffle
Add default prize settings ($500 USDC with equitable distribution across 10 winners)
Use Windmill UI components and Tailwind CSS for styling

Prize Distribution Model
The default prize distribution will follow this equitable structure:

1st place: 45% ($225)
2nd place: 12.5% ($62.50) × 2 winners = 25% ($125)
Remaining 7 winners: 30% ($150) distributed in decreasing amounts:

3rd place: 7.5% ($37.50) × 2 winners = 15% ($75)
4th place: 5% ($25) × 2 winners = 10% ($50)
5th place: 2.5% ($12.50) × 3 winners = 7.5% ($37.50)

This equitable distribution model gives prominence to top winners while ensuring all participants receive meaningful rewards.
Current vs. New Workflow
Current Workflow:

Basic Information (Title, Description, Entry Criteria)
Time Settings (Start/End Dates, Challenge Period)
Review and Submit

New Workflow:

Basic Information (Title, Description) - No entry criteria
Time Settings (with Start Date defaulting to "On Creation")
Ticket Token Creation (Creating a Zora Coin that will serve as raffle tickets)
Review and Submit

Files to Create

src/components/raffle/BasicInfoStep.jsx

Purpose: Simplified component for collecting title and description
Content: Form fields for raffle title and description
Dependencies: Windmill UI components

src/components/raffle/TimeSettingsStep.jsx

Purpose: Component for setting raffle duration
Content: Fields for closing date/time and challenge period
Implementation: Start date will be fixed to "On Creation"

src/components/raffle/ZoraTicketStep.jsx

Purpose: Component for creating a Zora Coin to serve as raffle tickets
Content: Form for creating a new token including name and symbol
Functionality: Integration with Zora Coins SDK

src/components/raffle/ReviewStep.jsx

Purpose: Final review of all raffle details before submission
Content: Summary of all raffle information including token details
Implementation: Uses updated RaffleSummary component

src/utils/zoraUtils.js

Purpose: Utility functions for Zora Coins SDK integration
Content: Functions for creating and managing Zora Coins
Implementation: Wrapper around Zora Coins SDK API

Files to Modify

src/pages/CreateRafflePage.jsx

Changes:

Remove entry criteria and cast lookup functionality
Integrate new step components
Update progress indicator for new workflow
Add default prize values ($500 USDC, 10 winners with equitable distribution)

src/components/RaffleSummary.jsx

Changes:

Remove entry criteria section
Add Zora ticket token information section
Add prize distribution information section
Convert to Windmill UI components and Tailwind CSS

src/context/RaffleContext.jsx

Changes:

Update raffle data structure to include Zora token information
Update prize structure to include distribution model
Remove criteria-related functionality

Data Structure Changes
Current Raffle Data Structure:
javascript{
id: String,
creator: Number,
title: String,
description: String,
startDate: String,
startTime: String,
closingDate: String,
closingTime: String,
challengePeriod: String,
createdAt: String,
updatedAt: String,
phase: String,
criteria: JSON String,
distributions: JSON String
}
New Raffle Data Structure:
javascript{
id: String,
creator: Number,
title: String,
description: String,
startDate: String, // Will be set to creation time
startTime: String, // Will be set to creation time
closingDate: String,
closingTime: String,
challengePeriod: String,
createdAt: String,
updatedAt: String,
phase: String,
ticketToken: {
id: String, // Zora token ID
name: String,
symbol: String,
contractAddress: String
},
prize: {
amount: Number, // Default: 500
currency: String, // Default: "USDC"
winnerCount: Number, // Default: 10
distribution: {
model: String, // "equitable"
tiers: [
{ position: "1st", percentage: 45, winners: 1 },
{ position: "2nd", percentage: 12.5, winners: 2 },
{ position: "3rd", percentage: 7.5, winners: 2 },
{ position: "4th", percentage: 5, winners: 2 },
{ position: "5th", percentage: 2.5, winners: 3 }
]
}
},
distributions: JSON String
}
Implementation Strategy

Phase 1: Setup and Component Structure

Install Zora Coins SDK
Create component folder structure
Implement utility functions for Zora integration

Phase 2: Basic Components & UI

Implement basic step components with Windmill UI
Update the main CreateRafflePage component
Create simplified RaffleSummary component

Phase 3: Zora Integration

Implement token creation functionality
Add token display in review step
Update data structure in RaffleContext

Phase 4: Testing and Refinement

Test complete workflow
Ensure proper error handling
Refine UI/UX

Dependencies to Add

@zoralabs/coins-sdk - For Zora Coins integration

Timeline Estimate

Phase 1: 1 day
Phase 2: 2 days
Phase 3: 2 days
Phase 4: 1 day

Total: Approximately 6 days for implementation
Potential Challenges and Mitigations

Challenge: Zora SDK Integration Complexity
Mitigation: Begin with simpler mock implementation, then replace with actual SDK calls
Challenge: Token Creation Performance
Mitigation: Add proper loading states and error handling
Challenge: User Experience with Defaults
Mitigation: Provide clear UI indicators for default values and future customization options

Next Steps After Completion

Improve the token creation with more customization options
Enhance the prize distribution settings with customization options
Implement the raffle settlement workflow to distribute prizes to winners according to the tiered structure

This implementation plan provides a structured approach to modify the raffle creation process, focusing on using Zora Coins as raffle tickets with an equitable prize distribution model.
