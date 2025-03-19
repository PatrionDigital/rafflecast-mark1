// src/frames/utils/frameConnector.js
import { SwitchChainError, fromHex, getAddress, numberToHex } from "viem";
import { ChainNotConfiguredError, createConnector } from "wagmi";

/**
 * Custom WAGMI connector for Farcaster Frame SDK
 * This is used to connect to the user's wallet from within a frame
 *
 * @returns {Object} WAGMI connector
 */
export function farcasterFrameConnector() {
  let connected = true;
  let FrameSDK = null;

  // Dynamically import the SDK
  if (typeof window !== "undefined") {
    import("@farcaster/frame-sdk")
      .then((module) => {
        FrameSDK = module.default;
      })
      .catch((error) => {
        console.warn("Failed to load Frame SDK:", error);
      });
  }

  return createConnector((config) => ({
    id: "farcaster",
    name: "Farcaster Wallet",
    type: "farcasterFrame",

    async setup() {
      if (!FrameSDK) {
        console.warn("Frame SDK not loaded yet, waiting...");
        // Wait for SDK to load if not available yet
        let attempts = 0;
        const maxAttempts = 5;

        while (!FrameSDK && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          attempts++;
        }

        if (!FrameSDK) {
          throw new Error("Failed to load Frame SDK after waiting");
        }
      }

      this.connect({ chainId: config.chains[0].id });
    },

    async connect({ chainId } = {}) {
      if (!FrameSDK) {
        throw new Error("Frame SDK not loaded");
      }

      const provider = await this.getProvider();
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      let currentChainId = await this.getChainId();
      if (chainId && currentChainId !== chainId && this.switchChain) {
        const chain = await this.switchChain({ chainId });
        currentChainId = chain.id;
      }

      connected = true;

      return {
        accounts: accounts.map((x) => getAddress(x)),
        chainId: currentChainId,
      };
    },

    async disconnect() {
      connected = false;
    },

    async getAccounts() {
      if (!connected) throw new Error("Not connected");
      if (!FrameSDK) throw new Error("Frame SDK not loaded");

      const provider = await this.getProvider();
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      return accounts.map((x) => getAddress(x));
    },

    async getChainId() {
      if (!FrameSDK) throw new Error("Frame SDK not loaded");

      const provider = await this.getProvider();
      const hexChainId = await provider.request({ method: "eth_chainId" });
      return fromHex(hexChainId, "number");
    },

    async isAuthorized() {
      if (!connected || !FrameSDK) {
        return false;
      }

      try {
        const accounts = await this.getAccounts();
        return !!accounts.length;
      } catch {
        return false;
      }
    },

    async switchChain({ chainId }) {
      if (!FrameSDK) throw new Error("Frame SDK not loaded");

      const provider = await this.getProvider();
      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());

      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHex(chainId) }],
      });
      return chain;
    },

    onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect();
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x)),
        });
    },

    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit("change", { chainId });
    },

    async onDisconnect() {
      config.emitter.emit("disconnect");
      connected = false;
    },

    async getProvider() {
      if (!FrameSDK) throw new Error("Frame SDK not loaded");
      return FrameSDK.wallet.ethProvider;
    },
  }));
}

// Make the connector available globally for the FrameProvider
if (typeof window !== "undefined") {
  window.farcasterFrame = farcasterFrameConnector;
}

export default farcasterFrameConnector;
