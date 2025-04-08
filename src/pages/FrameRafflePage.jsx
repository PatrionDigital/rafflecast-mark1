// FrameRafflePage.jsx - Warpcast-focused version
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRaffle } from "@/hooks/useRaffle";

const FrameRafflePage = () => {
  const { raffleId } = useParams();
  const { getRaffleById } = useRaffle();
  const [raffle, setRaffle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Rafflecast Mini App";

    const fetchRaffle = async () => {
      try {
        const fetchedRaffle = await getRaffleById(raffleId);

        if (!fetchedRaffle) {
          throw new Error("Raffle not found");
        }

        setRaffle(fetchedRaffle);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching raffle:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRaffle();

    // Signal ready to Warpcast
    const signalReady = async () => {
      try {
        const frameSDK = await import("@farcaster/frame-sdk")
          .then((mod) => mod.default)
          .catch(() => null);

        if (frameSDK && frameSDK.actions && frameSDK.actions.ready) {
          console.log("Signaling ready to Warpcast");
          await frameSDK.actions.ready();
        }
      } catch (error) {
        console.warn("Error signaling ready:", error);
      }
    };

    // Delay slightly to ensure meta tags are processed
    setTimeout(signalReady, 500);
  }, [raffleId, getRaffleById]);

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#820b8a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <div>
          <h1>Rafflecast</h1>
          <p>Loading Raffle...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#820b8a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <div>
          <h1>Rafflecast</h1>
          <p>Error: {error}</p>
          <p>Raffle not found or could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Successful load - display basic raffle info
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#820b8a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
        <h1>Rafflecast</h1>
        <p>Raffle: {raffle.title}</p>
        <p>Closes: {new Date(raffle.closingDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default FrameRafflePage;
