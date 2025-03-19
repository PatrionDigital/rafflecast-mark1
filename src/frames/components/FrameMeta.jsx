// src/frames/components/FrameMeta.jsx
import { useEffect } from "react";
import PropTypes from "prop-types";
import { generateFrameMeta } from "../utils/frameUtils";

/**
 * Component that adds Farcaster Frame meta tags to the document head
 *
 * This is useful for static pages and initial frame rendering
 */
const FrameMeta = ({
  imageUrl,
  title,
  frameUrl,
  appName,
  splashImage,
  backgroundColor,
}) => {
  useEffect(() => {
    // Generate frame meta content
    const { metaContent } = generateFrameMeta({
      imageUrl,
      title,
      frameUrl,
      appName,
      splashImage,
      backgroundColor,
    });

    // Create meta tag if it doesn't exist
    let metaTag = document.querySelector('meta[name="fc:frame"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "fc:frame");
      document.head.appendChild(metaTag);
    }

    // Set or update content attribute
    metaTag.setAttribute("content", metaContent);
    metaTag.setAttribute("data-rh", "true");

    // Clean up when component unmounts
    return () => {
      // Don't remove the tag on unmount in case it's needed for SEO
      // Just set it to a basic frame if we're navigating away
      metaTag.setAttribute(
        "content",
        JSON.stringify({
          version: "next",
          imageUrl,
          button: {
            title: "Visit Rafflecast",
            action: "link",
            target: window.location.origin,
          },
        })
      );
    };
  }, [imageUrl, title, frameUrl, appName, splashImage, backgroundColor]);

  // This component doesn't render anything visible
  return null;
};

FrameMeta.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  frameUrl: PropTypes.string.isRequired,
  appName: PropTypes.string,
  splashImage: PropTypes.string,
  backgroundColor: PropTypes.string,
};

FrameMeta.defaultProps = {
  title: "Open Rafflecast",
  appName: "Rafflecast",
  backgroundColor: "#131313",
};

export default FrameMeta;
