// src/pages/ManageRafflesPage.jsx
import { useProfile } from "@farcaster/auth-kit";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Pagination from "@/components/Pagination";
import RaffleEntriesModal from "@/components/RaffleManagement/RaffleEntriesModal";
import { useRaffle } from "@/hooks/useRaffle";
import { settleRaffle } from "@/utils/raffleUtils";

import "@/styles/manage-raffles.css";
import "@/styles/raffle-entries-modal.css";

// Raffle Card Component
const RaffleCard = ({ raffle, onCheckEntries, onSettleRaffle }) => {
  const isClosingPassed = new Date(raffle.closingDate) < new Date();
  const isInActivePhase = raffle.phase === "Active";
  const canSettle = isClosingPassed && isInActivePhase;

  // Calculate days remaining or days passed since closing
  const daysRemaining = () => {
    const today = new Date();
    const closing = new Date(raffle.closingDate);
    const diffTime = closing - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} remaining`;
    } else if (diffDays < 0) {
      return `Closed ${Math.abs(diffDays)} day${
        Math.abs(diffDays) !== 1 ? "s" : ""
      } ago`;
    } else {
      return "Closing today";
    }
  };

  return (
    <div className="raffle-card">
      <div className="raffle-card-header">
        <div className="raffle-title">{raffle.title || "Unnamed Raffle"}</div>
        <span className={`raffle-status ${raffle.phase.toLowerCase()}`}>
          {raffle.phase}
        </span>
      </div>

      <div className="raffle-card-body">
        <div className="raffle-info">
          <div className="info-item">
            <span className="label">Closing:</span>
            <span className="value">
              {new Date(raffle.closingDate).toLocaleDateString()}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Status:</span>
            <span className="value time-status">{daysRemaining()}</span>
          </div>
        </div>
      </div>

      <div className="raffle-card-actions">
        <button
          className="btn btn-primary action-btn"
          onClick={() => onCheckEntries(raffle.id)}
        >
          View Entries
        </button>

        {canSettle ? (
          <button
            className="btn btn-warning action-btn"
            onClick={() => onSettleRaffle(raffle.id)}
          >
            Settle Raffle
          </button>
        ) : (
          <button
            className="btn btn-secondary action-btn"
            onClick={() =>
              (window.location.href = `/creator/raffles/edit/${raffle.id}`)
            }
          >
            Edit Details
          </button>
        )}
      </div>
    </div>
  );
};

RaffleCard.propTypes = {
  raffle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string, // Made optional with fallback
    phase: PropTypes.string.isRequired,
    closingDate: PropTypes.string.isRequired,
  }).isRequired,
  onCheckEntries: PropTypes.func.isRequired,
  onSettleRaffle: PropTypes.func.isRequired,
};

// Main Component
const ManageRafflesPage = () => {
  const { isAuthenticated, profile } = useProfile();
  const { getRafflesByCreator, getEntriesByRaffleId } = useRaffle();
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [fetchingEntries, setFetchingEntries] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1); // Start with 1 as default
  const [showEntriesModal, setShowEntriesModal] = useState(false);
  const { fid = "" } = profile || {};
  const navigate = useNavigate();

  // Debounced resize handler to prevent too many rerenders
  useEffect(() => {
    let resizeTimer;

    const handleDebouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const width = window.innerWidth;
        if (width >= 1280) {
          setItemsPerPage(4); // 4 columns on large screens
        } else if (width >= 960) {
          setItemsPerPage(3); // 3 columns on medium screens
        } else if (width >= 640) {
          setItemsPerPage(2); // 2 columns on small screens
        } else {
          setItemsPerPage(1); // 1 column on mobile
        }
      }, 150); // Small delay to debounce resize events
    };

    // Set initial value
    handleDebouncedResize();

    // Add event listener
    window.addEventListener("resize", handleDebouncedResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleDebouncedResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Handle page adjustments when screen size changes
  useEffect(() => {
    // Calculate total pages based on new itemsPerPage
    const totalPages = Math.ceil(raffles.length / itemsPerPage);

    // If current page is now beyond total pages, reset to last available page
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [itemsPerPage, raffles.length, currentPage]);

  useEffect(() => {
    if (fid) {
      setLoading(true);
      try {
        const fetchedRaffles = getRafflesByCreator(fid);
        setRaffles(fetchedRaffles);
      } catch (error) {
        console.error("Error fetching raffles:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [fid, getRafflesByCreator]);

  const handleCheckEntries = async (raffleId) => {
    setFetchingEntries(true);
    setShowEntriesModal(true);

    try {
      const fetchedEntries = await getEntriesByRaffleId(raffleId);
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setFetchingEntries(false);
    }
  };

  const handleCloseEntriesModal = () => {
    setShowEntriesModal(false);
    setEntries([]);
  };

  const handleSettleRaffle = async (raffleId) => {
    if (!raffles || raffles.length === 0) {
      console.log("No raffles available to settle.");
      return;
    }

    try {
      const raffle = raffles.find((r) => r.id === raffleId);
      const entriesForRaffle = await getEntriesByRaffleId(raffleId);
      const result = await settleRaffle(raffle, entriesForRaffle);

      if (result.success) {
        console.log(`Raffle ${raffleId} has been settled.`);
        navigate(`/creator/distribute-rewards/${raffleId}`, {
          state: {
            winners: result.winners.map((winner) => winner.prizeWallet),
          },
        });
      } else {
        console.log(result.error || "Error settling raffle");
      }
    } catch (error) {
      console.log(error.message || "Error settling raffle");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container auth-required">
        <div className="auth-message">
          <h2>Manage Your Raffles</h2>
          <p>Please sign in with Warpcast to manage your raffles.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container loading">
        <div className="loading-indicator">
          <h2>Manage Your Raffles</h2>
          <p>Loading your raffles...</p>
        </div>
      </div>
    );
  }

  // Get current raffles for pagination
  const indexOfLastRaffle = currentPage * itemsPerPage;
  const indexOfFirstRaffle = indexOfLastRaffle - itemsPerPage;
  const currentRaffles = raffles.slice(indexOfFirstRaffle, indexOfLastRaffle);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Manage Your Raffles</h2>
        <Link to="/creator/raffles/new" className="btn btn-create">
          Create New Raffle
        </Link>
      </div>

      {!raffles.length ? (
        <div className="empty-state">
          <div className="empty-state-message">
            <h3>No Raffles Yet</h3>
            <p>
              You haven&apos;t created any raffles yet. Get started by creating
              your first raffle!
            </p>
            <Link to="/creator/raffles/new" className="btn btn-primary">
              Create Your First Raffle
            </Link>
          </div>
        </div>
      ) : (
        <div className="manage-raffles-container">
          <div className="raffles-list">
            {currentRaffles.map((raffle) => (
              <RaffleCard
                key={raffle.id}
                raffle={raffle}
                onCheckEntries={handleCheckEntries}
                onSettleRaffle={handleSettleRaffle}
              />
            ))}
          </div>

          <Pagination
            totalItems={raffles.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {/* Entries Modal */}
      {showEntriesModal && (
        <RaffleEntriesModal
          entries={entries}
          isLoading={fetchingEntries}
          onClose={handleCloseEntriesModal}
        />
      )}
    </div>
  );
};

export default ManageRafflesPage;
