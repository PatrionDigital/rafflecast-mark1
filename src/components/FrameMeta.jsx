// src/components/FrameMeta.jsx
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

/**
 * Component that handles dynamic Farcaster Frame meta tags
 * This component doesn't render anything visible but updates the meta tags in the document head
 */
const FrameMeta = ({ raffle }) => {
  const location = useLocation();
  const isSpecificRaffle = raffle && raffle.id;

  // Base URL and app name
  const baseUrl = window.location.origin;
  const appName = "Rafflecast";

  useEffect(() => {
    // Generate the meta tag content based on whether we're viewing a specific raffle
    let frameContent;

    if (isSpecificRaffle) {
      // Specific raffle meta data
      frameContent = {
        version: "next",
        imageUrl: "https://picsum.photos/1200/630", // Replace with your actual image URL
        button: {
          title: "Join Raffle",
          action: {
            type: "launch_frame",
            name: raffle.title || appName,
            url: `${baseUrl}/entrant/raffles/browse?id=${raffle.id}`,
            splashBackgroundColor: "#820b8a",
          },
        },
      };
    } else {
      // Default app meta data
      frameContent = {
        version: "next",
        imageUrl: "https://picsum.photos/1200/630", // Replace with your actual image URL
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
  }, [isSpecificRaffle, raffle, baseUrl, appName]);

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
