// components/Header.jsx
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { SignInButton, useProfile } from "@farcaster/auth-kit";

const Header = ({ title, navLinks }) => {
  const { isAuthenticated, profile } = useProfile();

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>{title}</h1>
        <div className="user-menu">
          {isAuthenticated && profile ? (
            <p>Welcome, {profile.displayName}</p>
          ) : (
            <p>Please sign in</p>
          )}
          <SignInButton />
        </div>
      </div>
      <nav>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive ? "active-link" : "link"
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
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
