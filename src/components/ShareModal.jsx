import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

const ShareModal = ({ raffle, onClose }) => {
  const modalRef = useRef(null);

  // Base URL for raffle frame link
  const baseUrl = window.location.origin;
  const directRaffleLink = `${baseUrl}/entrant/raffles/browse?id=${raffle.id}`;
  const frameRaffleLink = `${baseUrl}/frame/raffle/${raffle.id}`;

  // Copy link to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Show toast or some feedback (could be enhanced)
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  // Handle share to Warpcast
  const shareToWarpcast = () => {
    const encodedText = encodeURIComponent(
      `Check out this raffle: "${raffle.title}" ✨\n\n${frameRaffleLink}`
    );
    window.open(`https://warpcast.com/~/compose?text=${encodedText}`, "_blank");
  };

  // Close on escape key or outside click
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay">
      <div className="share-modal modal-content" ref={modalRef}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <h2>Share Raffle</h2>

        <div className="share-section">
          <h3>Direct Link</h3>
          <div className="share-link-container">
            <input
              type="text"
              value={directRaffleLink}
              readOnly
              className="share-link-input"
            />
            <button
              className="copy-button"
              onClick={() => copyToClipboard(directRaffleLink)}
            >
              Copy
            </button>
          </div>
        </div>

        <div className="share-section">
          <h3>Farcaster Frame Link</h3>
          <p className="share-description">
            Share this link to create an interactive Farcaster Frame
          </p>
          <div className="share-link-container">
            <input
              type="text"
              value={frameRaffleLink}
              readOnly
              className="share-link-input"
            />
            <button
              className="copy-button"
              onClick={() => copyToClipboard(frameRaffleLink)}
            >
              Copy
            </button>
          </div>
        </div>

        <div className="share-options">
          <button
            className="share-button warpcast-button"
            onClick={shareToWarpcast}
          >
            Share to Warpcast
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

ShareModal.propTypes = {
  raffle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShareModal;
