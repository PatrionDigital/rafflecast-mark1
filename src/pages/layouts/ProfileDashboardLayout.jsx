// src/pages/layouts/ProfileDashboardLayout.jsx
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "@farcaster/auth-kit";
import PropTypes from "prop-types";
import { useEffect } from "react";

// SubNav component for the profile section
const ProfileSubNav = ({ links }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="profile-subnav">
      <ul className="profile-nav-list">
        {links.map((link) => (
          <li key={link.path} className="profile-nav-item">
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                isActive ||
                (pathname === "/profile" && link.path === "/profile/raffles")
                  ? "profile-link active-link"
                  : "profile-link"
              }
              end
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

ProfileSubNav.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// Main layout component
const ProfileDashboardLayout = () => {
  const { isAuthenticated } = useProfile();
  const navigate = useNavigate();

  // Define profile navigation links
  const profileNavLinks = [
    { path: "/profile/raffles", label: "My Raffles" },
    { path: "/profile/entries", label: "My Entries" },
  ];

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <div className="loading">Checking authentication...</div>;
  }

  return (
    <div className="profile-dashboard-layout">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <ProfileSubNav links={profileNavLinks} />
      </div>

      <div className="profile-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileDashboardLayout;
