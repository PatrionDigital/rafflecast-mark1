// src/components/FrameMeta.jsx
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useParams } from "react-router-dom";

/**
 * Component that handles dynamic Farcaster Frame meta tags
 * This component doesn't render anything visible but updates the meta tags in the document head
 */
const FrameMeta = ({ raffle: propRaffle }) => {
  const location = useLocation();
  const { raffleId } = useParams();

  useEffect(() => {
    console.log("FrameMeta Component Mounted");
    console.log("Current Pathname:", location.pathname);
    console.log("Raffle ID from params:", raffleId);
    console.log("Prop Raffle:", propRaffle);

    // Base URL and app name
    const baseUrl = window.location.origin;
    const appName = "Rafflecast";

    // Force raffle-specific meta tag for Frame route
    const isFrameRoute = location.pathname.includes("/frame/raffle/");

    let frameContent;

    if (isFrameRoute && raffleId) {
      frameContent = {
        version: "next",
        imageUrl: "https://picsum.photos/1200/630",
        button: {
          title: "Join Raffle",
          action: {
            type: "launch_frame",
            name: "Specific Raffle",
            url: `${baseUrl}/entrant/raffles/browse?id=${raffleId}`,
            splashBackgroundColor: "#820b8a",
          },
        },
      };
    } else {
      // Default app meta data
      frameContent = {
        version: "next",
        imageUrl: "https://picsum.photos/1200/630",
        button: {
          title: "Browse Raffles",
          action: {
            type: "launch_frame",
            name: appName,
            url: `${baseUrl}/entrant/raffles/browse`,
            splashBackgroundColor: "#820b8a",
          },
        },
      };
    }

    // Convert to JSON string
    const contentString = JSON.stringify(frameContent);

    // Find existing fc:frame meta tag or create a new one
    let metaTag = document.querySelector('meta[name="fc:frame"]');

    if (!metaTag) {
      // If tag doesn't exist, create it
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "fc:frame");
      document.head.appendChild(metaTag);
    }

    // Update the content attribute
    metaTag.setAttribute("content", contentString);

    console.log("Updated Frame meta tag:", contentString);
  }, [location.pathname, raffleId, propRaffle]);

  // This component doesn't render anything visible
  return null;
};

FrameMeta.propTypes = {
  raffle: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
};

export default FrameMeta;
