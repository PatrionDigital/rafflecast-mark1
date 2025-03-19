// src/frames/components/FrameMeta.jsx
import { useEffect } from "react";
import PropTypes from "prop-types";

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
    // Generate frame meta content based on the latest Farcaster Frame spec
    const frameData = {
      version: "vNext",
      image: imageUrl,
      buttons: [
        {
          label: title || "Open Rafflecast",
          action: "post",
          target: frameUrl,
        },
      ],
    };

    // If splash image is provided, add it to the frame data
    if (splashImage) {
      frameData.postUrl = frameUrl;
    }

    // Create or update fc:frame meta tag
    let frameTag = document.querySelector('meta[name="fc:frame"]');
    if (!frameTag) {
      frameTag = document.createElement("meta");
      frameTag.setAttribute("name", "fc:frame");
      document.head.appendChild(frameTag);
    }
    frameTag.setAttribute("content", JSON.stringify(frameData));

    // Create or update fc:frame:image meta tag
    let imageTag = document.querySelector('meta[name="fc:frame:image"]');
    if (!imageTag) {
      imageTag = document.createElement("meta");
      imageTag.setAttribute("name", "fc:frame:image");
      document.head.appendChild(imageTag);
    }
    imageTag.setAttribute("content", imageUrl);

    // Create or update fc:frame:post_url meta tag
    let postUrlTag = document.querySelector('meta[name="fc:frame:post_url"]');
    if (!postUrlTag) {
      postUrlTag = document.createElement("meta");
      postUrlTag.setAttribute("name", "fc:frame:post_url");
      document.head.appendChild(postUrlTag);
    }
    postUrlTag.setAttribute("content", frameUrl);

    // Create or update other meta tags as needed
    const createOrUpdateTag = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag && content) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      if (tag && content) {
        tag.setAttribute("content", content);
      }
    };

    // Add additional meta tags (older format for compatibility)
    createOrUpdateTag("fc:frame:button:1", title || "Open Rafflecast");
    createOrUpdateTag("fc:frame:button:1:action", "post");

    // Clean up when component unmounts
    return () => {
      // Don't remove the tags on unmount, just update them to basic values
      if (frameTag) {
        frameTag.setAttribute(
          "content",
          JSON.stringify({
            version: "vNext",
            image: imageUrl,
            buttons: [
              {
                label: "Visit Rafflecast",
                action: "link",
                target: window.location.origin,
              },
            ],
          })
        );
      }
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
