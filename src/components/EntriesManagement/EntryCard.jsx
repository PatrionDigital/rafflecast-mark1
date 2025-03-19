// src/components/EntriesManagement/EntryCard.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRaffle } from "../../hooks/useRaffle";

const EntryCard = ({ entry, onClick = () => {} }) => {
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

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Determine status class for color coding
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

  return (
    <div className="entry-card" onClick={onClick}>
      <h3>{raffleTitle}</h3>

      <div className="entry-details">
        <p data-label="Entered:">
          <span>{formatDate(entry.enteredAt)}</span>
        </p>

        <p data-label="Status:">
          <span className={`status-badge ${getStatusClass(entry.status)}`}>
            {entry.status || "Unknown"}
          </span>
        </p>

        {entry.ticketCount && (
          <p data-label="Tickets:">
            <span>{entry.ticketCount}</span>
          </p>
        )}

        {entry.prizeWallet && (
          <p data-label="Prize Wallet:">
            <span className="prize-wallet">
              {entry.prizeWallet.substring(0, 6)}...
              {entry.prizeWallet.substring(entry.prizeWallet.length - 4)}
            </span>
          </p>
        )}
      </div>

      <div className="card-footer">
        <button className="details-button">View Details</button>
      </div>
    </div>
  );
};

EntryCard.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    raffleId: PropTypes.string.isRequired,
    enteredAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    status: PropTypes.string,
    ticketCount: PropTypes.number,
    prizeWallet: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

export default EntryCard;
