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
  const [frameReady, setFrameReady] = useState(false);

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

          // Short delay before signaling ready to ensure splash screen is visible
          setTimeout(() => {
            // Signal ready to hide splash screen
            signalReady().catch((err) =>
              console.warn("Error signaling ready:", err)
            );
            setFrameReady(true);
          }, 1500);
        } catch (frameError) {
          console.warn("Not in a frame context:", frameError);
          // Still set frame ready if not in a frame context
          setFrameReady(true);
        }
      } catch (error) {
        console.error("Error loading raffle:", error);
        setError(error.message || "Failed to load raffle");
        setFrameReady(true); // Set ready even on error to show error message
      } finally {
        setLoading(false);
      }
    };

    loadRaffle();
  }, [raffleId]);

  // For frame meta tags - use the Rafflecast logo
  const logoUrl = "/images/RafflecastLogo.png";
  const frameUrl = `${window.location.origin}/frame/raffle/${raffleId}`;

  // Handle closing the raffle panel - this is a no-op in the frame context
  const handleClose = () => {
    window.history.back();
  };

  return (
    <FrameProvider>
      {/* Add frame meta tags */}
      <FrameMeta
        imageUrl={logoUrl}
        title={raffle ? `Join "${raffle.title}" Raffle` : "Rafflecast"}
        frameUrl={frameUrl}
      />

      <div
        className={`frame-container ${!frameReady ? "loading-frame" : ""}`}
        style={{
          backgroundColor: !frameReady ? "#820b8a" : "white",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: !frameReady ? "center" : "flex-start",
          alignItems: "center",
          transition: "background-color 0.5s ease",
        }}
      >
        {/* Splash Screen */}
        {!frameReady && (
          <div className="splash-screen">
            <img
              src={logoUrl}
              alt="Rafflecast Logo"
              style={{
                maxWidth: "200px",
                margin: "0 auto",
                display: "block",
              }}
            />
            <div
              style={{
                color: "white",
                textAlign: "center",
                marginTop: "20px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Loading Raffle...
            </div>
          </div>
        )}

        {/* Main Content - Only shown when frame is ready */}
        {frameReady && (
          <>
            {loading ? (
              <div className="loading-container">
                Loading raffle information...
              </div>
            ) : error || !raffle ? (
              <div className="error-container">
                {error || "Raffle not found"}
              </div>
            ) : (
              /* Render RaffleDetailsPanel with the raffle data */
              <RaffleDetailsPanel
                raffle={raffle}
                onClose={handleClose}
                isInFrame={true}
              />
            )}

            {/* Frame context info for debugging */}
            {import.meta.env.DEV && frameContext && (
              <div className="frame-debug">
                <p>
                  Frame Context: User FID:{" "}
                  {frameContext?.user?.fid || "Not available"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </FrameProvider>
  );
};

export default FrameRafflePage;
