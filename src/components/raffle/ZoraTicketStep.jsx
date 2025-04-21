// src/components/raffle/ZoraTicketStep.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Label,
  Input,
  Button,
  HelperText,
  Card,
  CardBody,
  Alert,
  Badge,
} from "@windmill/react-ui";
import {
  InformationCircleIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { createZoraCoin } from "../../utils/zoraUtils";

const ZoraTicketStep = ({
  raffleTitle,
  coinName,
  setCoinName,
  coinSymbol,
  setCoinSymbol,
  prizeAmount,
  setPrizeAmount,
  winnerCount,
  setWinnerCount,
  onCoinCreated,
  nextStep,
  prevStep,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [coinData, setCoinData] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize with defaults based on raffle title
  useEffect(() => {
    if (raffleTitle && !coinName) {
      setCoinName(`${raffleTitle} Ticket`);
      // Generate symbol from raffle title (up to 5 chars)
      const symbol = raffleTitle
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .substring(0, 5);
      setCoinSymbol(symbol || "RAFL");
    }
  }, [raffleTitle, coinName, setCoinName, setCoinSymbol]);

  const validateStep = () => {
    const newErrors = {};

    if (!coinName.trim()) {
      newErrors.coinName = "Ticket token name is required";
    }

    if (!coinSymbol.trim()) {
      newErrors.coinSymbol = "Ticket token symbol is required";
    } else if (!/^[A-Z0-9]{1,5}$/.test(coinSymbol)) {
      newErrors.coinSymbol = "Symbol must be 1-5 uppercase letters or numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCoin = async () => {
    if (!validateStep()) {
      return;
    }

    setIsCreating(true);
    setError(null);

    // Simulating token creation - real implementation in Phase 3
    setTimeout(() => {
      const mockCoin = {
        id: `zora-${Date.now()}`,
        name: coinName,
        symbol: coinSymbol,
        contracAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
        createdAt: new Date().toISOString(),
      };

      setCoinData(mockCoin);
      if (onCoinCreated) {
        onCoinCreated(mockCoin);
      }
      setIsCreating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">
        Step 3: Ticket Creation
      </h3>

      {/* Default Prize Info Card */}
      <Card className="bg-green-50 border-green-100">
        <CardBody>
          <div className="flex items-start">
            <CurrencyDollarIcon className="w-5 h-5 mt-1 mr-2 text-green-600" />
            <div>
              <h4 className="text-lg font-semibold text-green-800 mb-2">
                Default Prize Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-col-2 gap-2 mb-2">
                <div>
                  <span className="text-sm text-green-700 font-medium">
                    Prize Amount:
                  </span>
                  <span className="ml-2 text-green-700">
                    ${prizeAmount} USDC
                  </span>
                </div>
                <div>
                  <span className="text-sm text-green-700 font-medium">
                    Winners:
                  </span>
                  <span className="ml-2 text-green-700">{winnerCount}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-green-200 text-green-800">1st: 45%</Badge>
                <Badge className="bg-green-200 text-green-800">
                  2nd: 12.5% x 2
                </Badge>
                <Badge className="bg-green-200 text-green-800">
                  3rd: 7.5% x 2
                </Badge>
                <Badge className="bg-green-200 text-green-800">
                  4th 5% x 2
                </Badge>
                <Badge className="bg-green-200 text-green-800">
                  5th: 2.5% x 3
                </Badge>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h4 className="text-lg font-semibold mb-4">Create Ticket Token</h4>
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <InformationCircleIcon className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                Each raffle has its own token that participants will buy as
                tickets.
              </p>
            </div>

            <Label>
              <span>Token Name</span>
              <Input
                className="mt-1"
                placeholder="e.g., My Raffle Ticket"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
                disabled={isCreating || !!coinData}
              />
              {errors.coinName && (
                <HelperText valid={false}>{errors.coinName}</HelperText>
              )}
            </Label>

            <Label>
              <span>Token Symbol</span>
              <Input
                className="mt-1"
                placeholder="e.g., RAFL"
                value={coinSymbol}
                onChange={(e) => setCoinSymbol(e.target.value.toUpperCase())}
                maxLength={5}
                disabled={isCreating || !!coinData}
              />
              {errors.coinSymbol && (
                <HelperText valid={false}>{errors.coinSymbol}</HelperText>
              )}
            </Label>

            {error && <Alert type="danger">{error}</Alert>}

            {coinData && (
              <Alert type="success">
                <div className="flex flex-col space-y-2">
                  <p className="font-semibold">Token created successfully!</p>
                  <p className="text-sm">
                    Token: {coinData.name} ({coinData.symbol})
                  </p>
                  <p className="text-sm font-mono text-xs">
                    Address: {coinData.contracAddress}
                  </p>
                </div>
              </Alert>
            )}
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-between">
        <Button onClick={prevStep} layout="outline" disabled={isCreating}>
          Previous
        </Button>
        {!coinData ? (
          <Button onClick={handleCreateCoin} disabled={isCreating}>
            {isCreating
              ? "Creating Token..."
              : "Create Ticket Token & Continue"}
          </Button>
        ) : (
          <Button onClick={nextStep}>Continue to Review</Button>
        )}
      </div>
    </div>
  );
};

ZoraTicketStep.propTypes = {
  raffleTitle: PropTypes.string.isRequired,
  coinName: PropTypes.string.isRequired,
  setCoinName: PropTypes.func.isRequired,
  coinSymbol: PropTypes.string.isRequired,
  setCoinSymbol: PropTypes.func.isRequired,
  onCoinCreated: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
};

export default ZoraTicketStep;
