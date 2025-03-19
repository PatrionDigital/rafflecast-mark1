// src/frames/components/FrameProvider.jsx
import { useEffect } from "react";
import PropTypes from "prop-types";

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
 * Provider component that initializes Farcaster Frame SDK
 * and makes it available to children components
 */
const FrameProvider = ({ children, autoConnect = true }) => {
  useEffect(() => {
    const initFrame = async () => {
      if (!FrameSDK) {
        console.warn("Frame SDK not available");
        return;
      }

      try {
        // Get context data from Farcaster client
        const context = await FrameSDK.context;

        // Auto-connect if running in a frame and we have a user FID
        if (autoConnect && context?.client?.clientFid) {
          // If using wagmi, can connect to the user's wallet
          if (window.wagmiConfig && window.farcasterFrame) {
            try {
              const { connect } = await import("wagmi/actions");
              connect(window.wagmiConfig, {
                connector: window.farcasterFrame(),
              });
            } catch (err) {
              console.warn("Error connecting with wagmi:", err);
            }
          }
        }

        // Add small delay to allow UI to render before hiding splash screen
        setTimeout(() => {
          if (FrameSDK?.actions?.ready) {
            FrameSDK.actions.ready();
          }
        }, 500);
      } catch (error) {
        console.error("Error initializing Farcaster Frame:", error);
      }
    };

    initFrame();
  }, [autoConnect]);

  return <>{children}</>;
};

FrameProvider.propTypes = {
  children: PropTypes.node.isRequired,
  autoConnect: PropTypes.bool,
};

export default FrameProvider;
