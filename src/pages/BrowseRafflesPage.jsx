// React and Farcaster imports
import { useProfile } from "@farcaster/auth-kit";
import { useEffect, useState, useCallback } from "react";

import RaffleCard from "@/components/RaffleCard";
import RaffleDetailsPanel from "@/components/RaffleDetailsPanel";
import { useRaffle } from "@/hooks/useRaffle";

const BrowseRafflesPage = () => {
  // Component state
  const [activeRaffles, setActiveRaffles] = useState([]);
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [isGridVisible, setIsGridVisible] = useState(true);

  // Farcast Auth-kit Profile
  const { isAuthenticated } = useProfile();

  // Custom hooks
  const { getRafflesByPhase } = useRaffle();

  const stableGetRafflesByPhase = useCallback(getRafflesByPhase, [
    getRafflesByPhase,
  ]);

  useEffect(() => {
    const loadActiveRaffles = async () => {
      try {
        const fetchedActiveRaffles = await stableGetRafflesByPhase("Active");
        const validRaffles = fetchedActiveRaffles.filter((raffle) =>
          raffle && raffle.phase ? true : false
        );
        setActiveRaffles(validRaffles);
      } catch (error) {
        console.error("Error loading raffles:", error);
        // You can set an error state here if needed
      }
    };
    loadActiveRaffles();
  }, [stableGetRafflesByPhase]);

  const handleRaffleClick = (raffle) => {
    setSelectedRaffle(raffle);
    setIsGridVisible(false);
  };

  const handleCloseDetails = () => {
    setSelectedRaffle(null);
    setIsGridVisible(true);
  };

  return (
    <div className={`page-container ${isAuthenticated ? "logged-in" : ""}`}>
      <div className="section">
        <h2>Browse Raffles</h2>
        {!isAuthenticated && (
          <p className="auth-message">
            Please log in with Warpcast to join raffles.
          </p>
        )}
        <div className={`raffle-grid ${isGridVisible ? "" : "hidden"}`}>
          {activeRaffles.map((raffle) => (
            <RaffleCard
              key={raffle.id}
              raffle={raffle}
              onClick={() => handleRaffleClick(raffle)}
            />
          ))}
        </div>
        {selectedRaffle && (
          <RaffleDetailsPanel
            raffle={selectedRaffle}
            onClose={handleCloseDetails}
          />
        )}
      </div>
    </div>
  );
};

export default BrowseRafflesPage;
