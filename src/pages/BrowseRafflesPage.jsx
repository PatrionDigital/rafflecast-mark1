// src/pages/BrowseRafflesPage.jsx
import { useProfile } from "@farcaster/auth-kit";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import FrameMeta from "@/components/FrameMeta";
import RaffleCard from "@/components/RaffleCard";
import RaffleDetailsPanel from "@/components/RaffleDetailsPanel";
import { useRaffle } from "@/hooks/useRaffle";

const BrowseRafflesPage = () => {
  // Component state
  const [activeRaffles, setActiveRaffles] = useState([]);
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Farcaster Auth-kit Profile
  const { isAuthenticated } = useProfile();

  // Custom hooks
  const { getRafflesByPhase, getRaffleById } = useRaffle();

  const stableGetRafflesByPhase = useCallback(getRafflesByPhase, [
    getRafflesByPhase,
  ]);

  const stableGetRaffleById = useCallback(getRaffleById, [getRaffleById]);

  // Check for direct raffle linking via URL parameter
  useEffect(() => {
    const directRaffleId = searchParams.get("id");

    const loadDirectRaffle = async () => {
      if (directRaffleId) {
        try {
          const directRaffle = await stableGetRaffleById(directRaffleId);
          if (directRaffle) {
            setSelectedRaffle(directRaffle);
            setIsGridVisible(false);
          }
        } catch (error) {
          console.error("Error loading direct raffle:", error);
        }
      }
    };

    loadDirectRaffle();
  }, [searchParams, stableGetRaffleById]);

  // Load all active raffles
  useEffect(() => {
    const loadActiveRaffles = async () => {
      setLoading(true);
      try {
        const fetchedActiveRaffles = await stableGetRafflesByPhase("Active");
        const validRaffles = fetchedActiveRaffles.filter((raffle) =>
          raffle && raffle.phase ? true : false
        );
        setActiveRaffles(validRaffles);
      } catch (error) {
        console.error("Error loading raffles:", error);
      } finally {
        setLoading(false);
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
      {/* Add FrameMeta component */}
      <FrameMeta raffle={selectedRaffle} />

      <div className="section">
        <h2>Browse Raffles</h2>
        {!isAuthenticated && (
          <p className="auth-message">
            Please log in with Warpcast to join raffles.
          </p>
        )}

        {loading ? (
          <p>Loading raffles...</p>
        ) : (
          <>
            <div className={`raffle-grid ${isGridVisible ? "" : "hidden"}`}>
              {activeRaffles.length > 0 ? (
                activeRaffles.map((raffle) => (
                  <RaffleCard
                    key={raffle.id}
                    raffle={raffle}
                    onClick={() => handleRaffleClick(raffle)}
                  />
                ))
              ) : (
                <p>No active raffles found.</p>
              )}
            </div>

            {selectedRaffle && (
              <RaffleDetailsPanel
                raffle={selectedRaffle}
                onClose={handleCloseDetails}
                isInFrame={false}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseRafflesPage;
