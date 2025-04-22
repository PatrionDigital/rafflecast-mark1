import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getCreatorUsername } from "../utils/farcasterUtils";
import { Badge, Button } from "@windmill/react-ui";

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
    // Update to src/components/RaffleCard.jsx (only the styles, keep functionality)
    // Note: We're not rewriting the entire component, just changing the styling

    // Example of styling updates to apply:
    <div className="raffle-card hover:shadow-lg transition-all duration-200 bg-white rounded-md overflow-hidden border border-gray-200">
      <div className="raffle-card-header p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-cochineal-red">
          {raffle.title}
        </h3>
        <div className="flex items-center mt-1">
          <span className="text-xs text-cement">
            Created by {creatorUsername ? `@${creatorUsername}` : "Unknown"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-asphalt">Closes:</span>
          <span className="text-sm font-medium">
            {formatDate(raffle.closingDate)}
          </span>
        </div>

        <div className="mt-4">
          <Badge
            className={`${
              raffle.phase === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {raffle.phase}
          </Badge>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          className="w-full bg-cochineal-red hover:bg-enamel-red text-white"
          onClick={() => onClick(raffle)}
        >
          View Details
        </Button>
      </div>
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
