import { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Component that adds Farcaster Frame meta tags to the document head
 * Following the vNext (v2) Frame spec
 */
const FrameMeta = ({ imageUrl, title = "Join Raffle", frameUrl }) => {
  useEffect(() => {
    // Clear existing frame tags
    document
      .querySelectorAll('meta[name^="fc:frame"]')
      .forEach((tag) => tag.remove());

    // Set up the required tags per the vNext spec
    const tags = [
      // Required tags
      { name: "fc:frame", content: "vNext" },
      { name: "fc:frame:image", content: imageUrl },

      // Button (for post action)
      { name: "fc:frame:button:1", content: title },
      { name: "fc:frame:button:1:action", content: "post" },
      { name: "fc:frame:post_url", content: frameUrl },
    ];

    // Add all tags to the head
    tags.forEach(({ name, content }) => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", name);
      tag.setAttribute("content", content);
      document.head.appendChild(tag);
    });

    return () => {
      // No cleanup needed - tags should remain for page visibility
    };
  }, [imageUrl, title, frameUrl]);

  return null;
};

FrameMeta.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  frameUrl: PropTypes.string.isRequired,
};

export default FrameMeta;
