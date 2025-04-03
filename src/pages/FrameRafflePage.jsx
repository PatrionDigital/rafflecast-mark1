// FrameRafflePage.jsx - Warpcast-focused version
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const FrameRafflePage = () => {
  const { raffleId } = useParams();

  useEffect(() => {
    document.title = "Rafflecast Mini App";

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
  }, [raffleId]);

  // The most minimal content possible - just a container with branding color
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
      <div style={{ color: "white", textAlign: "center" }}>
        <h1>Rafflecast</h1>
        <p>Raffle #{raffleId}</p>
      </div>
    </div>
  );
};

export default FrameRafflePage;
