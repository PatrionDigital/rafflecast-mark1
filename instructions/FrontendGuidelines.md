# SecondOrder.fun Frontend Guidelines

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Code Structure](#code-structure)
4. [Component Guidelines](#component-guidelines)
5. [State Management](#state-management)
6. [Styling Approach](#styling-approach)
7. [Form Handling](#form-handling)
8. [Error Handling](#error-handling)
9. [Performance Optimization](#performance-optimization)
10. [Responsive Design](#responsive-design)
11. [Accessibility](#accessibility)
12. [Testing](#testing)
13. [Farcaster Frame Integration](#farcaster-frame-integration)
14. [Web3 Integration](#web3-integration)

## Project Overview

SecondOrder.fun is a raffle platform built on Farcaster, allowing users to create and join raffles using Farcaster authentication. It supports web-based interaction as well as Farcaster Frames for native integration with Farcaster clients.

### Key Features

- Raffle creation and management
- Raffle entry and participation
- Farcaster authentication
- Wallet connection for prize distribution
- Farcaster Frame integration

## Tech Stack

### Core Libraries and Frameworks

- **React** (18.3+) - UI library
- **Vite** - Build tool and development server
- **React Router** (v7) - Client-side routing
- **Farcaster Auth Kit** - Authentication with Farcaster
- **ConnectKit** - Wallet connection
- **Wagmi** / **Viem** - Ethereum interaction
- **Ethers.js** - Blockchain interaction
- **MerkleTreeJS** - For generating Merkle proofs

### Styling

- Tailwindcss for base styling framework
- Windmill React components for dashboard pages

### Data Management

- Context API and custom hooks for state management
- Turso/LibSQL for data persistence

## Code Structure

### Directory Structure

```dir
src/
├── assets/                 # Static assets like images, SVGs
├── components/             # Reusable UI components
│   ├── EntriesManagement/  # Components for entries management
│   ├── RaffleManagement/   # Components for raffle management
│   └── ...
├── context/                # React context providers
├── frames/                 # Farcaster Frames related code
│   ├── api/                # Frame API interactions
│   ├── components/         # Frame-specific components
│   └── utils/              # Frame utility functions
├── hooks/                  # Custom React hooks
├── pages/                  # Page components
│   └── layouts/            # Layout components
├── services/               # External service integrations
├── styles/                 # Global and component-specific CSS
├── utils/                  # Utility functions and helpers
├── App.jsx                 # Main App component
├── main.jsx                # Entry point
└── router.jsx              # Router configuration
```

## Component Guidelines

### Component Creation

1. **Use functional components** with hooks instead of class components
2. **Component file naming**: Use PascalCase (e.g., `RaffleCard.jsx`)
3. **Create specific directories** for related component groups
4. **Export at the bottom** of the file, not inline with the component declaration

### PropTypes and Default Props

- Always define PropTypes for all components
- Set defaultProps for optional props
- Structure PropTypes with destructuring and default values:

```jsx
const MyComponent = ({ title = "Default Title", items = [] }) => {
  return (
    // Component implementation
  );
};

MyComponent.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array
};

export default MyComponent;
```

### Component Structure

- Import statements at the top, grouped by category
- Component definition
- Helper functions within the component scope
- PropTypes definitions
- Export statement

Example:

```jsx
// External imports
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Internal imports
import { useRaffle } from "../hooks/useRaffle";
import "./ComponentName.css";

const ComponentName = ({ prop1, prop2 }) => {
  // State definitions
  const [state, setState] = useState(initialState);

  // Effects and other hooks
  useEffect(() => {
    // Effect implementation
  }, [dependencies]);

  // Event handlers and other functions
  const handleClick = () => {
    // Handler implementation
  };

  // Render logic
  return <div className="component-name">{/* Component JSX */}</div>;
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.arrayOf(PropTypes.object),
};

export default ComponentName;
```

## State Management

### State Management Guidelines

1. Use React hooks for component-level state (`useState`, `useReducer`)
2. Use Context API for global state (with custom hooks for access)
3. Split context providers by domain (RaffleContext, MessageContext)
4. Create custom hooks to abstract away complex state logic

### Context Creation Pattern

```jsx
// Context definition
import { createContext, useState } from "react";

const ExampleContext = createContext();

// Provider component
export function ExampleProvider({ children }) {
  const [state, setState] = useState(initialState);

  const contextValue = {
    state,
    updateState: (newState) => setState(newState),
  };

  return (
    <ExampleContext.Provider value={contextValue}>
      {children}
    </ExampleContext.Provider>
  );
}

// Export the context
export { ExampleContext };
```

### Custom Hook for Context

```jsx
// Custom hook to use the context
import { useContext } from "react";
import { ExampleContext } from "../context/ExampleContext";

export const useExample = () => {
  const context = useContext(ExampleContext);

  if (!context) {
    throw new Error("useExample must be used within an ExampleProvider");
  }

  return context;
};
```

## Styling Approach

### CSS Organization

- Use semantic class names based on BEM methodology
- Organize CSS files by component or feature
- Use CSS variables for theming and consistent values

### CSS Variables

```css
:root {
  /* Color Palette */
  --color-primary: #820b8a;
  --color-secondary: #729b79;
  --color-accent: #7899d4;
  --color-highlight: #ff47da;
  --color-background: #f2f4f3;

  /* Typography */
  --font-size-small: 12px;
  --font-size-medium: 16px;
  --font-size-large: 20px;

  /* Layout */
  --header-height: 60px;
  --footer-height: 40px;
}
```

### Media Queries

```css
/* Mobile first approach */
.element {
  width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .element {
    width: 50%;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .element {
    width: 33%;
  }
}
```

## Form Handling

### Form Implementation

- Use controlled components for form inputs
- Create a separate state for each form field
- Validate form inputs before submission
- Provide clear error messages for validation errors

### Form Validation Pattern

```jsx
const [formData, setFormData] = useState({
  field1: "",
  field2: "",
});

const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const validate = () => {
  const newErrors = {};

  if (!formData.field1.trim()) {
    newErrors.field1 = "Field 1 is required";
  }

  // More validation rules

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (validate()) {
    // Submit form data
  }
};
```

## Error Handling

### Error Handling Best Practices

1. Use try/catch blocks for asynchronous operations
2. Display user-friendly error messages
3. Log errors to console in development
4. Use ErrorBoundary for React component errors

### Error Handling Pattern

```jsx
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.getData();
    setData(response);
  } catch (error) {
    console.error("Error fetching data:", error);
    setError("Failed to load data. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

## Performance Optimization

### Performance Strategies

1. Use React.memo for expensive components
2. Use useCallback for functions passed as props
3. Use useMemo for expensive calculations
4. Avoid unnecessary re-renders
5. Optimize list rendering with proper keys

### Pagination Pattern

```jsx
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);

// Calculate pagination
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

// Change page
const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};
```

## Responsive Design

### Responsive Design Principles

1. Mobile-first approach
2. Use CSS Grid and Flexbox for layouts
3. Use relative units (%, rem, em) instead of pixels
4. Test on multiple screen sizes
5. Use media queries for breakpoints

### Grid Implementation for Cards

```jsx
// Component
const CardGrid = ({ items }) => {
  const [columns, setColumns] = useState(4);

  // Adjust columns based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 576) {
        setColumns(1); // Mobile
      } else if (width < 768) {
        setColumns(2); // Tablet
      } else if (width < 992) {
        setColumns(3); // Small desktop
      } else {
        setColumns(4); // Large desktop
      }
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="card-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "1rem",
      }}
    >
      {items.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
};
```

## Accessibility

### Accessibility Requirements

1. Use semantic HTML elements
2. Add proper ARIA attributes when needed
3. Ensure keyboard navigation works
4. Maintain sufficient color contrast
5. Provide alternative text for images

### Modal Accessibility

```jsx
// Accessible modal implementation
const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto"; // Restore scrolling
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-content"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};
```

## Testing

### Testing Guidelines (To DO)

1. Use Jest for unit and component testing
2. Use React Testing Library for component testing
3. Write tests for critical functionality
4. Aim for good test coverage but prioritize quality over quantity

### Testing Pattern

```jsx
// Component test example
import { render, screen, fireEvent } from "@testing-library/react";
import UserComponent from "./UserComponent";

describe("UserComponent", () => {
  test("renders user information correctly", () => {
    render(<UserComponent name="John Doe" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  test("handles click event correctly", () => {
    const mockFn = jest.fn();
    render(<UserComponent onClick={mockFn} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

## Farcaster Frame Integration

### Frame Integration Standards

1. Use the Frame API for frame-specific features
2. Generate proper meta tags for frame discovery
3. Handle frame context and authentication
4. Create shareable frame URLs

### Frame Meta Implementation

```jsx
const FrameMeta = ({ imageUrl, title, frameUrl }) => {
  useEffect(() => {
    // Clear existing frame tags
    document
      .querySelectorAll('meta[name^="fc:frame"]')
      .forEach((tag) => tag.remove());

    // Set up frame meta tags
    const tags = [
      { name: "fc:frame", content: "vNext" },
      { name: "fc:frame:image", content: imageUrl },
      { name: "fc:frame:button:1", content: title },
      { name: "fc:frame:button:1:action", content: "post" },
      { name: "fc:frame:post_url", content: frameUrl },
    ];

    // Add tags to head
    tags.forEach(({ name, content }) => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", name);
      tag.setAttribute("content", content);
      document.head.appendChild(tag);
    });
  }, [imageUrl, title, frameUrl]);

  return null;
};
```

## Web3 Integration

### Web3 Implementation Guidelines

1. Use ConnectKit for wallet connection UI
2. Use Wagmi for React hooks to interact with Ethereum
3. Use Viem for low-level Ethereum interactions
4. Use Ethers.js for complex contract interactions
5. Always handle connection errors gracefully

### Contract Interaction Pattern

```jsx
// Using ethers.js
const getMerkleDistributorContract = (signer) => {
  if (!signer.provider || !signer.sendTransaction) {
    throw new Error("Invalid signer");
  }

  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

const createDistribution = async (signer, distributionData) => {
  const contract = getMerkleDistributorContract(signer);

  const {
    token,
    isERC20,
    amountPerClaim,
    walletCount,
    startTime,
    endTime,
    merkleRoot,
    title,
    ipfsCID,
  } = distributionData;

  const tx = await contract.createDistribution(
    token,
    isERC20,
    amountPerClaim,
    walletCount,
    startTime,
    endTime,
    merkleRoot,
    title,
    ipfsCID
  );

  return tx;
};
```
