// src/components/EntriesManagement/EntryCardGrid.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import EntryCard from "./EntryCard";

const EntryCardGrid = ({ entries = [], onSelectEntry = () => {} }) => {
  const [columns, setColumns] = useState(4);

  // Responsive grid logic
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

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="entry-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "1rem",
      }}
    >
      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          onClick={() => onSelectEntry(entry)}
        />
      ))}
    </div>
  );
};

EntryCardGrid.propTypes = {
  entries: PropTypes.array,
  onSelectEntry: PropTypes.func,
};

export default EntryCardGrid;
