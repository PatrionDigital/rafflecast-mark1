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
  const isInFramePath = location.pathname.startsWith("/frame/");

  // Base and app URLs
  const baseUrl = window.location.origin;
  const baseAppUrl = `${baseUrl}`;
  const appName = "Rafflecast";

  // Default frame metadata for the base app
  const defaultFrameData = {
    version: "next",
    imageUrl: `${baseUrl}/api/og-image/rafflecast.png`,
    button: {
      title: "Browse Raffles",
      action: {
        type: "launch_frame",
        name: appName,
        url: `${baseAppUrl}/entrant/raffles/browse`,
        splashImageUrl: `${baseUrl}/logo.png`,
        splashBackgroundColor: "#820b8a",
      },
    },
  };

  // Specific raffle metadata
  const raffleFrameData = isSpecificRaffle
    ? {
        version: "next",
        imageUrl: `${baseUrl}/api/og-image/raffle/${raffle.id}`,
        button: {
          title: "Join Raffle",
          action: {
            type: "launch_frame",
            name: raffle.title || appName,
            url: `${baseAppUrl}/entrant/raffles/browse?id=${raffle.id}`,
            splashImageUrl: `${baseUrl}/logo.png`,
            splashBackgroundColor: "#820b8a",
          },
        },
      }
    : defaultFrameData;

  // Choose which metadata to use based on the URL path
  const frameData =
    isInFramePath && isSpecificRaffle ? raffleFrameData : defaultFrameData;

  useEffect(() => {
    // Clear existing frame tags
    document
      .querySelectorAll('meta[name^="fc:frame"]')
      .forEach((tag) => tag.remove());

    // Set the new frame tags
    const metaTag = document.createElement("meta");
    metaTag.setAttribute("name", "fc:frame");
    metaTag.setAttribute("content", JSON.stringify(frameData));
    document.head.appendChild(metaTag);

    // Cleanup function for when component unmounts
    return () => {
      document
        .querySelectorAll('meta[name^="fc:frame"]')
        .forEach((tag) => tag.remove());
    };
  }, [frameData]);

  // This component doesn't render anything visible
  return null;
};

FrameMeta.propTypes = {
  raffle: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    creator: PropTypes.number,
    // Add other raffle properties as needed
  }),
};

export default FrameMeta;
