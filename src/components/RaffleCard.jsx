import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getCreatorUsername } from "../utils/farcasterUtils";

const RaffleCard = ({ raffle, onClick }) => {
  const [creatorUsername, setCreatorUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const username = await getCreatorUsername(raffle.creator);
        if (username) {
          setCreatorUsername(username);
        } else {
          setError("Creator not found");
        }
      } catch (err) {
        console.error("Error fetching creator:", err);
        setError("Error loading creator info");
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [raffle.creator]);

  return (
    <div className="raffle-card" onClick={onClick}>
      <h3>{raffle.title}</h3>
      <p>
        Created by:{" "}
        {loading ? (
          "Loading..."
        ) : error ? (
          "Unknown"
        ) : (
          <a
            href={`https://warpcast.com/${creatorUsername}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{creatorUsername}
          </a>
        )}
      </p>
      <p>Closes: {formatDate(raffle.closingDate)}</p>
    </div>
  );
};

export default RaffleCard;

RaffleCard.propTypes = {
  raffle: PropTypes.shape({
    title: PropTypes.string.isRequired,
    creator: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    closingDate: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
