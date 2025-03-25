import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRaffle } from "../hooks/useRaffle";
import FrameMeta from "../frames/components/FrameMeta";

/**
 * A simple page to test frame validation
 * This renders just the minimal frame metadata needed for validation
 */
const FrameValidatorPage = () => {
  const { raffleId } = useParams();
  const { getRaffleById } = useRaffle();
  const [raffle, setRaffle] = useState(null);
  const [error, setError] = useState(null);
  const [frameUrl, setFrameUrl] = useState("");

  useEffect(() => {
    try {
      if (raffleId) {
        const raffleData = getRaffleById(raffleId);
        if (raffleData) {
          setRaffle(raffleData);

          // Generate frame URL
          const baseUrl = window.location.origin;
          setFrameUrl(`${baseUrl}/frame/raffle/${raffleId}`);
        } else {
          setError("Raffle not found");
        }
      }
    } catch (err) {
      console.error("Error loading raffle:", err);
      setError(err.message || "Error loading raffle");
    }
  }, [raffleId, getRaffleById]);

  // Use a placeholder image URL
  const placeholderImage =
    "https://placehold.co/600x400/820b8a/FFFFFF/png?text=RaffleCast";

  return (
    <div
      className="frame-validator"
      style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
    >
      {/* Only render FrameMeta if we have the necessary data */}
      {raffle && frameUrl && (
        <FrameMeta
          imageUrl={placeholderImage}
          title={`Join "${raffle.title}" Raffle`}
          frameUrl={frameUrl}
        />
      )}

      {raffle ? (
        <>
          <h1 style={{ color: "#820b8a" }}>Frame Validator Test</h1>
          <p>This page contains the minimal frame metadata for validation.</p>
          <p>
            <strong>Raffle:</strong> {raffle.title}
          </p>

          <div
            style={{
              margin: "20px 0",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <h2 style={{ color: "#820b8a", fontSize: "18px" }}>Frame Image</h2>
            <img
              src={placeholderImage}
              alt="Frame Preview"
              style={{
                maxWidth: "100%",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>

          <div
            style={{
              margin: "20px 0",
              background: "#f5f5f5",
              padding: "20px",
              borderRadius: "4px",
            }}
          >
            <h2 style={{ color: "#820b8a", fontSize: "18px" }}>
              Frame Meta Tags
            </h2>
            <pre
              style={{
                background: "#eee",
                padding: "10px",
                overflowX: "auto",
                fontSize: "14px",
              }}
            >
              {`<meta name="fc:frame" content="vNext" />
<meta name="fc:frame:image" content="${placeholderImage}" />
<meta name="fc:frame:button:1" content="Join "${raffle.title}" Raffle" />
<meta name="fc:frame:button:1:action" content="post" />
<meta name="fc:frame:post_url" content="${frameUrl}" />`}
            </pre>
          </div>

          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <a
              href="/debug/frames"
              style={{
                padding: "10px 20px",
                background: "#820b8a",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                display: "inline-block",
              }}
            >
              Return to Debug Tool
            </a>
          </div>
        </>
      ) : (
        <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
          {error ? (
            <>
              <h1>Error</h1>
              <p>{error}</p>
            </>
          ) : (
            <p>Loading raffle information...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FrameValidatorPage;
