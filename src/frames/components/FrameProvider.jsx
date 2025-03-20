// src/frames/components/FrameProvider.jsx
import { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Provider component that initializes Farcaster Frame SDK
 * and makes it available to children components
 */
const FrameProvider = ({ children, autoConnect = true }) => {
  useEffect(() => {
    let FrameSDK = null;
    let isMounted = true;

    const loadFrameSDK = async () => {
      try {
        // Only initialize on client side and if not already loaded
        if (typeof window !== "undefined") {
          // Dynamic import
          const module = await import("@farcaster/frame-sdk").catch((err) => {
            console.warn("Failed to load Frame SDK:", err);
            return null;
          });

          if (module && isMounted) {
            FrameSDK = module.default;

            // Only try to initialize if successfully loaded
            initFrame(FrameSDK);
          }
        }
      } catch (err) {
        console.warn("Error loading Frame SDK:", err);
      }
    };

    const initFrame = async (sdk) => {
      if (!sdk) return;

      try {
        // Safely attempt to get context data
        let context = null;
        try {
          context = await sdk.context;
        } catch (err) {
          console.log("Not in a Farcaster Frame context", err);
          return;
        }

        // Auto-connect if running in a frame and we have a user FID
        if (autoConnect && context?.client?.clientFid) {
          // If using wagmi, can connect to the user's wallet
          if (window.wagmiConfig && window.farcasterFrame) {
            try {
              const { connect } = await import("wagmi/actions");
              connect(window.wagmiConfig, {
                connector: window.farcasterFrame(),
              }).catch((err) => {
                console.warn("Failed to connect with frame connector:", err);
              });
            } catch (err) {
              console.warn("Error importing wagmi/actions:", err);
            }
          }
        }

        // Signal ready if possible
        if (sdk?.actions?.ready) {
          // Small delay to allow UI to render
          setTimeout(() => {
            try {
              sdk.actions.ready().catch((err) => {
                console.warn("Error signaling ready:", err);
              });
            } catch (err) {
              console.warn("Error calling ready action:", err);
            }
          }, 500);
        }
      } catch (error) {
        console.warn("Error initializing Farcaster Frame:", error);
      }
    };

    // Attempt to load the SDK
    loadFrameSDK();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, [autoConnect]);

  return <>{children}</>;
};

FrameProvider.propTypes = {
  children: PropTypes.node.isRequired,
  autoConnect: PropTypes.bool,
};

export default FrameProvider;
