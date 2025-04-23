// src/components/RaffleCard.jsx - Refactored with Tailwind
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

  // Badge class based on raffle phase
  const getBadgeClass = () => {
    if (raffle.phase === "Active") {
      return "bg-green-100 text-green-800";
    } else if (raffle.phase === "Settled") {
      return "bg-blue-100 text-blue-800";
    } else if (raffle.phase === "Finalized") {
      return "bg-purple-100 text-purple-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-cochineal-red truncate">
          {raffle.title}
        </h3>
        <div className="flex items-center mt-1">
          <span className="text-xs text-gray-500">
            Created by {creatorUsername ? `@${creatorUsername}` : "Unknown"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Closes:</span>
          <span className="text-sm font-medium">
            {formatDate(raffle.closingDate)}
          </span>
        </div>

        <div className="mt-4">
          <Badge>{raffle.phase}</Badge>
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
    phase: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
