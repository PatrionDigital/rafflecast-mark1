import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Styles
import "../styles/minimal-frame.css";

// Frame components
import FrameProvider from "../frames/components/FrameProvider";
import FrameMeta from "../frames/components/FrameMeta";
import { getFrameContext, signalReady } from "../frames/api";

// Raffle components
import RaffleDetailsPanel from "../components/RaffleDetailsPanel";

// Utils
import { fetchRaffleById } from "../utils/tursoUtils";

const FrameRafflePage = () => {
  const { raffleId } = useParams();
  const [raffle, setRaffle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [frameContext, setFrameContext] = useState(null);

  // Load raffle data directly from Turso
  useEffect(() => {
    const loadRaffle = async () => {
      setLoading(true);
      try {
        // Fetch raffle data directly
        const raffleData = await fetchRaffleById(raffleId);
        if (!raffleData) {
          throw new Error("Raffle not found");
        }
        setRaffle(raffleData);

        // Initialize frame context
        try {
          const context = await getFrameContext();
          setFrameContext(context);

          // Signal ready to hide splash screen
          signalReady().catch((err) =>
            console.warn("Error signaling ready:", err)
          );
        } catch (frameError) {
          console.warn("Not in a frame context:", frameError);
        }
      } catch (error) {
        console.error("Error loading raffle:", error);
        setError(error.message || "Failed to load raffle");
      } finally {
        setLoading(false);
      }
    };

    loadRaffle();
  }, [raffleId]);

  if (loading) {
    return (
      <div className="loading-container">Loading raffle information...</div>
    );
  }

  if (error || !raffle) {
    return <div className="error-container">{error || "Raffle not found"}</div>;
  }

  // For frame meta tags - use a placeholder image or raffle image if available
  const imageUrl =
    raffle.imageUrl || "https://rafflecast.example.com/placeholder.png";
  const frameUrl = `${window.location.origin}/frame/raffle/${raffleId}`;

  // Handle closing the raffle panel - this is a no-op in the frame context
  const handleClose = () => {
    window.history.back();
  };

  return (
    <FrameProvider>
      {/* Add frame meta tags */}
      <FrameMeta
        imageUrl={imageUrl}
        title={`Join "${raffle.title}" Raffle`}
        frameUrl={frameUrl}
      />

      <div className="frame-container">
        {/* Render RaffleDetailsPanel with the raffle data */}
        <RaffleDetailsPanel
          raffle={raffle}
          onClose={handleClose}
          isInFrame={true}
        />

        {/* Frame context info for debugging */}
        {import.meta.env.DEV && frameContext && (
          <div className="frame-debug">
            <p>
              Frame Context: User FID:{" "}
              {frameContext?.user?.fid || "Not available"}
            </p>
          </div>
        )}
      </div>
    </FrameProvider>
  );
};

export default FrameRafflePage;
