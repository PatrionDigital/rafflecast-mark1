// src/frames/components/FrameProvider.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * Provider component that initializes Farcaster Frame SDK
 * and makes it available to children components
 */
const FrameProvider = ({ children, autoConnect = true }) => {
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const [frameError, setFrameError] = useState(null);

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
            if (isMounted) {
              setFrameError("Failed to load Mini App SDK");
            }
            return null;
          });

          if (module && isMounted) {
            FrameSDK = module.default;
            setSdkInitialized(true);

            // Only try to initialize if successfully loaded
            initFrame(FrameSDK);
          }
        }
      } catch (err) {
        console.warn("Error loading Frame SDK:", err);
        if (isMounted) {
          setFrameError("Error initializing Mini App SDK");
        }
      }
    };

    const initFrame = async (sdk) => {
      if (!sdk) return;

      try {
        // Safely attempt to get context data
        let context = null;
        try {
          context = await sdk.context;
          console.log("Mini App context loaded:", !!context);
        } catch (err) {
          console.log("Not in a Farcaster Mini App context", err);
          return;
        }

        // Auto-connect if running in a frame and we have a user FID
        if (autoConnect && context?.client?.clientFid) {
          console.log("Mini App with FID detected, auto-connecting");

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

        // Listen for frame events
        if (sdk.addEventListener) {
          sdk.addEventListener("stateUpdate", (event) => {
            console.log("Mini App state updated:", event);
          });
        }

        // No need to signal ready here - we'll do it in the individual components
        // after they've loaded their data
      } catch (error) {
        console.warn("Error initializing Farcaster Mini App:", error);
        if (isMounted) {
          setFrameError("Error initializing Mini App");
        }
      }
    };

    // Attempt to load the SDK
    loadFrameSDK();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, [autoConnect]);

  // Add debug info in development
  if (import.meta.env.DEV && frameError) {
    console.warn("Frame Provider Error:", frameError);
  }

  return (
    <>
      {children}
      {import.meta.env.DEV && (
        <div
          style={{
            display: "none", // Hidden by default, change to 'block' to debug
            position: "fixed",
            bottom: "10px",
            right: "10px",
            padding: "5px 10px",
            background: sdkInitialized ? "#4caf50" : "#f44336",
            color: "white",
            fontSize: "12px",
            borderRadius: "4px",
            zIndex: 9999,
          }}
        >
          SDK: {sdkInitialized ? "Initialized" : "Not Initialized"}
          {frameError && <div>Error: {frameError}</div>}
        </div>
      )}
    </>
  );
};

FrameProvider.propTypes = {
  children: PropTypes.node.isRequired,
  autoConnect: PropTypes.bool,
};

export default FrameProvider;
