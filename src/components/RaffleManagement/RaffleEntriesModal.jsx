// src/components/RaffleManagement/RaffleEntriesModal.jsx
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

/**
 * Modal component for displaying entries of a raffle
 */
const RaffleEntriesModal = ({
  entries = [],
  isLoading = false,
  onClose = () => {},
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    // Handle escape key press
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Handle clicking outside the modal
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    // Prevent body scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content entries-modal" ref={modalRef}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2>Raffle Entries</h2>

        <div className="entries-header">
          <span className="entry-count">
            {entries.length} participant{entries.length !== 1 ? "s" : ""}
          </span>
        </div>

        {isLoading ? (
          <div className="modal-loading">Loading entries...</div>
        ) : entries.length === 0 ? (
          <div className="modal-empty-state">
            <p>No entries found for this raffle.</p>
            <p>Share your raffle to get more participants!</p>
          </div>
        ) : (
          <div className="entries-list">
            <div className="entries-table">
              <table className="raffle-entries-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Entry Date</th>
                    <th>Prize Wallet</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="participant" data-label="Participant">
                        {entry.participant || "Unknown"}
                      </td>
                      <td className="date" data-label="Entry Date">
                        {formatDate(entry.enteredAt)}
                      </td>
                      <td className="wallet" data-label="Prize Wallet">
                        {entry.prizeWallet ? (
                          <span
                            className="truncated-wallet"
                            title={entry.prizeWallet}
                          >
                            {entry.prizeWallet.substring(0, 6)}...
                            {entry.prizeWallet.substring(
                              entry.prizeWallet.length - 4
                            )}
                          </span>
                        ) : (
                          "Not provided"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn primary-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

RaffleEntriesModal.propTypes = {
  entries: PropTypes.array,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
};

export default RaffleEntriesModal;
