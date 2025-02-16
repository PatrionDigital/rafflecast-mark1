// components/Header.jsx
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { SignInButton, useProfile } from "@farcaster/auth-kit";

const Header = ({ title, navLinks }) => {
  const { isAuthenticated, profile } = useProfile();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1>{title}</h1>
        </div>

        <nav className="header-nav">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.path} className="nav-item">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? "active-link" : "link"
                  }
                  end
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-right">
          <div className="user-menu">
            {isAuthenticated && profile ? (
              <p>Welcome, {profile.displayName}</p>
            ) : (
              <p>Please sign in</p>
            )}
            <SignInButton />
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Header;
