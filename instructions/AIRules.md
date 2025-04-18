# SecondOrder.fun AI Rules Document

## Project Overview

SecondOrder.fun is a web application built with Vite and React in JavaScript that allows users to create and participate in raffles through the Farcaster social media platform. The application uses authentication with Login With Farcaster and integrates with blockchain technology.

## Development Guidelines

### General Principles

1. **Component-First Approach**: Before creating new components, inquire if existing components can be reused or extended.
2. **Single Page Application**: Maintain a single-page application design for optimal user experience.
3. **Responsive Design**: Ensure the web interface scales appropriately for different devices.
4. **Code Organization**: Maintain clean, organized code with proper separation of concerns.
5. **Performance Optimization**: Focus on delivering high performance with minimal loading times.
6. **Documentation**: Include function documentation for Intellisense. For standalone documentation (such as READMEs) format in Markdown.

### File Structure and Organization

1. **Check Before Creating**: Before creating new files, verify if similar functionality already exists.
2. **Provide Folder Structure**: When creating new features, provide a clear folder structure to maintain organization.
3. **Component Organization**: Group related components in appropriate folders (e.g., `/components/RaffleManagement/`).
4. **Utility Functions**: Keep utility functions separate in the `/utils/` directory.
5. **Styles**: Organize styles properly in the `/styles/` directory, with component-specific styles in appropriate files.

### Coding Standards

1. **PropTypes Required**: Include PropTypes for all React components to ensure type safety.
2. **Default Props**: Set default props for components to handle edge cases.
3. **ESLint Compliance**: Ensure code follows ESLint rules to maintain quality.
4. **Apostrophe Handling**: Replace apostrophes (`'`) with the escape code `&apos;` in HTML display text to prevent linter warnings.
5. **Quotes Handling**: Replace quotes (`"`) with the escape code `&quot;` in HTML display test to prevent linter warnings.
6. **Descriptive Variable Names**: Use clear, descriptive names for variables and functions.
7. **Comments**: Include appropriate comments for complex logic.
8. **Error Handling**: Implement robust error handling throughout the application.

### UI/UX Guidelines

1. **Card-Based Interface**: Group entries into cards using a grid layout.
2. **Responsive Columns**:
   - Mobile: 1 column
   - Tablet: 2 columns
   - Small Desktop: 3 columns
   - Large Desktop: 4 columns
3. **Pagination**: Implement pagination when card entries exceed maximum display count.
4. **Modal Patterns**: Use pop-up style modals with close buttons for detail views.
5. **Consistent Styling**: Maintain consistent styling across all components.
6. **Accessible Design**: Ensure the application is accessible to users with disabilities.

### CSS and Styling

1. **Avoid Supplemental "Fix" CSS Files**: Instead of creating additional CSS fix files, modify existing stylesheets.
2. **Use Existing Style Sheets**: Check existing style sheets before making styling adjustments.
3. **Responsive Design**: Ensure styles work across all device sizes.
4. **CSS Variables**: Utilize CSS variables for consistent theming and easy modifications.
5. **Proper Class Naming**: Use clear, descriptive class names that follow established patterns.

### React Best Practices

1. **Functional Components**: Use functional components with hooks rather than class components.
2. **Custom Hooks**: Extract reusable logic into custom hooks.
3. **Context API**: Use React Context API for state management where appropriate.
4. **Memoization**: Use React.memo, useMemo, and useCallback to optimize performance.
5. **Component Reusability**: Design components to be reusable where possible.
6. **Code Splitting**: Implement code splitting to improve loading times.
7. **Proper Lifecycle Management**: Handle component lifecycles and cleanup properly.

### Authentication and Security

1. **Farcaster Authentication**: Utilize Login With Farcaster for authentication.
2. **Security Best Practices**: Follow web security best practices.
3. **Input Validation**: Validate user inputs to prevent security vulnerabilities.
4. **Protected Routes**: Implement protected routes for authenticated users only.

### Smart Contract Integration

1. **Blockchain Integration**: Properly integrate with blockchain technology for raffle functionality.
2. **Transaction Handling**: Implement robust transaction handling and error recovery.
3. **Gas Optimization**: Consider gas costs in smart contract interactions.
4. **Wallet Connections**: Support multiple wallet providers for better user experience.

### Testing and Quality Assurance

1. **Test Components**: Write tests for components and functionality.
2. **Cross-Browser Compatibility**: Ensure the application works across different browsers.
3. **Mobile Testing**: Test thoroughly on mobile devices.
4. **Performance Benchmarks**: Set and maintain performance benchmarks.

### Additional Best Practices

1. **Frame Handling**: Properly implement Farcaster Frames for optimal social sharing.
2. **Async Operations**: Handle asynchronous operations properly with loading states and error handling.
3. **User Feedback**: Provide clear feedback for user actions (success, error messages, etc.).
4. **Localization**: Design with potential for localization in mind.
5. **Documentation**: Document code and features for future reference.
6. **Versioning**: Implement proper versioning for APIs and features.

## Implementation Checklist

- [ ] User authentication with Farcaster
- [ ] Raffle creation interface
- [ ] Raffle entry and participation
- [ ] Raffle management for creators
- [ ] Entry management for participants
- [ ] Social sharing features with Frames
- [ ] Smart contract integration for rewards distribution
- [ ] Responsive design across devices
- [ ] Comprehensive error handling
- [ ] Performance optimization

## Appendix

### Key Components Reference

- **RaffleCard**: Display individual raffle information in a card format
- **RaffleDetailsPanel**: Modal component for viewing raffle details
- **CreateRafflePage**: Interface for creating new raffles
- **BrowseRafflesPage**: Grid display of available raffles
- **FrameRafflePage**: Special page for Farcaster Frame integration
- **MessageDisplay**: Component for showing system messages and alerts
- **ShareModal**: Modal for sharing raffles on social media

### Style Reference

Main style files:

- **index.css**: Global styles and CSS variables
- **pages.css**: Page layout styles
- **parent-layout.css**: Main layout structure
- **frame.css**: Farcaster Frame specific styles
- **manage-raffles.css**: Styles for raffle management interface
- **entries-management.css**: Styles for entry management

### Key Utilities Reference

- **merkleUtils.js**: Utilities for Merkle tree creation and verification
- **contractUtils.js**: Utilities for interacting with smart contracts
- **farcasterUtils.js**: Utilities for Farcaster integrations
- **frameUtils.js**: Utilities for Frame generation and handling
- **raffleUtils.js**: Core raffle functionality utilities

### Crypto Terminology Reference

- Use `onchain` to desribe operations and functionality that uses smartcontracts and blockchain technology
- Use `off-chain` to describe operations and functionality that uses "web2" technologies (such as wep pages, centralized databases, etc)
