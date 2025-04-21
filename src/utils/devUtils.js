// src/utils/devUtils.js
// Utility for development authentication

export const DEV_MODE = import.meta.env.MODE === "development";

// Mock Farcaster profile for development
export const MOCK_PROFILE = {
  fid: 12345,
  username: "devadmin",
  displayName: "Dev Admin",
  custody: "0xf17e02c56D8c86767c12332571C91BB29ae302f3",
  verifications: [
    "0xf17e02c56D8c86767c12332571C91BB29ae302f3",
    "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4",
  ],
  pfp: "https://i.imgur.com/dMoIan7.jpg",
};

// Mock authentication hook wrapper
export const useMockAuth = (useAuthHook) => {
  const authData = useAuthHook();

  if (DEV_MODE) {
    return {
      ...authData,
      isAuthenticated: true,
      profile: MOCK_PROFILE,
      status: "connected",
    };
  }

  return authData;
};
