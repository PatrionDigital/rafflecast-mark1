// src/pages/ProfilePage.jsx
import { useProfile } from "@farcaster/auth-kit";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link, Routes, Route, useLocation, Navigate } from "react-router-dom";

import { EntriesManagementPage } from "@/components/EntriesManagement";

import ManageRafflesPage from "./ManageRafflesPage";

// ProfileNavItem component for navigation tabs
const ProfileNavItem = ({ to, label, active }) => {
  return (
    <Link to={to} className={`profile-nav-item ${active ? "active" : ""}`}>
      {label}
    </Link>
  );
};

ProfileNavItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};

// Main Profile Page component
const ProfilePage = () => {
  const { isAuthenticated } = useProfile();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Set active tab based on current path
    if (location.pathname.includes("/profile/entries")) {
      return "entries";
    }
    return "raffles";
  });

  // Update active tab when location changes
  useState(() => {
    if (location.pathname.includes("/profile/entries")) {
      setActiveTab("entries");
    } else if (location.pathname.includes("/profile/raffles")) {
      setActiveTab("raffles");
    }
  }, [location.pathname]);

  if (!isAuthenticated) {
    return (
      <div className="page-container auth-required">
        <div className="auth-message">
          <h2>Your Profile</h2>
          <p>Please sign in with Warpcast to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Your Profile</h1>

        <div className="profile-navigation">
          <ProfileNavItem
            to="/profile/raffles"
            label="My Raffles"
            active={activeTab === "raffles"}
          />
          <ProfileNavItem
            to="/profile/entries"
            label="My Entries"
            active={activeTab === "entries"}
          />
        </div>
      </div>

      <div className="profile-content">
        <Routes>
          <Route path="raffles" element={<ManageRafflesPage />} />
          <Route path="entries" element={<EntriesManagementPage />} />
          <Route
            path="/"
            element={<Navigate to="/profile/raffles" replace />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default ProfilePage;
