// src/hooks/useAuth.js
import { useProfile as useFarcasterProfile } from "@farcaster/auth-kit";
import { useMockAuth, DEV_MODE } from "../utils/devUtils";

export const useAuth = () => {
  // Use the mock authentication in development mode
  if (DEV_MODE) {
    return useMockAuth(useFarcasterProfile);
  }

  // Use the real authentication in production
  return useFarcasterProfile();
};
