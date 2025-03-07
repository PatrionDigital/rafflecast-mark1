import { useState } from "react";
import PropTypes from "prop-types";

const RaffleSummary = ({ raffleData, castInfo, onEdit }) => {
  const [activeTab, setActiveTab] = useState("basic");

  const formatDateTime = (date, time) => {
    try {
      return new Date(`${date}T${time}`).toLocaleString();
    } catch (e) {
      console.log("Error formatting date:", e);
      return `${date} ${time}`;
    }
  };

  return (
    <div className="raffle-summary">
      <div className="summary-tabs">
        <button
          className={`tab-button ${activeTab === "basic" ? "active" : ""}`}
          onClick={() => setActiveTab("basic")}
        >
          Basic Information
        </button>
        <button
          className={`tab-button ${activeTab === "timing" ? "active" : ""}`}
          onClick={() => setActiveTab("timing")}
        >
          Time Settings
        </button>
      </div>

      <div className="summary-content">
        {activeTab === "basic" && (
          <div className="summary-section">
            <button
              type="button"
              className="edit-button"
              onClick={() => onEdit(1)}
            >
              Edit
            </button>

            <div className="summary-field">
              <span className="field-label">Title:</span>
              <span className="field-value">{raffleData.title}</span>
            </div>

            {raffleData.description && (
              <div className="summary-field">
                <span className="field-label">Description:</span>
                <span className="field-value description-value">
                  {raffleData.description}
                </span>
              </div>
            )}

            <div className="summary-field">
              <span className="field-label">Entry Criteria:</span>
              <span className="field-value">
                {raffleData.criteriaType === "like"
                  ? "Like a Cast"
                  : raffleData.criteriaType === "recast"
                  ? "Recast a Cast"
                  : "Follow a User"}
              </span>
            </div>

            {raffleData.linkedCast && (
              <div className="summary-field">
                <span className="field-label">Linked Cast:</span>
                <span className="field-value hash-value">
                  {raffleData.linkedCast}
                </span>

                {castInfo && (
                  <div className="cast-preview small">
                    <div className="cast-author">@{castInfo.author}</div>
                    <div className="cast-text">{castInfo.text}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "timing" && (
          <div className="summary-section">
            <button
              type="button"
              className="edit-button"
              onClick={() => onEdit(2)}
            >
              Edit
            </button>

            <div className="summary-field">
              <span className="field-label">Starts:</span>
              <span className="field-value">
                {formatDateTime(raffleData.startDate, raffleData.startTime)}
              </span>
            </div>

            <div className="summary-field">
              <span className="field-label">Closes:</span>
              <span className="field-value">
                {formatDateTime(raffleData.closingDate, raffleData.closingTime)}
              </span>
            </div>

            <div className="summary-field">
              <span className="field-label">Challenge Period Ends:</span>
              <span className="field-value">{raffleData.challengePeriod}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

RaffleSummary.propTypes = {
  raffleData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    criteriaType: PropTypes.string.isRequired,
    linkedCast: PropTypes.string,
    startDate: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    closingDate: PropTypes.string.isRequired,
    closingTime: PropTypes.string.isRequired,
    challengePeriod: PropTypes.string.isRequired,
  }).isRequired,
  castInfo: PropTypes.shape({
    author: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
  }),
  onEdit: PropTypes.func.isRequired,
};

export default RaffleSummary;
