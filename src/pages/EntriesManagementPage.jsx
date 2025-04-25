// src/pages/EntriesManagementPage.jsx
// src/pages/EntriesManagementPage.jsx - Updated import section
//import { useProfile } from "@farcaster/auth-kit";
import { useAuth } from "@/hooks/useAuth";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import {
  EntryCardGrid,
  EntryDetailModal,
} from "@/components/EntriesManagement";
import Pagination from "@/components/Pagination";
import { useRaffle } from "@/hooks/useRaffle";

const EntriesManagementPage = ({ itemsPerPage = 4 }) => {
  const { entries, clearMessage } = useRaffle();
  //const { isAuthenticated, profile } = useProfile();
  const { isAuthenticated, profile } = useAuth();
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, mine, active

  useEffect(() => {
    // Reset the RaffleContext eventMessage when loading new component/page
    if (clearMessage) {
      clearMessage();
    }
  }, [clearMessage]);

  useEffect(() => {
    if (entries?.length > 0) {
      setLoading(true);
      try {
        let filtered = [...entries];

        // Apply filters based on filter type
        if (filterType === "mine" && isAuthenticated && profile?.fid) {
          filtered = entries.filter(
            (entry) => entry.participant === profile.fid
          );
        } else if (filterType === "active") {
          // Assuming there&apos;s a status or endDate field to determine if active
          filtered = entries.filter((entry) => entry.status === "active");
        }

        setFilteredEntries(filtered);
      } catch (e) {
        setError("Error processing entries. " + e.message);
      } finally {
        setLoading(false);
      }
    } else {
      setFilteredEntries([]);
    }
  }, [entries, filterType, isAuthenticated, profile?.fid]);

  // Calculate pagination
  const itemsPerPageValue = itemsPerPage || 4; // Fallback in case prop is undefined
  const currentEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPageValue,
    currentPage * itemsPerPageValue
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEntrySelect = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <p>Please sign in with Warpcast to view your entries.</p>
      </div>
    );
  }

  if (loading) return <p>Loading entries...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="entries-management">
      <h2>My Raffle Entries</h2>

      <div className="filter-controls">
        <select value={filterType} onChange={handleFilterChange}>
          <option value="all">All Entries</option>
          <option value="mine">My Entries</option>
          <option value="active">Active Raffles</option>
        </select>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="empty-state">
          <p>No entries found matching your criteria.</p>
          <p>Browse raffles to find ones you&apos;d like to enter!</p>
        </div>
      ) : (
        <>
          <EntryCardGrid
            entries={currentEntries}
            onSelectEntry={handleEntrySelect}
          />

          <Pagination
            totalItems={filteredEntries.length}
            itemsPerPage={itemsPerPageValue}
            currentPage={currentPage}
            setCurrentPage={handlePageChange}
          />
        </>
      )}

      {isModalOpen && selectedEntry && (
        <EntryDetailModal entry={selectedEntry} onClose={handleCloseModal} />
      )}
    </div>
  );
};

EntriesManagementPage.propTypes = {
  itemsPerPage: PropTypes.number,
};

export default EntriesManagementPage;
