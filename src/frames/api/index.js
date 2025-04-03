// src/frames/api/index.js
/**
 * Core API functions for interacting with Farcaster Mini Apps (formerly Frames)
 * With improved error handling and updated to latest specifications
 */

// Flag to track SDK loading state
let isLoadingSDK = false;
let loadPromise = null;

/**
 * Safely loads the Frame SDK
 * @returns {Promise<Object|null>} The Frame SDK or null if unavailable
 */
const loadFrameSDK = () => {
  // Return existing promise if already loading
  if (isLoadingSDK && loadPromise) {
    return loadPromise;
  }

  // Create new loading promise without using async in the executor
  isLoadingSDK = true;
  loadPromise = new Promise((resolve) => {
    // Only initialize on client side
    if (typeof window !== "undefined") {
      import("@farcaster/frame-sdk")
        .then((module) => {
          resolve(module?.default || null);
        })
        .catch((error) => {
          console.warn("Failed to load Frame SDK:", error);
          resolve(null);
        })
        .finally(() => {
          isLoadingSDK = false;
        });
    } else {
      isLoadingSDK = false;
      resolve(null);
    }
  });

  return loadPromise;
};

/**
 * Signals to Farcaster client that the mini app is ready to display
 * This hides the splash screen
 * @returns {Promise<void>}
 */
export const signalReady = async () => {
  try {
    const FrameSDK = await loadFrameSDK();
    if (!FrameSDK || !FrameSDK.actions || !FrameSDK.actions.ready) {
      console.log("Frame SDK ready function not available");
      return Promise.resolve(); // Silently resolve if not in a frame
    }

    console.log("Signaling ready to Frame SDK");
    return FrameSDK.actions.ready().catch((err) => {
      console.warn("Error in SDK ready call:", err);
      return Promise.resolve(); // Still resolve to prevent disrupting the app
    });
  } catch (error) {
    console.warn("Error signaling ready:", error);
    return Promise.resolve(); // Still resolve to prevent disrupting the app
  }
};

/**
 * Opens an external URL from within the mini app
 * @param {string} url - URL to open
 * @returns {Promise<void>}
 */
export const openUrl = async (url) => {
  try {
    const FrameSDK = await loadFrameSDK();
    if (!FrameSDK || !FrameSDK.actions || !FrameSDK.actions.openUrl) {
      // Fallback for non-frame environments
      window.open(url, "_blank");
      return Promise.resolve();
    }

    return FrameSDK.actions.openUrl(url);
  } catch (error) {
    console.warn("Error opening URL:", error);
    // Fallback
    window.open(url, "_blank");
    return Promise.resolve();
  }
};

/**
 * Closes the current mini app
 * @returns {Promise<void>}
 */
export const closeFrame = async () => {
  try {
    const FrameSDK = await loadFrameSDK();
    if (!FrameSDK || !FrameSDK.actions || !FrameSDK.actions.close) {
      return Promise.resolve(); // Silently resolve if not in a frame
    }

    return FrameSDK.actions.close();
  } catch (error) {
    console.warn("Error closing frame:", error);
    return Promise.resolve(); // Still resolve to prevent disrupting the app
  }
};

/**
 * Gets the current mini app context (user info, etc.)
 * @returns {Promise<Object|null>} Frame context or null if not in a frame
 */
export const getFrameContext = async () => {
  try {
    const FrameSDK = await loadFrameSDK();
    if (!FrameSDK || !FrameSDK.context) {
      return null;
    }

    return await FrameSDK.context;
  } catch (error) {
    console.warn("Error getting frame context:", error);
    return null;
  }
};

/**
 * Checks if the current environment is a Farcaster mini app
 * @returns {Promise<boolean>} True if running in a mini app
 */
export const isInFrame = async () => {
  try {
    const context = await getFrameContext();
    return !!context?.client?.clientFid;
  } catch (error) {
    console.warn("Error checking if in frame:", error);
    return false;
  }
};

/**
 * Gets Farcaster user information from the mini app context
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
    console.warn("Error getting user info:", error);
    return null;
  }
};

/**
 * Debug function to log the full frame context
 * Only works in development mode
 */
export const debugFrameContext = async () => {
  if (import.meta.env.MODE !== "development") return;

  try {
    const context = await getFrameContext();
    console.log("Frame Context:", context);
  } catch (error) {
    console.warn("Error logging frame context:", error);
  }
};
