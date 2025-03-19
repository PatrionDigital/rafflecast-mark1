// src/components/EntriesManagement/EntryDetailModal.jsx
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useRaffle } from "../../hooks/useRaffle";
import { createPortal } from "react-dom";

const EntryDetailModal = ({ entry, onClose = () => {} }) => {
  const modalRef = useRef(null);
  const { getRaffleById } = useRaffle();
  const [raffleTitle, setRaffleTitle] = useState("");

  // Fetch the raffle title when the component mounts
  useEffect(() => {
    if (entry.raffleId) {
      const raffle = getRaffleById(entry.raffleId);
      if (raffle && raffle.title) {
        setRaffleTitle(raffle.title);
      } else {
        setRaffleTitle(`Raffle #${entry.raffleId}`); // Fallback if title not found
      }
    }
  }, [entry.raffleId, getRaffleById]);

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

    // Prevent body scrolling
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get status class for color-coding
  const getStatusClass = (status) => {
    if (!status) return "status-unknown";

    status = status.toLowerCase();
    if (status.includes("active") || status.includes("open"))
      return "status-active";
    if (status.includes("win") || status.includes("success"))
      return "status-success";
    if (status.includes("closed") || status.includes("ended"))
      return "status-closed";
    return "status-unknown";
  };

  // Format wallet address with ellipsis
  const formatWallet = (address) => {
    if (!address) return "Not provided";
    return `${address.substring(0, 8)}...${address.substring(
      address.length - 6
    )}`;
  };

  // Use createPortal to render the modal outside of the normal DOM hierarchy
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2>Entry Details</h2>

        <div className="entry-details">
          <table>
            <tbody>
              <tr>
                <td>Raffle</td>
                <td>{raffleTitle}</td>
              </tr>
              <tr>
                <td>Entry ID</td>
                <td>
                  <code>{entry.id}</code>
                </td>
              </tr>
              <tr>
                <td>Entered At</td>
                <td>{formatDate(entry.enteredAt)}</td>
              </tr>
              <tr>
                <td>Participant FID</td>
                <td>{entry.participant?.toString() || "N/A"}</td>
              </tr>
              {entry.status && (
                <tr>
                  <td>Status</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(entry.status)}`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              )}
              {entry.ticketCount && (
                <tr>
                  <td>Ticket Count</td>
                  <td>{entry.ticketCount}</td>
                </tr>
              )}
              {entry.prizeWallet && (
                <tr>
                  <td>Prize Wallet</td>
                  <td>
                    <code className="wallet-address">{entry.prizeWallet}</code>
                    <div className="address-short">
                      {formatWallet(entry.prizeWallet)}
                    </div>
                  </td>
                </tr>
              )}
              {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                <tr>
                  <td>Additional Info</td>
                  <td>
                    <pre className="metadata-display">
                      {JSON.stringify(entry.metadata, null, 2)}
                    </pre>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="action-buttons">
          <button onClick={onClose}>Close</button>
          {/* Example of additional action button: */}
          {entry.status && entry.status.toLowerCase() === "active" && (
            <button className="secondary-action">See Raffle</button>
          )}
        </div>
      </div>
    </div>,
    document.body // Mount the modal at the document body level
  );
};

EntryDetailModal.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    raffleId: PropTypes.string.isRequired,
    enteredAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    participant: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    ticketCount: PropTypes.number,
    prizeWallet: PropTypes.string,
    metadata: PropTypes.object,
  }).isRequired,
  onClose: PropTypes.func,
};

export default EntryDetailModal;
