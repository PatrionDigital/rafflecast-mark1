// src/components/Pagination.jsx
import PropTypes from "prop-types";

/**
 * Pagination component for navigating through pages of content
 * @param {Object} props - Component props
 * @param {number} props.totalItems - Total number of items across all pages
 * @param {number} props.itemsPerPage - Number of items to display per page
 * @param {number} props.currentPage - The current active page
 * @param {Function} props.setCurrentPage - Callback to set the current page
 * @returns {JSX.Element|null} Pagination controls or null if only one page
 */
const Pagination = ({
  totalItems = 0,
  itemsPerPage = 10,
  currentPage = 1,
  setCurrentPage = () => {},
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of content on page change
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];

    const pages = [];

    // Always show first page
    pages.push(1);

    // If current page is more than 3, add ellipsis after page 1
    if (currentPage > 3) {
      pages.push("...");
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // If current page is less than totalPages - 2, add ellipsis before last page
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Don't render pagination if there's only one page or fewer items than itemsPerPage
  if (totalItems <= itemsPerPage) return null;

  return (
    <div className="pagination-controls">
      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            className={`pagination-button ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

Pagination.propTypes = {
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
};

export default Pagination;
