// src/frames/utils/frameUtils.js
/**
 * Utilities for working with Farcaster Frames v2 API
 */

/**
 * Generates frame meta tags for initial frame rendering
 * @param {Object} options - Frame configuration options
 * @param {string} options.imageUrl - URL to image displayed in the frame
 * @param {string} options.title - Button title text
 * @param {string} options.frameUrl - URL the frame will open
 * @param {string} options.appName - Name of the application
 * @param {string} options.splashImage - URL to splash image
 * @param {string} options.backgroundColor - Background color for splash screen
 * @returns {Object} - Object containing frame meta tag content
 */
export const generateFrameMeta = ({
  imageUrl,
  title = "Open Rafflecast",
  frameUrl,
  appName = "Rafflecast",
  splashImage,
  backgroundColor = "#131313",
}) => {
  const frameContent = {
    version: "next",
    imageUrl,
    button: {
      title,
      action: {
        type: "launch_frame",
        name: appName,
        url: frameUrl,
        splashImageUrl: splashImage,
        splashBackgroundColor: backgroundColor,
      },
    },
  };

  return {
    metaContent: JSON.stringify(frameContent),
    frameUrl,
    title,
  };
};

/**
 * Truncates an Ethereum address for display
 * @param {string} address - Ethereum address to truncate
 * @returns {string} - Truncated address like 0x1234...5678
 */
export const truncateAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

/**
 * Creates a frame manifest object
 * @param {Object} options - Manifest options
 * @returns {Object} - Frame manifest object
 */
export const createFrameManifest = ({
  name = "Rafflecast",
  description = "Raffles for Farcaster",
  icon = "/favicon.ico",
  domains = [],
}) => {
  return {
    name,
    description,
    icon,
    domains,
  };
};
