// src/components/RaffleSummary.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Badge, Button } from "@windmill/react-ui";
import {
  ClockIcon,
  TagIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const RaffleSummary = ({ raffleData, onEdit }) => {
  const [activeTab, setActiveTab] = useState("basic");

  const formatDateTime = (date, time) => {
    try {
      return new Date(`${date}T${time}`).toLocaleString();
    } catch (e) {
      console.log("Error formatting date:", e);
      return `${date} ${time}`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "basic"
              ? "border-b-2 border-cochineal-red text-cochineal-red"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("basic")}
        >
          Basic Info
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "timing"
              ? "border-b-2 border-cochineal-red text-cochineal-red"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("timing")}
        >
          Time Settings
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "ticket"
              ? "border-b-2 border-cochineal-red text-cochineal-red"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("ticket")}
        >
          Ticket & Prize
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "basic" && (
          <Card>
            <CardBody>
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold">Raffle Details</h4>
                <Button size="small" layout="outline" onClick={() => onEdit(1)}>
                  Edit
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-700">Title</h5>
                  <p className="mt-1">{raffleData.title}</p>
                </div>

                {raffleData.description && (
                  <div>
                    <h5 className="font-medium text-gray-700">Description</h5>
                    <p className="mt-1 whitespace-pre-line">
                      {raffleData.description}
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === "timing" && (
          <Card>
            <CardBody>
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold">Time Settings</h4>
                <Button size="small" layout="outline" onClick={() => onEdit(2)}>
                  Edit
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-blue-500" />
                  <div>
                    <h5 className="font-medium text-gray-700">Start Time</h5>
                    <p className="mt-1">Immediately upon creation</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-red-500" />
                  <div>
                    <h5 className="font-medium text-gray-700">End Time</h5>
                    <p className="mt-1">
                      {formatDateTime(
                        raffleData.closingDate,
                        raffleData.closingTime
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-green-500" />
                  <div>
                    <h5 className="font-medium text-gray-700">
                      Challenge Period Ends
                    </h5>
                    <p className="mt-1">
                      {new Date(
                        `${raffleData.challengePeriod}T23:59:59`
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === "ticket" && (
          <Card>
            <CardBody>
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold">Ticket & Prize</h4>
                <Button size="small" layout="outline" onClick={() => onEdit(3)}>
                  Edit
                </Button>
              </div>

              <div className="space-y-6">
                {/* Ticket Token */}
                {raffleData.ticketToken && (
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-700">Ticket Token</h5>
                    <div className="flex items-center">
                      <TagIcon className="w-5 h-5 mr-2 text-purple-500" />
                      <div>
                        <p>
                          {raffleData.ticketToken.name} (
                          {raffleData.ticketToken.symbol})
                        </p>
                        <p className="text-xs font-mono text-gray-500 mt-1">
                          {raffleData.ticketToken.contractAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Prize Distribution */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-700">
                    Prize Distribution
                  </h5>
                  <div className="flex items-center mb-2">
                    <CurrencyDollarIcon className="w-5 h-5 mr-2 text-green-500" />
                    <p>
                      ${raffleData.prize?.amount || 500}{" "}
                      {raffleData.prize?.currency || "USDC"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        1st (45%)
                      </Badge>
                      <span className="ml-2">${(500 * 0.45).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-gray-100 text-gray-800">
                        2nd (25%)
                      </Badge>
                      <span className="ml-2">
                        ${(500 * 0.125).toFixed(2)} × 2
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-orange-100 text-orange-800">
                        3rd (15%)
                      </Badge>
                      <span className="ml-2">
                        ${(500 * 0.075).toFixed(2)} × 2
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-blue-100 text-blue-800">
                        4th (10%)
                      </Badge>
                      <span className="ml-2">
                        ${(500 * 0.05).toFixed(2)} × 2
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-green-100 text-green-800">
                        5th (7.5%)
                      </Badge>
                      <span className="ml-2">
                        ${(500 * 0.025).toFixed(2)} × 3
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

RaffleSummary.propTypes = {
  raffleData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    closingDate: PropTypes.string.isRequired,
    closingTime: PropTypes.string.isRequired,
    challengePeriod: PropTypes.string.isRequired,
    ticketToken: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      symbol: PropTypes.string,
      contractAddress: PropTypes.string,
    }),
    prize: PropTypes.shape({
      amount: PropTypes.number,
      currency: PropTypes.string,
      winnerCount: PropTypes.number,
      distribution: PropTypes.object,
    }),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default RaffleSummary;
