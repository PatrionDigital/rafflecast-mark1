// src/frames/api/index.js
/**
 * Core API functions for interacting with Farcaster Frames
 */

// Using dynamic import for the SDK to work with ES modules
let FrameSDK = null;
// Only initialize on client side
if (typeof window !== "undefined") {
  // Dynamic import
  import("@farcaster/frame-sdk")
    .then((module) => {
      FrameSDK = module.default;
    })
    .catch((error) => {
      console.warn("Failed to load Frame SDK:", error);
    });
}

/**
 * Signals to Farcaster client that the frame is ready to display
 * This hides the splash screen
 * @returns {Promise<void>}
 */
export const signalReady = () => {
  if (!FrameSDK || !FrameSDK.actions || !FrameSDK.actions.ready) {
    console.warn("Frame SDK ready action not available");
    return Promise.reject(new Error("Frame SDK ready action not available"));
  }

  return FrameSDK.actions.ready();
};

/**
 * Opens an external URL from within the frame
 * @param {string} url - URL to open
 * @returns {Promise<void>}
 */
export const openUrl = (url) => {
  if (!FrameSDK || !FrameSDK.actions || !FrameSDK.actions.openUrl) {
    console.warn("Frame SDK openUrl action not available");
    return Promise.reject(new Error("Frame SDK openUrl action not available"));
  }

  return FrameSDK.actions.openUrl(url);
};

/**
 * Closes the current frame
 * @returns {Promise<void>}
 */
export const closeFrame = () => {
  if (!FrameSDK || !FrameSDK.actions || !FrameSDK.actions.close) {
    console.warn("Frame SDK close action not available");
    return Promise.reject(new Error("Frame SDK close action not available"));
  }

  return FrameSDK.actions.close();
};

/**
 * Gets the current frame context (user info, etc.)
 * @returns {Promise<Object>} Frame context
 */
export const getFrameContext = async () => {
  if (!FrameSDK || !FrameSDK.context) {
    console.warn("Frame SDK context not available");
    return Promise.reject(new Error("Frame SDK context not available"));
  }

  try {
    return await FrameSDK.context;
  } catch (error) {
    console.error("Error getting frame context:", error);
    throw error;
  }
};

/**
 * Checks if the current environment is a Farcaster frame
 * @returns {Promise<boolean>} True if running in a frame
 */
export const isInFrame = async () => {
  if (!FrameSDK) return false;

  try {
    const context = await getFrameContext();
    return !!context?.client?.clientFid;
  } catch (error) {
    console.error("Error checking if in frame:", error);
    return false;
  }
};

/**
 * Gets Farcaster user information from the frame context
 * @returns {Promise<Object|null>} User information or null if not available
 */
export const getUserInfo = async () => {
  try {
    const context = await getFrameContext();

    if (!context?.user) {
      return null;
    }

    return {
      fid: context.user.fid,
      username: context.user.username,
      displayName: context.user.displayName,
      pfp: context.user.pfp,
      custody: context.user.custody,
    };
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};
