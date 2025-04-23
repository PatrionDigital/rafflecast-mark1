// src/components/RaffleManagement/RaffleEntriesModal.jsx - Refactored with Tailwind
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

/**
 * Modal component for displaying entries of a raffle
 */
const RaffleEntriesModal = ({
  entries = [],
  isLoading = false,
  onClose = () => {},
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    // Handle escape key press
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Handle clicking outside the modal
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    // Prevent body scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-xl p-6 w-11/12 max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        ref={modalRef}
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-cochineal-red">
            Raffle Entries
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">
            {entries.length} participant{entries.length !== 1 ? "s" : ""}
          </span>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-t-cochineal-red border-cochineal-red/30 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading entries...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-gray-500">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <p className="mb-2 font-medium">
              No entries found for this raffle.
            </p>
            <p className="text-sm">
              Share your raffle to get more participants!
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden border border-gray-200 rounded-lg">
            <div className="overflow-y-auto max-h-[calc(80vh-12rem)]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Participant
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Entry Date
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Prize Wallet
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {entry.participant || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(entry.enteredAt)}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.prizeWallet ? (
                          <span
                            className="font-mono text-xs bg-gray-100 p-1 rounded"
                            title={entry.prizeWallet}
                          >
                            {entry.prizeWallet.substring(0, 6)}...
                            {entry.prizeWallet.substring(
                              entry.prizeWallet.length - 4
                            )}
                          </span>
                        ) : (
                          "Not provided"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 text-right">
          <button
            className="bg-cochineal-red hover:bg-enamel-red text-white px-5 py-2 rounded-md font-medium transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

RaffleEntriesModal.propTypes = {
  entries: PropTypes.array,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
};

export default RaffleEntriesModal;
