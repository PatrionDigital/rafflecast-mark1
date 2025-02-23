const FARCASTER_HTTP_API_ENDPOINT = "https://hoyt.farcaster.xyz:2281";
const PINATA_FARCASTER_API = "https://api.pinata.cloud/v3/farcaster";

/**
 * Generic function to check user reactions (Like or Recast) on a specific Cast.
 * @param {number} fid - Farcaster ID of the user.
 * @param {number} reactionType - 1 for Like, 2 for Recast.
 * @param {string} targetHash - Hash of the Cast to check reactions for.
 * @returns {boolean} - True if the user has reacted, otherwise False.
 */
const checkUserReaction = async (fid, reactionType, targetHash) => {
  try {
    const response = await fetch(
      `${FARCASTER_HTTP_API_ENDPOINT}/v1/reactionsByFid?fid=${fid}&reaction_type=${reactionType}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reactions");
    }

    const data = await response.json();
    const reactions = data?.messages || [];

    // Check if the reaction list contains the target hash
    const foundReaction = reactions.find(
      (message) => message.data.reactionBody.targetCastId.hash === targetHash
    );

    return !!foundReaction;
  } catch (error) {
    console.error("Error checking user reaction:", error);
    return false;
  }
};

/**
 * Check if a user has liked a specific Cast.
 * @param {number} fid - Farcaster ID of the user.
 * @param {string} targetHash - Hash of the Cast to check.
 * @returns {boolean} - True if the user has liked the Cast, otherwise False.
 */
const checkLikeCondition = async (fid, targetHash) => {
  return await checkUserReaction(fid, 1, targetHash);
};

/**
 * Check if a user has recast a specific Cast.
 * @param {number} fid - Farcaster ID of the user.
 * @param {string} targetHash - Hash of the Cast to check.
 * @returns {boolean} - True if the user has recast the Cast, otherwise False.
 */
const checkRecastCondition = async (fid, targetHash) => {
  return await checkUserReaction(fid, 2, targetHash);
};

/**
 * Get the username of a creator based on their FID.
 * @param {number} fid - Farcaster ID of the creator.
 * @returns {string} - Username of the creator.
 */
const getCreatorUsername = async (fid) => {
  try {
    const response = await fetch(`${PINATA_FARCASTER_API}/users/${fid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch creator data");
    }

    const data = await response.json();
    return data.user.username;
  } catch (err) {
    console.error("Error fetching creator:", err);
    return null;
  }
};

export { checkLikeCondition, checkRecastCondition, getCreatorUsername };
