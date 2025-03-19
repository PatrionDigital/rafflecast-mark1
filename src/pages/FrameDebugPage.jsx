import { useState, useEffect } from "react";
import { useRaffle } from "../hooks/useRaffle";
import { generateBase64FrameImage } from "../frames/utils/base64FrameImage";
import "../styles/frame-debug.css";

const FrameDebugPage = () => {
  const { raffles } = useRaffle();
  const [selectedRaffleId, setSelectedRaffleId] = useState("");
  const [frameUrl, setFrameUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [metaContent, setMetaContent] = useState("");
  const [copied, setCopied] = useState({ url: false, meta: false });
  const [selectedRaffle, setSelectedRaffle] = useState(null);

  useEffect(() => {
    if (!selectedRaffleId || !raffles || raffles.length === 0) return;

    const raffle = raffles.find((r) => r.id === selectedRaffleId);
    if (!raffle) return;

    setSelectedRaffle(raffle);

    // Generate frame URL
    const baseUrl = window.location.origin;
    const frameUrlValue = `${baseUrl}/frame/raffle/${selectedRaffleId}`;
    setFrameUrl(frameUrlValue);

    // Generate image URL
    const imageUrlValue = generateBase64FrameImage(raffle);
    setImageUrl(imageUrlValue);

    // Full meta content for copying
    const fullFrameContent = {
      version: "vNext",
      image: imageUrlValue,
      buttons: [
        {
          label: `Join "${raffle.title}" Raffle`,
          action: "post",
          target: frameUrlValue,
        },
      ],
    };

    setMetaContent(JSON.stringify(fullFrameContent, null, 2));
  }, [selectedRaffleId, raffles]);

  const handleRaffleChange = (e) => {
    setSelectedRaffleId(e.target.value);
    setCopied({ url: false, meta: false }); // Reset copied states
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied((prev) => ({ ...prev, [type]: true }));

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied((prev) => ({ ...prev, [type]: false }));
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const simulateFrame = () => {
    if (frameUrl) {
      window.open(frameUrl, "_blank");
    }
  };

  const openWarpcastCompose = () => {
    if (!frameUrl) return;

    const title = selectedRaffle?.title || "Raffle";
    const encodedText = encodeURIComponent(
      `Check out this "${title}" raffle! ✨\n\n${frameUrl}`
    );
    window.open(`https://warpcast.com/~/compose?text=${encodedText}`, "_blank");
  };

  return (
    <div className="frame-debug-container">
      <h1>Frame Debug Tool</h1>
      <p className="debug-description">
        Use this tool to test Farcaster Frames for your raffles without needing
        to deploy to production
      </p>

      <div className="frame-debug-selection">
        <label htmlFor="raffle-select">Select a Raffle:</label>
        <select
          id="raffle-select"
          value={selectedRaffleId}
          onChange={handleRaffleChange}
        >
          <option value="">-- Select a Raffle --</option>
          {raffles &&
            raffles.map((raffle) => (
              <option key={raffle.id} value={raffle.id}>
                {raffle.title}
              </option>
            ))}
        </select>
      </div>

      {selectedRaffleId && (
        <div className="frame-debug-content">
          <div className="frame-debug-section">
            <h2>Frame URL</h2>
            <div className="debug-code-block">
              <code>{frameUrl}</code>
              <button
                onClick={() => copyToClipboard(frameUrl, "url")}
                className={copied.url ? "copied" : ""}
              >
                {copied.url ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="frame-debug-actions">
              <button onClick={simulateFrame} className="action-button">
                Open Frame URL
              </button>
              <button
                onClick={openWarpcastCompose}
                className="action-button warpcast"
              >
                Share to Warpcast
              </button>
            </div>
          </div>

          <div className="frame-debug-section">
            <h2>Frame Preview</h2>
            <div className="frame-preview">
              <img
                src={imageUrl}
                alt="Frame Preview"
                className="frame-preview-image"
              />
            </div>
          </div>

          <div className="frame-debug-section">
            <h2>Meta Content</h2>
            <div className="debug-code-block meta-content">
              <pre>{metaContent}</pre>
              <button
                onClick={() => copyToClipboard(metaContent, "meta")}
                className={copied.meta ? "copied" : ""}
              >
                {copied.meta ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="frame-debug-section">
            <h2>Testing Instructions</h2>
            <ol className="debug-instructions">
              <li>Copy the Frame URL above</li>
              <li>Create a new cast on Warpcast</li>
              <li>Paste the URL into your cast</li>
              <li>Submit the cast to see your frame in action</li>
              <li>
                Alternatively, use the &quot;Share to Warpcast&quot; button
              </li>
            </ol>
            <div className="debug-note">
              <p>
                <strong>Note:</strong> The preview may not be exactly as it
                appears on Warpcast due to rendering differences.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameDebugPage;
