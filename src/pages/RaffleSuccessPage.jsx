// src/pages/RaffleSuccessPage.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardBody, Badge, Button, Alert } from "@windmill/react-ui";
import {
  CheckCircleIcon,
  ClockIcon,
  TagIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useRaffle } from "@/hooks/useRaffle";

const RaffleSuccessPage = () => {
  const { raffleId } = useParams();
  const { getRaffleById } = useRaffle();
  const [raffle, setRaffle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRaffle = async () => {
      if (!raffleId) {
        setError("No raffle ID provided");
        setLoading(false);
        return;
      }

      try {
        const fetchedRaffle = await getRaffleById(raffleId);
        if (!fetchedRaffle) {
          setError("Raffle not found");
          setLoading(false);
          return;
        }

        // Parse JSON fields if they're strings
        if (typeof fetchedRaffle.ticketToken === "string") {
          try {
            fetchedRaffle.ticketToken = JSON.parse(fetchedRaffle.ticketToken);
          } catch (e) {
            console.error("Error parsing ticketToken:", e);
          }
        }

        if (typeof fetchedRaffle.prize === "string") {
          try {
            fetchedRaffle.prize = JSON.parse(fetchedRaffle.prize);
          } catch (e) {
            console.error("Error parsing prize:", e);
          }
        }

        setRaffle(fetchedRaffle);
      } catch (err) {
        console.error("Error loading raffle:", err);
        setError("Failed to load raffle details");
      } finally {
        setLoading(false);
      }
    };

    loadRaffle();
  }, [raffleId, getRaffleById]);

  // Format date helper
  const formatDate = (dateString, timeString) => {
    try {
      return new Date(
        `${dateString}T${timeString || "00:00:00"}`
      ).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="container px-6 mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cochineal-red mx-auto mb-4"></div>
            <p className="text-gray-600">Loading raffle details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !raffle) {
    return (
      <div className="container px-6 mx-auto">
        <Card className="max-w-lg mx-auto my-8">
          <CardBody>
            <Alert type="danger">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error || "Raffle not found"}
                  </h3>
                  <div className="mt-2 text-sm text-enamel-red">
                    <p>
                      We couldn&apos;t load the raffle details. Please try again
                      later.
                    </p>
                  </div>
                </div>
              </div>
            </Alert>
            <div className="flex justify-center mt-6">
              <Link to="/creator/manage">
                <Button>Back to Raffles</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Calculate prize distribution if available
  const firstPlacePrize = raffle.prize?.amount
    ? (raffle.prize.amount * 0.45).toFixed(2)
    : "225.00";
  const secondPlacePrize = raffle.prize?.amount
    ? (raffle.prize.amount * 0.125).toFixed(2)
    : "62.50";

  return (
    <div className="container px-6 mx-auto">
      <Card className="max-w-2xl mx-auto my-8">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mr-2" />
              <h2 className="text-2xl font-semibold text-cement">
                Raffle Created Successfully!
              </h2>
            </div>
            <Badge type="success" className="text-sm px-3">
              Success
            </Badge>
          </div>

          <Alert type="success" className="mb-6">
            Your raffle has been created and is now active! Share it with others
            to get participants.
          </Alert>

          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-cement mb-3">
                Raffle Title: {raffle.title}
              </h3>
              {raffle.description && (
                <p className="text-pastel-rose mb-4">{raffle.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dates Section */}
              <Card className="col-span-1">
                <CardBody className="p-4">
                  <h4 className="font-medium text-dark-rose mb-3 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-1 text-blue-500" />
                    Timing
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-cement">Start:</span>
                      <span className="font-medium text-pastel-rose">
                        {formatDate(raffle.startDate, raffle.startTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cement">Ends:</span>
                      <span className="font-medium text-pastel-rose">
                        {formatDate(raffle.closingDate, raffle.closingTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cement">Challenge Period:</span>
                      <span className="font-medium text-pastel-rose">
                        {formatDate(raffle.challengePeriod)}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Ticket Token Section */}
              <Card className="col-span-1">
                <CardBody className="p-4">
                  <h4 className="font-medium text-dark-rose mb-3 flex items-center">
                    <TagIcon className="h-5 w-5 mr-1 text-purple-500" />
                    Raffle Tickets
                  </h4>
                  {raffle.ticketToken ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-cement">Token:</span>
                        <span className="font-medium text-pastel-rose">
                          {raffle.ticketToken.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cement">Symbol:</span>
                        <span className="font-medium text-pastel-rose">
                          {raffle.ticketToken.symbol}
                        </span>
                      </div>
                      <div>
                        <span className="text-cement">Contract:</span>
                        <div className="font-mono text-xs bg-asphalt p-1 rounded mt-1 overflow-x-auto">
                          {raffle.ticketToken.contractAddress}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-enamel-red text-sm italic">
                      No ticket token information available
                    </p>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Prize Distribution Section */}
            <Card>
              <CardBody className="p-4">
                <h4 className="font-medium text-dark-rose mb-3 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-1 text-green-500" />
                  Prize Distribution
                </h4>
                <div className="flex justify-between mb-3">
                  <span className="text-cement">Total Prize Pool:</span>
                  <span className="font-medium text-pastel-rose">
                    ${raffle.prize?.amount || 500}{" "}
                    {raffle.prize?.currency || "USDC"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-pastel-rose text-sm">
                  <div className="flex items-center">
                    <Badge className="bg-yellow-100 text-yellow-800 mr-2">
                      1st
                    </Badge>
                    <span>${firstPlacePrize} (45%)</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-gray-100 text-gray-800 mr-2">
                      2nd
                    </Badge>
                    <span>${secondPlacePrize} × 2 (25%)</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-orange-100 text-orange-800 mr-2">
                      3rd
                    </Badge>
                    <span>
                      $
                      {raffle.prize?.amount
                        ? (raffle.prize.amount * 0.075).toFixed(2)
                        : "37.50"}{" "}
                      × 2 (15%)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-blue-100 text-blue-800 mr-2">
                      4th
                    </Badge>
                    <span>
                      $
                      {raffle.prize?.amount
                        ? (raffle.prize.amount * 0.05).toFixed(2)
                        : "25.00"}{" "}
                      × 2 (10%)
                    </span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <Badge className="bg-green-100 text-green-800 mr-2">
                      5th
                    </Badge>
                    <span>
                      $
                      {raffle.prize?.amount
                        ? (raffle.prize.amount * 0.025).toFixed(2)
                        : "12.50"}{" "}
                      × 3 (7.5%)
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link to="/creator/manage" className="flex-1">
              <Button className="w-full">Manage Your Raffles</Button>
            </Link>
            <Link to="/creator/new" className="flex-1">
              <Button layout="outline" className="w-full">
                Create Another Raffle
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default RaffleSuccessPage;
