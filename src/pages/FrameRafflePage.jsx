// src/pages/FrameRafflePage.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// Frames
import FrameProvider from "../frames/components/FrameProvider";
import FrameMeta from "../frames/components/FrameMeta";
import {
  getFrameContext,
  signalReady,
  openUrl,
  closeFrame,
} from "../frames/api";
import { generateBase64FrameImage } from "../frames/utils/base64FrameImage";

// Styles
import "../styles/frame.css";

// Hooks
import { useRaffle } from "../hooks/useRaffle";
import { useProfile } from "@farcaster/auth-kit";

// Components
import { ConnectKitButton } from "connectkit";
import { truncateAddress } from "../frames/utils/frameUtils";

/**
 * Page component for displaying a raffle in a Farcaster Frame
 */
const FrameRafflePage = () => {
  const { raffleId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useProfile();
  const {
    getRaffleById,
    addEntry,
    checkLikeCondition,
    updateEligibilityStatus,
    eligibilityStatus,
  } = useRaffle();

  const [raffle, setRaffle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInFrameContext, setIsInFrameContext] = useState(false);
  const [frameContext, setFrameContext] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [joinStatus, setJoinStatus] = useState(null);

  // Get current eligibility status for the raffle
  const getCurrentEligibilityStatus = useCallback(() => {
    const statusObj = eligibilityStatus.find(
      (item) => item.raffleId === raffleId
    );
    return statusObj ? statusObj.status : "Ineligible";
  }, [eligibilityStatus, raffleId]);

  // Check eligibility for the raffle
  const handleCheckEligibility = useCallback(async () => {
    if (!profile?.fid || !raffle) return;

    try {
      if (!raffle.criteria?.linkedCast) {
        updateEligibilityStatus(raffleId, "No linked Cast");
        return;
      }

      const hasLiked = await checkLikeCondition(
        profile.fid,
        raffle.criteria.linkedCast
      );

      if (hasLiked) {
        updateEligibilityStatus(raffleId, "Eligible");
      } else {
        updateEligibilityStatus(raffleId, "Ineligible");
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
      updateEligibilityStatus(raffleId, "Error checking eligibility");
    }
  }, [
    profile?.fid,
    raffle,
    raffleId,
    updateEligibilityStatus,
    checkLikeCondition,
  ]);

  // Join raffle
  const handleJoinRaffle = useCallback(async () => {
    if (!isAuthenticated || !profile?.fid) {
      setJoinStatus({ success: false, message: "Please sign in to continue" });
      return;
    }

    if (!selectedAddress) {
      setJoinStatus({
        success: false,
        message: "Please select an Ethereum address",
      });
      return;
    }

    const entryData = {
      id: uuidv4(),
      raffleId,
      participant: profile.fid,
      enteredAt: new Date().toISOString(),
      prizeWallet: selectedAddress,
    };

    try {
      await addEntry(entryData);
      setJoinStatus({
        success: true,
        message: "Successfully joined the raffle!",
      });

      // If we're in a frame, close it after successful entry
      if (isInFrameContext) {
        setTimeout(() => closeFrame(), 2000);
      }
    } catch (error) {
      console.error("Error joining raffle:", error);
      setJoinStatus({
        success: false,
        message: error.message || "Error joining raffle",
      });
    }
  }, [
    isAuthenticated,
    profile?.fid,
    selectedAddress,
    raffleId,
    addEntry,
    isInFrameContext,
  ]);

  // Handle Frame-specific raffle entry
  const handleFrameEntry = useCallback(async () => {
    if (!frameContext?.user?.fid || !raffle) return;

    try {
      // First check eligibility
      if (!raffle.criteria?.linkedCast) {
        setJoinStatus({
          success: false,
          message: "This raffle doesn&apos;t have an entry condition",
        });
        return;
      }

      const hasLiked = await checkLikeCondition(
        frameContext.user.fid,
        raffle.criteria.linkedCast
      );

      if (!hasLiked) {
        setJoinStatus({
          success: false,
          message: "You must like the cast to enter this raffle",
        });
        return;
      }

      // Create the entry with the user's custody address
      const entryData = {
        id: uuidv4(),
        raffleId,
        participant: frameContext.user.fid,
        enteredAt: new Date().toISOString(),
        prizeWallet: frameContext.user.custody || selectedAddress,
      };

      await addEntry(entryData);

      setJoinStatus({
        success: true,
        message: "Successfully joined the raffle!",
      });

      // Close frame after successful entry with a delay to show success message
      setTimeout(() => closeFrame(), 2000);
    } catch (error) {
      console.error("Error in frame entry:", error);
      setJoinStatus({
        success: false,
        message: error.message || "Error processing raffle entry",
      });
    }
  }, [
    frameContext,
    raffle,
    raffleId,
    addEntry,
    checkLikeCondition,
    selectedAddress,
  ]);

  // Initial data loading
  useEffect(() => {
    const loadRaffle = async () => {
      setLoading(true);
      try {
        // Get raffle data
        const raffleData = getRaffleById(raffleId);
        if (!raffleData) {
          throw new Error("Raffle not found");
        }
        setRaffle(raffleData);

        // Check if we're in a frame
        try {
          // Use a delay to ensure SDK is loaded
          setTimeout(async () => {
            try {
              const context = await getFrameContext();
              setFrameContext(context);
              setIsInFrameContext(!!context?.client?.clientFid);

              // If we have a context with user FID, preselect their wallet for prize delivery
              if (context?.user?.custody) {
                setSelectedAddress(context.user.custody);
              }

              // Signal ready to hide splash screen
              signalReady().catch((err) =>
                console.warn("Error signaling ready:", err)
              );
            } catch (frameError) {
              console.warn("Not in a frame context:", frameError);
              setIsInFrameContext(false);
            }
          }, 1000);
        } catch (frameError) {
          console.warn("Error checking frame context:", frameError);
          setIsInFrameContext(false);
        }
      } catch (error) {
        console.error("Error loading raffle:", error);
        setError(error.message || "Failed to load raffle");
      } finally {
        setLoading(false);
      }
    };

    loadRaffle();
  }, [raffleId, getRaffleById]);

  // Check eligibility when profile or raffle changes
  useEffect(() => {
    if (profile?.fid && raffle) {
      handleCheckEligibility();
    }
  }, [profile?.fid, raffle, handleCheckEligibility]);

  if (loading) {
    return <div className="loading">Loading raffle information...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!raffle) {
    return <div className="error">Raffle not found</div>;
  }

  // Generate a base64 data URL for the frame image
  const imageUrl = generateBase64FrameImage(raffle);

  return (
    <FrameProvider>
      <FrameMeta
        imageUrl={imageUrl}
        title={`Join "${raffle.title}" Raffle`}
        frameUrl={`${window.location.origin}/frame/raffle/${raffleId}`}
        appName="Rafflecast"
      />

      <div className="frame-raffle-container">
        <h1 className="raffle-title">{raffle.title}</h1>

        <div className="raffle-info">
          <p className="raffle-description">{raffle.description}</p>

          <div className="raffle-dates">
            <p>Closes: {new Date(raffle.closingDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="eligibility-section">
          <h2>Eligibility</h2>
          {isInFrameContext ? (
            // Frame-specific eligibility view
            <div className="frame-eligibility">
              {frameContext?.user?.fid ? (
                <>
                  <p>
                    Welcome, @{frameContext.user.username || "Farcaster user"}
                  </p>
                  <button
                    className="eligibility-check-button"
                    onClick={handleFrameEntry}
                  >
                    Join Raffle
                  </button>
                </>
              ) : (
                <p>Please connect your Farcaster account</p>
              )}
            </div>
          ) : (
            // Regular web eligibility view
            <div className="web-eligibility">
              <div className="eligibility-status">
                <p>
                  Status:{" "}
                  <span className={getCurrentEligibilityStatus()}>
                    {getCurrentEligibilityStatus()}
                  </span>
                </p>
              </div>

              <button
                className="eligibility-check-button"
                onClick={handleCheckEligibility}
              >
                Check Eligibility
              </button>

              {isAuthenticated ? (
                <>
                  <div className="address-selection">
                    <label htmlFor="prize-wallet">Prize Wallet:</label>
                    <select
                      id="prize-wallet"
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                    >
                      <option value="">Select an address</option>
                      {profile?.verifications?.map((address, index) => (
                        <option key={index} value={address}>
                          {truncateAddress(address)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="join-raffle-button"
                    onClick={handleJoinRaffle}
                    disabled={
                      getCurrentEligibilityStatus() !== "Eligible" ||
                      !selectedAddress
                    }
                  >
                    Join Raffle
                  </button>
                </>
              ) : (
                <div className="connect-prompt">
                  <p>Please connect to join this raffle</p>
                  <ConnectKitButton />
                </div>
              )}
            </div>
          )}

          {joinStatus && (
            <div
              className={`join-status ${
                joinStatus.success ? "success" : "error"
              }`}
            >
              {joinStatus.message}
            </div>
          )}
        </div>

        <div className="frame-actions">
          <button
            className="back-button"
            onClick={() => (isInFrameContext ? closeFrame() : navigate(-1))}
          >
            {isInFrameContext ? "Close" : "Back"}
          </button>

          <button
            className="visit-button"
            onClick={() =>
              openUrl(`${window.location.origin}/entrant/raffles/browse`)
            }
          >
            View All Raffles
          </button>
        </div>
      </div>
    </FrameProvider>
  );
};

export default FrameRafflePage;
