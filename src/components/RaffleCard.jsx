// src/components/RaffleCard.jsx - Updated to use Windmill Card
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getCreatorUsername } from "../utils/farcasterUtils";
import { Badge, Button, Card, CardBody } from "@windmill/react-ui";

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
    <Card className="transition-all duration-200 transform hover:-translate-y-1">
      <div className="p-4 border-b border-opacity-20">
        <h3 className="text-lg font-semibold text-cochineal-red truncate">
          {raffle.title}
        </h3>
        <div className="flex items-center mt-1">
          <span className="text-xs text-cement">
            Created by {creatorUsername ? `@${creatorUsername}` : "Unknown"}
          </span>
        </div>
      </div>

      <CardBody>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-cement">Closes:</span>
          <span className="text-sm font-medium text-cement">
            {formatDate(raffle.closingDate)}
          </span>
        </div>

        <div className="mt-4">
          <Badge>{raffle.phase}</Badge>
        </div>
      </CardBody>

      <div className="p-4 border-t border-opacity-20">
        <Button className="w-full text-white" onClick={() => onClick(raffle)}>
          View Details
        </Button>
      </div>
    </Card>
  );
};

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

export default RaffleCard;
