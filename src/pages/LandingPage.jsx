// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";
import FrameMeta from "../components/FrameMeta";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Add FrameMeta for default site sharing */}
      <FrameMeta />

      <h1>Welcome to Rafflecast</h1>
      <p>
        The premier platform for creating and participating in Farcaster
        raffles!
      </p>

      <div className="landing-actions">
        <Link to="/creator/raffles/new" className="primary-button">
          Create a Raffle
        </Link>
        <Link to="/entrant/raffles/browse" className="secondary-button">
          Browse Raffles
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
