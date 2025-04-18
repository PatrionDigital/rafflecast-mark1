import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const Footer = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${className}`}>
      <div className="footer-container">
        <div className="footer-left">
          <p>© {currentYear} SecondOrder.fun</p>
        </div>

        <div className="footer-center">
          <p>All rights reserved</p>
        </div>

        <div className="footer-right">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};
