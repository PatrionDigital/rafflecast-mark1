// src/components/FrameMeta.jsx
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useParams } from "react-router-dom";

/**
 * Component that handles dynamic Farcaster Frame meta tags
 * This component doesn't render anything visible but updates the meta tags in the document head
 */
const FrameMeta = ({ raffle }) => {
  const location = useLocation();
  const { raffleId } = useParams();

  useEffect(() => {
    // Ensure meta tag is updated during client-side rendering
    const updateMetaTag = () => {
      // Base URL - use environment variable or fallback
      const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      const appName = "Rafflecast";

      let frameContent;

      // Check if we're on a frame route and have a raffle ID
      const isFrameRoute = location.pathname.includes("/frame/raffle/");
      const effectiveRaffleId = raffle?.id || raffleId;

      if (isFrameRoute && effectiveRaffleId) {
        frameContent = {
          version: "next",
          imageUrl: "https://picsum.photos/1200/630", // Replace with actual frame image
          button: {
            title: "Join Raffle",
            action: {
              type: "launch_frame",
              name: raffle?.title || appName,
              url: `${baseUrl}/entrant/raffles/browse?id=${effectiveRaffleId}`,
              splashBackgroundColor: "#820b8a",
            },
          },
        };
      } else {
        frameContent = {
          version: "next",
          imageUrl: "https://picsum.photos/1200/630", // Replace with site og image
          button: {
            title: "Join Raffle",
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

      // Find or create meta tag
      let metaTag = document.querySelector('meta[name="fc:frame"]');

      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("name", "fc:frame");
        document.head.appendChild(metaTag);
      }

      // Update content attribute directly
      metaTag.setAttribute("content", contentString);

      // Additional debug logging
      console.log("Frame Meta Tag Updated:", contentString);

      // Force a reflow to ensure the change is recognized
      document.documentElement.offsetHeight;
    };

    // Update immediately
    updateMetaTag();

    // Update on route changes or raffle data changes
    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "content"
        ) {
          updateMetaTag();
          break;
        }
      }
    });

    // Observe the meta tag for changes
    const metaTag = document.querySelector('meta[name="fc:frame"]');
    if (metaTag) {
      observer.observe(metaTag, { attributes: true });
    }

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [location.pathname, raffleId, raffle]);

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
