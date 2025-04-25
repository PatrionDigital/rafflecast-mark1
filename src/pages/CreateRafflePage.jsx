// src/pages/CreateRafflePage.jsx
import { useState, useEffect } from "react";
//import { useProfile } from "@farcaster/auth-kit";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Card, CardBody, Alert } from "@windmill/react-ui";

// Step Components
import BasicInfoStep from "@/components/raffle/BasicInfoStep";
import TimeSettingsStep from "@/components/raffle/TimeSettingsStep";
import ZoraTicketStep from "@/components/raffle/ZoraTicketStep";
import ReviewStep from "@/components/raffle/ReviewStep";

// Hooks and Utils
import { useRaffle } from "@/hooks/useRaffle";
import { generatePrizeDistribution } from "@/utils/zoraUtils";

const CreateRafflePage = () => {
  const navigate = useNavigate();
  //const { isAuthenticated, profile } = useProfile();
  const { isAuthenticated, profile } = useAuth(); // Default Auth account for local testing.
  const { addRaffle } = useRaffle();

  // Multi-step form state
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Raffle data state
  const [raffleTitle, setRaffleTitle] = useState("");
  const [description, setDescription] = useState("");

  // Time settings state
  const [closingDate, setClosingDate] = useState(() => {
    const oneWeekFromToday = new Date();
    oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7);
    return oneWeekFromToday.toISOString().split("T")[0];
  });
  const [closingTime, setClosingTime] = useState("12:00");
  const [challengePeriod, setChallengePeriod] = useState(() => {
    const twoWeeksFromToday = new Date();
    twoWeeksFromToday.setDate(twoWeeksFromToday.getDate() + 14);
    return twoWeeksFromToday.toISOString().split("T")[0];
  });

  // Prize settings state - defaults
  const [prizeAmount, setPrizeAmount] = useState(500);
  const [prizeCurrency, setPrizeCurrency] = useState("USDC");
  const [winnerCount, setWinnerCount] = useState(10);

  // Ticket token state
  const [coinName, setCoinName] = useState("");
  const [coinSymbol, setCoinSymbol] = useState("");
  const [ticketToken, setTicketToken] = useState(null);

  // Set default coin name/symbol based on raffle title
  useEffect(() => {
    if (raffleTitle && !coinName) {
      setCoinName(`${raffleTitle} Ticket`);
      const symbol = raffleTitle
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .substring(0, 5);
      setCoinSymbol(symbol || "RAFL");
    }
  }, [raffleTitle, coinName]);

  // Form navigation functions
  const nextStep = () => {
    setFormStep(Math.min(formStep + 1, 4));
  };

  const prevStep = () => {
    setFormStep(Math.max(formStep - 1, 1));
  };

  const goToStep = (step) => {
    setFormStep(step);
  };

  // Handle token creation
  const handleCoinCreated = (coin) => {
    setTicketToken(coin);
  };

  // Create raffle handler
  const handleCreateRaffle = async () => {
    if (!isAuthenticated) {
      setStatusMessage({
        type: "error",
        text: "Please sign in with Warpcast to create a raffle",
      });
      return;
    }

    // Validation
    if (!ticketToken) {
      setStatusMessage({
        type: "error",
        text: "Please create a ticket token before submitting",
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ type: "", text: "" });

    try {
      // Creat raffle ID upfront so we can reference it after creation
      const raffleId = uuidv4();

      const raffleData = {
        id: raffleId,
        creator: profile.fid,
        title: raffleTitle,
        description,
        startDate: new Date().toISOString().split("T")[0],
        startTime: new Date().toISOString().split("T")[1].split(".")[0],
        closingDate,
        closingTime,
        challengePeriod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        phase: "Active",
        // Ensure ticketToken is always stringified and includes contractAddress
        ticketToken: JSON.stringify({
          id: ticketToken.id,
          name: ticketToken.name,
          symbol: ticketToken.symbol,
          contractAddress: ticketToken.contractAddress || ticketToken.address || "",
        }),
        // Ensure prize is stringified and distribution is an array (for UI parsing)
        prize: JSON.stringify({
          amount: prizeAmount,
          currency: prizeCurrency,
          winnerCount: winnerCount,
          distribution: Array.isArray(generatePrizeDistribution(prizeAmount, winnerCount))
            ? generatePrizeDistribution(prizeAmount, winnerCount)
            : Object.values(generatePrizeDistribution(prizeAmount, winnerCount)),
        }),
      };

      console.log("raffleData:", raffleData);

      // Add the raffle to the database
      await addRaffle(raffleData);

      console.log("Raffle created successfully with ID:", raffleId);

      setStatusMessage({
        type: "success",
        text: "Raffle created successfully!",
      });

      // Navigate to the success page with the raffle ID
      navigate(`/creator/success/${raffleId}`);
    } catch (error) {
      console.error("Error creating raffle:", error);
      setStatusMessage({
        type: "error",
        text: error.message || "Failed to create raffle",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine all raffle data for review step
  const raffleData = {
    title: raffleTitle,
    description,
    closingDate,
    closingTime,
    challengePeriod,
    ticketToken,
    prize: {
      amount: prizeAmount,
      currency: prizeCurrency,
      winnerCount: winnerCount,
      distribution: generatePrizeDistribution(prizeAmount, winnerCount),
    },
  };

  // Render different content based on authentication status
  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardBody className="text-center p-8">
            <h2 className="text-2xl font-bold text-cochineal-red mb-4">
              Authentication Required
            </h2>
            <p className="mb-6">
              Please sign in with Warpcast to create a new raffle.
            </p>
            {/* Authentication button would go here */}
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardBody>
          <h2 className="text-2xl font-bold text-cochineal-red mb-6">
            Create a New Raffle
          </h2>

          {/* Status Message */}
          {statusMessage.text && (
            <Alert
              type={
                statusMessage.type === "error" ? "danger" : statusMessage.type
              }
              className="mb-4"
            >
              {statusMessage.text}
            </Alert>
          )}

          <div className="flex items-center mb-8 w-full">
            {["Basic Info", "Time Settings", "Ticket Creation", "Review"].map(
              (step, index) => (
                <div key={index} className="relative flex items-center w-full">
                  {/* Step Circle */}
                  <div
                    className={`
          flex items-center justify-center w-10 h-10 rounded-full 
          text-sm font-medium border-2 z-10 shrink-0
          ${
            formStep > index + 1
              ? "bg-green-500 text-white border-green-500"
              : formStep === index + 1
              ? "bg-cochineal-red text-white border-cochineal-red"
              : "bg-white text-gray-500 border-gray-300"
          }
        `}
                  >
                    {formStep > index + 1 ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Connector */}
                  {index < 3 && (
                    <div
                      className={`flex-1 h-1 ${
                        index < formStep - 1 ? "bg-green-500" : "bg-gray-200"
                      }`}
                    ></div>
                  )}

                  {/* Step Label */}
                  <span
                    className={`
          absolute left-1/2 transform -translate-x-1/2 mt-14 text-xs font-medium
          ${formStep === index + 1 ? "text-cochineal-red" : "text-gray-500"}
        `}
                  >
                    {step}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Step Content */}
          <div className="mt-12">
            {formStep === 1 && (
              <BasicInfoStep
                raffleTitle={raffleTitle}
                setRaffleTitle={setRaffleTitle}
                description={description}
                setDescription={setDescription}
                nextStep={nextStep}
              />
            )}

            {formStep === 2 && (
              <TimeSettingsStep
                closingDate={closingDate}
                setClosingDate={setClosingDate}
                closingTime={closingTime}
                setClosingTime={setClosingTime}
                challengePeriod={challengePeriod}
                setChallengePeriod={setChallengePeriod}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}

            {formStep === 3 && (
              <ZoraTicketStep
                raffleTitle={raffleTitle}
                coinName={coinName}
                setCoinName={setCoinName}
                coinSymbol={coinSymbol}
                setCoinSymbol={setCoinSymbol}
                prizeAmount={prizeAmount}
                setPrizeAmount={setPrizeAmount}
                winnerCount={winnerCount}
                setWinnerCount={setWinnerCount}
                onCoinCreated={handleCoinCreated}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}

            {formStep === 4 && (
              <ReviewStep
                raffleData={raffleData}
                onEdit={goToStep}
                onSubmit={handleCreateRaffle}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateRafflePage;
