import { useProfile } from "@farcaster/auth-kit";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import RaffleSummary from "@/components/RaffleSummary";
import { useRaffle } from "@/hooks/useRaffle";
import "@/styles/cast-lookup.css";
import "@/styles/status-message.css";
import "@/styles/progress-indicator.css";
import "@/styles/auth-notice.css";
import "@/styles/cast-popup.css";
import "@/styles/tabbed-summary.css";

const CreateRafflePage = () => {
  // Form state
  const [raffleTitle, setRaffleTitle] = useState("");
  const [description, setDescription] = useState(
    "SecondOrder.fun - Memecoins without the hangover"
  );
  const [criteriaType, setCriteriaType] = useState("like");
  const [linkedCast, setLinkedCast] = useState("");
  const [castLookupStatus, setCastLookupStatus] = useState({
    loading: false,
    data: null,
    error: null,
  });
  const [showCastPreview, setShowCastPreview] = useState(false);

  // Date/time state with better defaults
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [startTime, setStartTime] = useState("12:00");

  const [closingDate, setClosingDate] = useState(() => {
    const oneWeekFromToday = new Date();
    oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7);
    return oneWeekFromToday.toISOString().split("T")[0];
  });
  const [closingTime, setClosingTime] = useState("12:00");

  const [challengePeriod, setChallengePeriod] = useState(() => {
    const twoWeeksFromToday = new Date();
    twoWeeksFromToday.setDate(twoWeeksFromToday.getDate() + 14);
    return twoWeeksFromToday.toISOString().split("T")[0];
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formStep, setFormStep] = useState(1);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Auth and navigation
  const { isAuthenticated, profile } = useProfile();
  const { addRaffle } = useRaffle();
  const navigate = useNavigate();

  // Handle cast hash lookup
  const handleLookupCast = async () => {
    if (!linkedCast || !/^0x[a-fA-F0-9]{1,64}$/.test(linkedCast)) {
      setCastLookupStatus({
        loading: false,
        data: null,
        error: "Please enter a valid cast hash",
      });
      return;
    }

    setCastLookupStatus({ loading: true, data: null, error: null });

    try {
      // This would be replaced with your actual API call
      // For example, fetching from Pinata or other Farcaster API
      const pinataBaseUrl = "https://api.pinata.cloud/v3/farcaster";
      const jwtToken = import.meta.env.VITE_PINATA_JWT;

      if (!jwtToken) {
        throw new Error("API token not configured");
      }

      const response = await fetch(`${pinataBaseUrl}/casts/${linkedCast}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cast data: ${response.statusText}`);
      }

      const data = await response.json();
      const castData = {
        author: data.cast.author.username,
        text:
          data.cast.text.substring(0, 60) +
          (data.cast.text.length > 60 ? "..." : ""),
        timestamp: new Date(data.cast.timestamp).toLocaleString(),
      };

      setCastLookupStatus({
        loading: false,
        data: castData,
        error: null,
      });

      // Show the cast preview popup
      setShowCastPreview(true);

      // Clear any validation errors for linkedCast when lookup succeeds
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated.linkedCast;
        return updated;
      });
    } catch (error) {
      console.error("Error looking up cast:", error);
      setCastLookupStatus({
        loading: false,
        data: null,
        error: error.message || "Failed to lookup cast",
      });
    }
  };

  // Form validation
  const validateFormFields = (step = null) => {
    const errors = {};

    // For step 1, only validate title and linkedCast
    if (step === null || step === 1) {
      // Title validation - only required for submission
      if (!raffleTitle.trim()) {
        errors.title = "Raffle title is required";
      }

      // Cast hash validation - more permissive and only required for submission
      if (linkedCast.trim() && !/^0x[a-fA-F0-9]+$/.test(linkedCast)) {
        errors.linkedCast = "Invalid cast hash format (should start with 0x)";
      }
    }

    // Only validate dates if we're on step 2 or submitting
    if (step === null || step === 2) {
      // Date validation
      const now = new Date();
      const start = new Date(`${startDate}T${startTime}`);
      const close = new Date(`${closingDate}T${closingTime}`);
      const challengeEnd = new Date(`${challengePeriod}T23:59:59`);

      if (start < now) {
        errors.startDate = "Start date cannot be in the past";
      }

      if (close <= start) {
        errors.closingDate = "Closing date must be after the start date";
      }

      if (challengeEnd <= close) {
        errors.challengePeriod =
          "Challenge period must end after the closing date";
      }
    }

    return errors;
  };

  // Form step navigation
  const nextStep = () => {
    // Set validation errors but always proceed
    const stepErrors = validateFormFields(formStep);
    setFormErrors(stepErrors);

    // If there are errors, don't proceed
    if (Object.keys(stepErrors).length > 0) {
      return;
    }

    // Advance to the next step (max step is 3 now - added summary step)
    setFormStep(Math.min(formStep + 1, 3));
  };

  const prevStep = () => {
    setFormStep(Math.max(formStep - 1, 1));
  };

  // Jump to a specific step (for editing from summary)
  const goToStep = (step) => {
    setFormStep(step);
  };

  // Create raffle handler
  const handleCreateRaffle = async () => {
    if (!isAuthenticated) {
      console.error("Please sign in with Warpcast to create a raffle");
      setStatusMessage({
        type: "error",
        text: "Please sign in with Warpcast to create a raffle",
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ type: "", text: "" });

    // Perform full validation before submission
    const errors = validateFormFields();
    setFormErrors(errors);

    // Don't proceed if there are errors
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      console.error("Please fix the errors before submitting");
      setStatusMessage({
        type: "error",
        text: "Please fix the errors before submitting",
      });
      return;
    }

    const defaultCastHash = "0xc2c6f9642ebe6f74eda4b5575c701431d16ca290"; // Fallback default
    const finalCastHash = linkedCast.trim() || defaultCastHash;

    const newRaffle = {
      id: uuidv4(),
      creator: profile.fid,
      title: raffleTitle,
      description,
      startDate,
      startTime,
      closingDate,
      closingTime,
      challengePeriod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phase: "Active",
      criteria: JSON.stringify({
        type: criteriaType,
        linkedCast: finalCastHash,
      }),
      distributions: JSON.stringify({
        rewards: [], // Empty rewards array - to be set during distribution phase
      }),
    };

    try {
      await addRaffle(newRaffle);
      console.log("Raffle created successfully!");
      setStatusMessage({
        type: "success",
        text: "Raffle created successfully!",
      });

      // Short delay before navigation to show the success message
      setTimeout(() => {
        navigate("/creator/raffles/manage");
      }, 1000);
    } catch (error) {
      console.error("Failed to create raffle:", error);
      setFormErrors((prev) => ({
        ...prev,
        submission: error.message || "Failed to create raffle",
      }));
      setStatusMessage({
        type: "error",
        text: error.message || "Failed to create raffle",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form based on current step
  const renderFormStep = () => {
    switch (formStep) {
      case 1:
        return (
          <>
            <h4 className="step-title">Step 1: Basic Information</h4>

            <div className="form-group">
              <label className="form-label">
                Raffle Title:
                <input
                  className={`form-input ${
                    formErrors.title ? "error-input" : ""
                  }`}
                  type="text"
                  value={raffleTitle}
                  onChange={(e) => setRaffleTitle(e.target.value)}
                  placeholder="Enter a catchy title for your raffle"
                />
                {formErrors.title && (
                  <div className="error-message">{formErrors.title}</div>
                )}
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                Description:
                <textarea
                  className="form-input description-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  placeholder="Describe what your raffle is about"
                />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                Criteria Type:
                <select
                  className="form-input"
                  value={criteriaType}
                  onChange={(e) => setCriteriaType(e.target.value)}
                >
                  <option value="like">
                    Like (Participants must like a specific cast)
                  </option>
                  {/* Additional criteria types can be added here in the future */}
                </select>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Linked Cast Hash:</label>
              <div className="cast-input-group">
                <input
                  className={`form-input ${
                    formErrors.linkedCast ? "error-input" : ""
                  }`}
                  type="text"
                  value={linkedCast}
                  onChange={(e) => setLinkedCast(e.target.value)}
                  placeholder="Enter the cast hash (0x...)"
                />
                <button
                  type="button"
                  className="lookup-button"
                  onClick={handleLookupCast}
                  disabled={castLookupStatus.loading || !linkedCast.trim()}
                >
                  {castLookupStatus.loading ? "..." : "Lookup"}
                </button>
              </div>
              {formErrors.linkedCast && (
                <div className="error-message">{formErrors.linkedCast}</div>
              )}
              {castLookupStatus.error && (
                <div className="error-message">{castLookupStatus.error}</div>
              )}
              <div className="input-help">
                This is the cast that participants will need to like to enter
                the raffle
              </div>

              {/* Cast Preview Popup */}
              {showCastPreview && castLookupStatus.data && (
                <div
                  className="cast-popup-overlay"
                  onClick={() => setShowCastPreview(false)}
                >
                  <div
                    className="cast-popup"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="cast-popup-header">
                      <h3 className="cast-popup-title">Cast Preview</h3>
                      <button
                        type="button"
                        className="cast-popup-close"
                        onClick={() => setShowCastPreview(false)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="cast-popup-content">
                      <div className="cast-author">
                        @{castLookupStatus.data.author}
                      </div>
                      <div className="cast-text">
                        {castLookupStatus.data.text}
                      </div>
                      <div className="cast-date">
                        {castLookupStatus.data.timestamp}
                      </div>
                    </div>
                    <div className="cast-popup-footer">
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => setShowCastPreview(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <div></div> {/* Empty div for spacing on left side */}
              <button className="primary-button" onClick={nextStep}>
                Continue to Time Settings
              </button>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h4 className="step-title">Step 2: Time Settings</h4>

            <div className="form-group date-group">
              <label className="form-label">
                Start Date:
                <input
                  className={`form-input date-input ${
                    formErrors.startDate ? "error-input" : ""
                  }`}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                {formErrors.startDate && (
                  <div className="error-message">{formErrors.startDate}</div>
                )}
              </label>
              <label className="form-label">
                Start Time:
                <input
                  className="form-input time-input"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>
            </div>

            <div className="form-group date-group">
              <label className="form-label">
                Closing Date:
                <input
                  className={`form-input date-input ${
                    formErrors.closingDate ? "error-input" : ""
                  }`}
                  type="date"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                />
                {formErrors.closingDate && (
                  <div className="error-message">{formErrors.closingDate}</div>
                )}
              </label>
              <label className="form-label">
                Closing Time:
                <input
                  className="form-input time-input"
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                Challenge Period Ends:
                <input
                  className={`form-input date-input ${
                    formErrors.challengePeriod ? "error-input" : ""
                  }`}
                  type="date"
                  value={challengePeriod}
                  onChange={(e) => setChallengePeriod(e.target.value)}
                />
                {formErrors.challengePeriod && (
                  <div className="error-message">
                    {formErrors.challengePeriod}
                  </div>
                )}
                <div className="input-help">
                  The challenge period allows time for verification before
                  rewards are distributed
                </div>
              </label>
            </div>

            <div className="form-actions">
              <button className="secondary-button" onClick={prevStep}>
                Back
              </button>
              <button className="primary-button" onClick={nextStep}>
                Continue to Review
              </button>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h4 className="step-title">Step 3: Review and Submit</h4>

            <RaffleSummary
              raffleData={{
                title: raffleTitle,
                description,
                criteriaType,
                linkedCast,
                startDate,
                startTime,
                closingDate,
                closingTime,
                challengePeriod,
              }}
              castInfo={castLookupStatus.data}
              onEdit={goToStep}
            />

            <div className="form-actions">
              <button className="secondary-button" onClick={prevStep}>
                Back
              </button>
              <button
                className="primary-button"
                onClick={handleCreateRaffle}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Raffle"}
              </button>
            </div>

            {formErrors.submission && (
              <div className="error-banner">{formErrors.submission}</div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <div className="form-section">
        <h3 className="form-title">Create a New Raffle</h3>

        {!isAuthenticated ? (
          <div className="auth-notice">
            Please sign in with Warpcast to create a new raffle.
          </div>
        ) : (
          <div className="raffle-form-grid">
            <div className="creator-info-section">
              <div className="info-item">
                <span className="info-label">Creator FID:</span>
                <span className="info-value">
                  {profile?.fid || "Not available"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Custody Address:</span>
                <div
                  className="info-value truncated-address"
                  title={profile?.custody || "Not available"}
                >
                  {profile?.custody || "Not available"}
                </div>
              </div>
            </div>

            {statusMessage.text && (
              <div className={`status-message ${statusMessage.type}`}>
                {statusMessage.text}
              </div>
            )}

            <div className="form-progress-indicator">
              <div className={`progress-step ${formStep >= 1 ? "active" : ""}`}>
                Basic Info
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${formStep >= 2 ? "active" : ""}`}>
                Timing
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${formStep >= 3 ? "active" : ""}`}>
                Review
              </div>
            </div>

            <div className="form-content">{renderFormStep()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRafflePage;
